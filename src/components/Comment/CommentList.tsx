// src/components/CommentList.tsx
import React from "react";
import type { Comment } from "../../types/comment";
import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: Comment[];
    activeReplyId: string | null;
    onReplyClick: (id: string) => void;
    onCancelReply: () => void;
    onReplySubmit: (parentId: string, content: string) => void;
}

function CommentList({ comments, ...props }: CommentListProps) {
    return (
        <div className="comment-list">
            {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} {...props} />
            ))}
        </div>
    );
}

export default CommentList;
