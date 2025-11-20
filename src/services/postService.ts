// src/services/postService.ts
import axios from "axios";
import type {Post} from "../@type/post.ts";

export const PostService = {
    getPosts: async (): Promise<Post[]> => {
        const response = await axios.get("/api/posts");
        return response.data;
    },
    createPost: async (content: string, mediaUrl?: string): Promise<Post> => {
        const response = await axios.post("/api/posts", { content, mediaUrl });
        return response.data;
    },
    likePost: async (postId: string): Promise<Post> => {
        const response = await axios.post(`/api/posts/${postId}/like`);
        return response.data;
    },
    commentPost: async (postId: string, text: string): Promise<Comment> => {
        const response = await axios.post(`/api/posts/${postId}/comment`, { text });
        return response.data;
    },
};
