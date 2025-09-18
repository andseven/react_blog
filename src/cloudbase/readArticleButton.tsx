// src/components/ReadArticleButton.tsx
import React, { useState } from "react";
import { Button } from "antd";
import { db } from "../cloudbase/cloudbase"; // 引入统一实例
import type { Article } from "../types/article";
import '@ant-design/v5-patch-for-react-19'; // antd 5 对 React 19 的补丁

interface ReadArticleButtonProps {
    articleId: string;
}

const ReadArticleButton: React.FC<ReadArticleButtonProps> = ({ articleId }) => {
    const [loading, setLoading] = useState(false);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const res = await db.collection("articles").doc(articleId).get();
            if (res.data.length > 0) {
                const doc = res.data[0];
                const article: Article = {
                    ...doc,
                    date: new Date(doc.date),
                    comments: doc.comments?.map((c: any) => ({
                        ...c,
                        date: new Date(c.date),
                        replies: c.replies?.map((r: any) => ({
                            ...r,
                            date: new Date(r.date),
                        })),
                    })),
                };
                console.log("文章数据:", article);
            } else {
                console.log("没有找到该文章");
            }
        } catch (err) {
            console.error("读取文章失败:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button type="primary" onClick={fetchArticle} loading={loading}>
            读取文章
        </Button>
    );
};

export default ReadArticleButton;
