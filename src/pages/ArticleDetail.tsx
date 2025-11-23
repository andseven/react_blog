import React, { useEffect, useState, useMemo, lazy, Suspense, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spin, Result, Avatar, Divider, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
// [恢复懒加载] 正常导入样式对象
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// [恢复懒加载] 使用 React.lazy 动态引入体积庞大的语法高亮组件
const SyntaxHighlighter = lazy(() =>
    import("react-syntax-highlighter/dist/esm/prism").then((module) => ({
        default: module.default,
    }))
);
import { db } from "../cloudbase/cloudbase";
import type { Article } from "../types/article";
import type { Comment } from "../types/comment";
import s from "./ArticleDetail.module.scss";
import { WEBSITE_TITLE } from "../config/siteConfig";
import remarkGfm from "remark-gfm";
import "@ant-design/v5-patch-for-react-19";
import CommentSection from "../components/Comment/CommentSection";

// 辅助函数：在评论树中递归添加回复
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
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: string) => {
        return date.split("T")[0];
    };

    // 递归统计总评论数
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
                    const raw = res.data[0] as Article & { date: string | Date };
                    const data: Article = {
                        ...raw,
                        date:
                            typeof raw.date === "string"
                                ? raw.date
                                : new Date(raw.date).toISOString(),
                    };
                    setArticle(data);
                    setComments(data.comments || []);
                    document.title = `${data.title} - ${WEBSITE_TITLE}`;
                } else {
                    setArticle(null);
                }
            } catch (err: unknown) {
                console.error("获取文章失败:", err);
                setError("加载文章失败，请稍后重试。");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

        return () => {
            document.title = WEBSITE_TITLE;
        };
    }, [id]);

    const POLL_INTERVAL_MS = 10000;
    const commentsSnapshotRef = useRef<string>(JSON.stringify(comments));

    useEffect(() => {
        commentsSnapshotRef.current = JSON.stringify(comments);
    }, [comments]);

    useEffect(() => {
        if (!id) return;
        const poll = async () => {
            try {
                const res = await db.collection("articles").doc(id).get();
                const data = res.data?.[0] as Article | undefined;
                if (!data) return;
                const newComments = data.comments || [];
                const newJson = JSON.stringify(newComments);
                if (newJson !== commentsSnapshotRef.current) {
                    commentsSnapshotRef.current = newJson;
                    setComments(newComments);
                }
            } catch (e) {
                console.error("轮询评论失败:", e);
            }
        };
        const timer = window.setInterval(poll, POLL_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [id]);

    // 更新数据库中的评论
    const updateCommentsInDB = async (updatedComments: Comment[]) => {
        if (!id) return;
        try {
            await db.collection("articles").doc(id).update({
                comments: updatedComments,
            });
            message.success("评论发布成功！");
        } catch (err) {
            console.error("更新评论失败:", err);
            message.error("评论发布失败，请稍后重试。");
            setComments(article?.comments || []); // 失败时回滚状态
        }
    };

    // 提交顶层评论
    const handleTopLevelSubmit = (content: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            user: "匿名用户", // 后续可替换为真实用户
            content,
            date: new Date().toISOString(),
            replies: [],
        };
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        updateCommentsInDB(updatedComments);
    };

    // 提交回复
    const handleReplySubmit = (parentId: string, content: string) => {
        const newReply: Comment = {
            id: Date.now().toString(),
            user: "匿名用户",
            content,
            date: new Date().toISOString(),
        };
        const updatedComments = addReplyToTree(comments, parentId, newReply);
        setComments(updatedComments);
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
                        children={article.content}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(
                                    className || ""
                                );
                                const codeText = String(children).trim();
                                const codeToCopy = codeText.replace(/\n$/, "");

                                const handleCopy = () => {
                                    navigator.clipboard
                                        .writeText(codeToCopy)
                                        .then(() => {
                                            message.success(
                                                "代码已复制到剪贴板！"
                                            );
                                        })
                                        .catch((err) => {
                                            message.error("复制失败，请重试。");
                                            console.error("复制操作失败:", err);
                                        });
                                };

                                // 判断是否为内联代码：
                                // 1. 没有 language-xxx className（代码块会有）
                                // 2. 或者内容不包含换行符
                                const isInlineCode =
                                    !match && !codeText.includes("\n");

                                if (isInlineCode) {
                                    return (
                                        <code
                                            className={`${s.inlineCode} ${
                                                className || ""
                                            }`}
                                            style={{
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-all",
                                            }}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    );
                                }

                                // 代码块渲染
                                return (
                                    <Suspense
                                        fallback={
                                            <pre className={s.codeFallback}>
                                                加载代码中...
                                            </pre>
                                        }
                                    >
                                        <div
                                            style={{
                                                position: "relative",
                                                margin: "1em 0",
                                            }}
                                        >
                                            <button
                                                onClick={handleCopy}
                                                style={{
                                                    position: "absolute",
                                                    top: "0.5em",
                                                    right: "0.5em",
                                                    zIndex: 1,
                                                    border: "1px solid #555",
                                                    background: "#3a3a3a",
                                                    color: "#ccc",
                                                    padding: "2px 8px",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "0.8em",
                                                    opacity: 0.7,
                                                }}
                                                onMouseOver={(e) =>
                                                    (e.currentTarget.style.opacity =
                                                        "1")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.currentTarget.style.opacity =
                                                        "0.7")
                                                }
                                            >
                                                复制
                                            </button>
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={
                                                    match ? match[1] : undefined
                                                }
                                                PreTag="div"
                                            >
                                                {codeToCopy}
                                            </SyntaxHighlighter>
                                        </div>
                                    </Suspense>
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
