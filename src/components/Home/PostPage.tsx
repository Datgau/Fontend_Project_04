// src/components/Home/PostPage.tsx
import { useState, useEffect } from "react";
import styles from "../../pages/Home/Home.module.css";
import CommentSection from "./CommentSection";
import { PostService } from "../../services/postService.ts";
import type { Post, Comment } from "../../@type/post.ts";

interface PostProps {
    post: Post;
    onCommentAdded: (postId: string, comment: Comment) => void;
    onLikeToggled: (postId: string, isLiked: boolean) => void; // thêm callback
    currentUserId: string; // user hiện tại
}

const PostPage = ({ post, onCommentAdded, onLikeToggled, currentUserId }: PostProps) => {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUserId));
    }, [post.likes, currentUserId]);

    const handleLike = async () => {
        try {
            await PostService.likePost(post.id);
            const newLiked = !isLiked;
            setIsLiked(newLiked);
            onLikeToggled(post.id, newLiked); // cập nhật Home state
        } catch (error) {
            alert("Lỗi khi thích bài viết");
        }
    };

    return (
        <div className={styles.post}>
            <div className={styles.postHeader}>
                <img src={post.user.avatar} alt={post.user.username} />
                <span>{post.user.username}</span>
            </div>
            <p>{post.content}</p>
            {post.mediaUrl && <img src={post.mediaUrl} alt="PostPage media" />}
            <div className={styles.postActions}>
                <button onClick={handleLike}>
                    {isLiked ? "Đã thích" : "Thích"}
                </button>
                <span>{post.likes.length} lượt thích</span>
            </div>
            <CommentSection
                postId={post.id}
                comments={post.comments}
                onCommentAdded={(comment) => onCommentAdded(post.id, comment)}
            />
        </div>
    );
};

export default PostPage;
