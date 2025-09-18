// src/types/article.ts
import type { Comment } from "./comment";
export interface Article {
    _id?: string; // 云数据库自动生成的 ID
    _openid?: string; // 作者的 OpenID
    id: string;
    title: string;
    summary: string;
    author: string;
    date: string | Date;
    coverImage?: string; // 可选封面图
    likes: number; // 文章点赞数
    comments: Comment[]; // 文章评论数
    content: string; // 文章内容
}
