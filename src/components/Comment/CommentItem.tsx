// src/components/CommentItem.tsx
import React from "react";
import type { Comment } from "../../types/comment";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface CommentItemProps {
    comment: Comment;
    activeReplyId: string | null;
    onReplyClick: (id: string) => void;
    onCancelReply: () => void;
    onReplySubmit: (parentId: string, content: string) => void;
}

function CommentItem({
    comment,
    activeReplyId,
    onReplyClick,
    onCancelReply,
    onReplySubmit,
}: CommentItemProps) {
    const isReplying = activeReplyId === comment.id;

    const handleReplySubmit = (content: string) => {
        onReplySubmit(comment.id, content);
    };

    return (
        <div className="comment-item">
            <div className="comment-content">
                <p className="comment-author">{comment.user}</p>
                <p className="comment-text">{comment.content}</p>
                <div className="comment-actions">
                    <span>{new Date(comment.date).toLocaleString()}</span>
                    <button
                        onClick={() => onReplyClick(comment.id)}
                        className="reply-btn"
                    >
                        回复
                    </button>
                </div>
            </div>

            {/* 条件渲染回复表单 */}
            {isReplying && (
                <CommentForm
                    onSubmit={handleReplySubmit}
                    onCancel={onCancelReply}
                    placeholder={`回复 @${comment.user}...`}
                />
            )}

            {/* 递归渲染子评论 */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                    <CommentList
                        comments={comment.replies}
                        activeReplyId={activeReplyId}
                        onReplyClick={onReplyClick}
                        onCancelReply={onCancelReply}
                        onReplySubmit={onReplySubmit}
                    />
                </div>
            )}
        </div>
    );
}

export default CommentItem;
