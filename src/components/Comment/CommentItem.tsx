// src/components/CommentItem.tsx
import type { Comment } from "../../types/comment";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import s from "./Comment.module.scss";
import { useTheme } from "../../context/useTheme";

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
    
    const { primaryColor } = useTheme();

    return (
        <div className={s.commentItem}>
            <div className={s.commentContent}>
                <p className={s.commentAuthor}>{comment.user}</p>
                <p className={s.commentText}>{comment.content}</p>
                <div className={s.commentActions}>
                    <span>{new Date(comment.date).toLocaleString()}</span>
                    <button
                        onClick={() => onReplyClick(comment.id)}
                        className={s.replyBtn}
                        style={{ color: primaryColor }}
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
                <div className={s.commentReplies}>
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
