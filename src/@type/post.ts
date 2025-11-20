// src/@type/post.ts
export interface User {
    id: string;
    username: string;
    avatar: string;
}

export interface Post {
    id: string;
    user: User;
    content: string;
    mediaUrl?: string;
    likes: string[]; // userIds
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    id: string;
    user: User;
    text: string;
    createdAt: string;
}
