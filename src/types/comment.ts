export interface Comment {
    id: string;
    content: string;
    user: string;
    date: string | Date;
    replies?: Comment[];  // 嵌套评论
}