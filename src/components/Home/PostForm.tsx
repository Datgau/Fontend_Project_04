// src/pages/Home/components/PostForm.tsx
import { useState } from "react";
import styles from "../../pages/Home/Home.module.css";
import type {Post} from "../../@type/post.ts";
import {PostService} from "../../services/postService.ts";

interface PostFormProps {
    onPostCreated: (post: Post) => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const newPost = await PostService.createPost(content, mediaUrl);
            onPostCreated(newPost);
            setContent("");
            setMediaUrl("");
        } catch (error) {
            alert("Lỗi khi đăng bài");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={styles.postForm} onSubmit={handleSubmit}>
      <textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
      />
            <input
                type="text"
                placeholder="Link hình ảnh (tùy chọn)"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
            />
            <button type="submit" disabled={submitting}>
                {submitting ? "Đang đăng..." : "Đăng"}
            </button>
        </form>
    );
};

export default PostForm;
