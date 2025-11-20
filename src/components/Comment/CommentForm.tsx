import React, { useState } from "react";
import s from "./Comment.module.scss";
import { useTheme } from "../../context/useTheme";

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

    const { primaryColor } = useTheme();

    return (
        <form className={s.commentForm} onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={4}
                required
            />
            <div className={s.formActions}>
                {onCancel && (
                    <button
                        type="button"
                        className={s.cancelBtn}
                        onClick={onCancel}
                    >
                        取消
                    </button>
                )}
                <button type="submit" style={{ '--button-bg-color': primaryColor } as React.CSSProperties}>发布</button>
            </div>
        </form>
    );
}

export default CommentForm;
