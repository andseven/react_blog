import React, { useState } from "react";

interface CommentFormProps {
    onSubmit: (content: string) => void;
    onCancel?: () => void; // 可选的取消回调
    placeholder?: string;
}

function CommentForm({
    onSubmit,
    onCancel,
    placeholder = "写下你的评论...",
}: CommentFormProps) {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={4}
                required
            />
            <div className="form-actions">
                {onCancel && (
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        取消
                    </button>
                )}
                <button type="submit">发布</button>
            </div>
        </form>
    );
}

export default CommentForm;
