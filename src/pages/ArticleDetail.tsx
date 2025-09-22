/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Spin, Result, Avatar, Divider, message } from "antd"; // 引入 antd 的 message 组件用于提示
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { db } from "../cloudbase/cloudbase";
import type { Article } from "../types/article";
import type { Comment } from "../types/comment"; // ✅ 引入 Comment 类型
import s from "./ArticleDetail.module.scss";
import CodeBlock from "../components/CodeBlock/CodeBlock";
import { WEBSITE_TITLE } from "../config/siteConfig";
import remarkGfm from "remark-gfm";
import "@ant-design/v5-patch-for-react-19";
import CommentSection from "../components/Comment/CommentSection";


// ✅ 将递归添加回复的辅助函数放在这里，或者放到一个公共的 utils 文件中
const addReplyToTree = (
    comments: Comment[],
    parentId: string,
    newReply: Comment
): Comment[] => {
    return comments.map((comment) => {
        if (comment.id === parentId) {
            return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
            };
        } else if (comment.replies && comment.replies.length > 0) {
            return {
                ...comment,
                replies: addReplyToTree(comment.replies, parentId, newReply),
            };
        }
        return comment;
    });
};

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [article, setArticle] = useState<Article | null>(null);
    // ✅ 单独为 comments 创建一个 state，这样更新评论时无需重置整个 article 对象，性能更好
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: string | Date) => {
        if (typeof date === "string") return date.split("T")[0];
        return date.toLocaleDateString();
    };

    // 递归统计嵌套评论数量
    const countComments = (comments: Article["comments"]): number => {
        if (!comments) return 0;
        return comments.reduce(
            (acc, c) => acc + 1 + countComments(c.replies || []),
            0
        );
    };

    const totalCommentCount = useMemo(
        () => countComments(comments),
        [comments]
    );

    useEffect(() => {
        if (!id) {
            setError("无效的文章ID。");
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await db.collection("articles").doc(id).get();
                if (res.data && res.data.length > 0) {
                    const data = res.data[0] as Article;
                    setArticle(data);
                    // ✅ 从获取的文章数据中初始化评论状态
                    setComments(data.comments || []);
                    document.title = `${data.title} - ${WEBSITE_TITLE}`;
                } else {
                    setArticle(null);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error("获取文章失败:", err.message);
                    setError("加载文章失败，请稍后重试。");
                } else {
                    console.error("获取文章失败:", err);
                    setError("加载文章失败，请稍后重试。");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

        return () => {
            document.title = WEBSITE_TITLE;
        };
    }, [id]);

    // ✅ 新增：处理数据库更新的函数
    const updateCommentsInDB = async (updatedComments: Comment[]) => {
        if (!id) return;
        try {
            // 使用 doc(id).update 方法更新数据库中的 comments 字段
            await db.collection("articles").doc(id).update({
                comments: updatedComments,
            });
            message.success("评论发布成功！");
        } catch (err) {
            console.error("更新评论失败:", err);
            message.error("评论发布失败，请稍后重试。");
            // 如果数据库更新失败，将 UI 状态回滚到更新前的状态
            setComments(article?.comments || []);
        }
    };

    // 处理顶层评论提交的函数
    const handleTopLevelSubmit = (content: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            user: "匿名用户", // TODO: 替换为真实的登录用户信息
            content,
            date: new Date().toISOString(),
            replies: [],
        };
        const updatedComments = [...comments, newComment];
        // 1. 立即更新UI，提供更好的用户体验
        setComments(updatedComments);
        // 2. 将更新后的评论数组提交到数据库
        updateCommentsInDB(updatedComments);
    };

    // 处理回复提交的函数
    const handleReplySubmit = (parentId: string, content: string) => {
        const newReply: Comment = {
            id: Date.now().toString(),
            user: "匿名用户", // TODO: 替换为真实的登录用户信息
            content,
            date: new Date().toISOString(),
        };
        const updatedComments = addReplyToTree(comments, parentId, newReply);
        // 1. 立即更新UI
        setComments(updatedComments);
        // 2. 将更新后的评论数组提交到数据库
        updateCommentsInDB(updatedComments);
    };

    if (loading) {
        return (
            <div className={s.statusContainer}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Result status="error" title="加载出错" subTitle={error} />;
    }
    if (!article) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="抱歉，您要找的文章不存在。"
            />
        );
    }

    return (
        <div className={s.container}>
            <article className={`${s.contentBlock} ${s.article}`}>
                <header className={s.header}>
                    {/* ...文章头部内容不变... */}
                    <h1 className={s.title}>{article.title}</h1>
                    <div className={s.meta}>
                        <div className={s.authorInfo}>
                            <Avatar icon={<UserOutlined />} size="small" />
                            <span>{article.author}</span>
                        </div>
                        <Divider type="vertical" />
                        <span>{formatDate(article.date)}</span>
                        <Divider type="vertical" />
                        <span>{article.likes} 次点赞</span>
                    </div>
                </header>

                {article.coverImage && (
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className={s.coverImage}
                    />
                )}

                <div className={s.content}>
                    <ReactMarkdown
                        // ...ReactMarkdown 配置不变...
                        children={article.content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, children }) => {
                                if (
                                    node?.children &&
                                    node.children.length === 1 &&
                                    // @ts-expect-error: react-markdown 的类型定义不包含 tagName
                                    node.children[0].tagName === "code"
                                ) {
                                    return <>{children}</>;
                                }
                                return (
                                    <div className={s.paragraph}>
                                        {children}
                                    </div>
                                );
                            },
                            code: ({
                                inline,
                                className,
                                children,
                                ...props
                            }: any) => {
                                const match = /language-(\w+)/.exec(
                                    className || ""
                                );
                                const codeString = String(children).replace(
                                    /\n$/,
                                    ""
                                );
                                return !inline ? (
                                    <CodeBlock
                                        language={match ? match[1] : null}
                                        value={codeString}
                                    />
                                ) : (
                                    <code className={s.inlineCode} {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    />
                </div>
            </article>
            <div className={`${s.contentBlock} ${s.commentWrapper}`}>
                <CommentSection
                    comments={comments}
                    totalCount={totalCommentCount}
                    onTopLevelSubmit={handleTopLevelSubmit}
                    onReplySubmit={handleReplySubmit}
                />
            </div>
        </div>
    );
};

export default ArticleDetail;
