// src/pages/ArticleDetail/ArticleDetail.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Result, Avatar, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";

import { db } from "../cloudbase/cloudbase"; 
import type { Article } from "../types/article"; 
import s from "./ArticleDetail.module.scss";
import CodeBlock from "../components/CodeBlock/CodeBlock"; // CodeBlock
import {WEBSITE_TITLE} from "../config/siteConfig"; // 引入网站标题
import remarkGfm from 'remark-gfm';
import '@ant-design/v5-patch-for-react-19';
import Skeleton from '@ant-design/pro-skeleton';

const ArticleDetail: React.FC = () => {
    // 1. 从路由参数中获取文章的 _id
    const { id } = useParams<{ id: string }>();

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const formatDate = (date: string | Date) => {
        if (typeof date === "string") return date.split("T")[0]; // 保留 YYYY-MM-DD
        return date.toLocaleDateString();
    };

    useEffect(() => {
        // 确保 id 存在
        if (!id) {
            setError("无效的文章ID。");
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            try {
                // 2. 使用 .doc(id) 方法通过 _id 精确查询单个文档
                const res = await db.collection("articles").doc(id).get();
                if (res.data) {
                    const data = res.data[0];
                    setArticle(data as Article); // 将获取的数据设置为 Article 类型
                    console.log(data);
                    document.title = `${data.title} - ${WEBSITE_TITLE}`; // 设置页面标题
                } else {
                    setArticle(null); // 如果 res.data 为空，说明未找到文档
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("获取文章失败:", err);
                    setError("加载文章失败，请稍后重试。");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();

        // 组件卸载时，中止可能还在进行的请求
        return () => {
            controller.abort();
            document.title = WEBSITE_TITLE; // 恢复默认标题
        };
    }, [id]); // 依赖 id，当 id 变化时重新请求

    // 3. 根据不同状态显示不同UI
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

    // 4. 成功获取数据后，渲染文章内容
    return (
        <div className={s.container}>
            <article className={s.article}>
                <header className={s.header}>
                    <h1 className={s.title}>{article.title}</h1>
                    <div className={s.meta}>
                        <div className={s.authorInfo}>
                            <Avatar icon={<UserOutlined />} size="small" />
                            <span>{article.author}</span>
                        </div>
                        <Divider type="vertical" />
                        <span>
                            {formatDate(article.date)}
                        </span>
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
                            p: ({ node, children }) => {
                                if (
                                    node?.children &&
                                    node.children.length === 1 &&
                                    // @ts-expect-error: react-markdown 的类型定义不包含 tagName
                                    node.children[0].tagName === "code"
                                ) {
                                    return <>{children}</>; // ✅ 直接返回子节点，不再额外包裹
                                }

                                return (
                                    <div className={s.paragraph}>
                                        {children}
                                    </div>
                                );
                            },

                            code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
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
        </div>
    );
};

export default ArticleDetail;
