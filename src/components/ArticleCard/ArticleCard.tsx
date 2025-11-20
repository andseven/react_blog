import React from "react";
import { Card, Avatar } from "antd";
import type { Article } from "../../types/article";
import s from "./ArticleCard.module.scss";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

interface ArticleCardProps {
    article: Article;
}

const formatDate = (date: string) => {
    return date.split("T")[0];
};

// 递归统计嵌套评论数量
const countComments = (comments: Article["comments"]): number => {
    if (!comments) return 0;
    return comments.reduce(
        (acc, c) => acc + 1 + countComments(c.replies || []),
        0
    );
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${article._id}`); // 跳转到文章详情页
    };

    return (
        <Card
            hoverable
            className={s.articleCard}
            cover={article.coverImage ? <img alt={article.title} src={article.coverImage} /> : null}
            onClick={handleClick} // 整个 Card 都可以点击
            style={{ cursor: "pointer" }} // 鼠标提示手型
        >
            <Meta
                avatar={<Avatar>{article.author?.[0] || "U"}</Avatar>}
                title={article.title}
                description={
                    <>
                        <p className={s.summary}>{article.summary}</p>
                        <p className={s.meta}>
                            作者: {article.author || "匿名"} · {formatDate(article.date)} · {article.likes} 点赞 · {countComments(article.comments)} 评论
                        </p>
                    </>
                }
            />
        </Card>
    );
};

export default ArticleCard;
