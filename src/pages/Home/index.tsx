// src/pages/Home/index.tsx
import { useEffect, useState } from "react";
import { PostService } from "../../services/postService.ts";
import { useAuth } from "../../routes/AuthContext.tsx";
import styles from "./Home.module.css";
import Stories from "../../components/Home/Stories.tsx";
import type { Post, Comment } from "../../@type/post.ts";
import PostForm from "../../components/Home/PostForm.tsx";
import PostPage from "../../components/Home/PostPage.tsx";
import Header from "../../components/Home/Header.tsx";

const Home = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await PostService.getPosts();
                if (Array.isArray(data)) {
                    setPosts(data);
                } else if (data?.result && Array.isArray(data.result)) {
                    setPosts(data.result);
                } else {
                    setPosts([]);
                }
            } catch (error) {
                alert("Lỗi khi tải bài viết");
                setPosts([]); // fallback
            }
        };

        fetchPosts();
    }, []);

    const handlePostCreated = (newPost: Post) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const handleCommentAdded = (postId: string, comment: Comment) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? { ...post, comments: [...post.comments, comment] }
                    : post
            )
        );
    };

    const handleLikeToggled = (postId: string, isLiked: boolean) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                        ...post,
                        likes: isLiked
                            ? [...post.likes, currentUser?.id || ""]
                            : post.likes.filter((id) => id !== currentUser?.id),
                    }
                    : post
            )
        );
    };

    // Nếu posts chưa phải array, render fallback
    const postsArray = Array.isArray(posts) ? posts : [];

    return (
        <div className={styles.home}>
            <Header />
            <div className={styles.container}>
                <Stories />
                <PostForm onPostCreated={handlePostCreated} />
                {postsArray.map((post) => (
                    <PostPage
                        key={post.id}
                        post={post}
                        onCommentAdded={handleCommentAdded}
                        onLikeToggled={handleLikeToggled}
                        currentUserId={currentUser?.id || ""}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
