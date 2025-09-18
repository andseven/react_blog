// src/components/InsertArticleButton.tsx
import React from "react";
import { auth, db } from "./cloudbase"; // 引入统一实例
auth.signInAnonymously().catch(console.error);
import articlesData from "../../public/articles.json";

// 获取数据库实例
const collection = db.collection("articles");

// 多篇示例文章数据
const sampleArticles = articlesData as any[]; // 假设 articlesData 是一个包含多篇文章的数组

const InsertArticleButton: React.FC = () => {
    const handleInsert = async () => {
        try {
            for (const article of sampleArticles) {
                const formattedArticle = {
                    ...article,
                    date:
                        article.date instanceof Date
                            ? article.date.toISOString()
                            : article.date,
                    comments: article.comments.map((c) => ({
                        ...c,
                        date:
                            c.date instanceof Date
                                ? c.date.toISOString()
                                : c.date,
                        replies: c.replies?.map((r) => ({
                            ...r,
                            date:
                                r.date instanceof Date
                                    ? r.date.toISOString()
                                    : r.date,
                        })),
                    })),
                };

                const res = await collection.add(formattedArticle);
                console.log("插入结果：", res);
            }
            alert("示例文章已全部插入成功！");
        } catch (err) {
            console.error(err);
            alert("插入失败，请查看控制台。");
        }
    };

    return <button onClick={handleInsert}>插入多篇示例文章</button>;
};

export default InsertArticleButton;
