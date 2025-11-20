// src/components/Home/CommentSection.tsx
import { useState } from "react";
import PostComment from "./PostComment";
import styles from "../../pages/Home/Home.module.css";
import {PostService} from "../../services/postService.ts";

interface CommentSectionProps {
    postId: string;
    comments: any[];
    onCommentAdded: (comment: any) => void;
}

const CommentSection = ({ postId, comments, onCommentAdded }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState("");

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const newComment = await PostService.commentPost(postId, commentText);
            onCommentAdded(newComment);
            setCommentText("");
        } catch (error) {
            alert("Lỗi khi bình luận");
        }
    };

    return (
        <div className={styles.comments}>
            {comments.map((comment) => (
                <PostComment key={comment.id} comment={comment} />
            ))}
            <div className={styles.commentInput}>
                <input
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <button onClick={handleComment}>Gửi</button>
            </div>
        </div>
    );
};

export default CommentSection;
