// src/components/CommentSection.tsx
import React, { useState } from "react";
import type { Comment } from "../../types/comment";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

// 定义 props 的类型
interface CommentSectionProps {
    comments: Comment[];
    totalCount: number; // 总评论数
    onTopLevelSubmit: (content: string) => void;
    onReplySubmit: (parentId: string, content: string) => void;
}



function CommentSection({ comments, totalCount, onTopLevelSubmit, onReplySubmit }: CommentSectionProps) {
    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

    const handleReplySubmitAndCloseForm = (parentId: string, content: string) => {
        onReplySubmit(parentId, content);
        setActiveReplyId(null);
    };

    return (
        <div className="comment-section">
            <h2>评论区 ({totalCount})</h2>
            {/* 这个表单用于提交顶层评论 */}
            <CommentForm onSubmit={onTopLevelSubmit} />
            <hr />
            {/* 列表负责接收和传递所有需要的 props */}
            <CommentList 
                comments={comments}
                activeReplyId={activeReplyId}
                onReplyClick={setActiveReplyId}
                onCancelReply={() => setActiveReplyId(null)}
                onReplySubmit={handleReplySubmitAndCloseForm}
            />
        </div>
    );
}

export default CommentSection;
