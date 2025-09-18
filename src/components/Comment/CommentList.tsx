// src/components/CommentList.tsx
import type { Comment } from "../../types/comment";
import CommentItem from "./CommentItem";
import s from "./Comment.module.scss";

interface CommentListProps {
    comments: Comment[];
    activeReplyId: string | null;
    onReplyClick: (id: string) => void;
    onCancelReply: () => void;
    onReplySubmit: (parentId: string, content: string) => void;
}

function CommentList({ comments, ...props }: CommentListProps) {
    return (
        <div className={s.commentList}>
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} {...props} />
            ))}
        </div>
    );
}

export default CommentList;
