// src/types/article.ts
import type { Comment } from "./comment";
export interface Article {
    _id?: string;
    _openid?: string;
    title: string;
    summary: string;
    author: string;
    date: string;
    coverImage?: string;
    likes: number;
    comments: Comment[];
    content: string;
}
