// src/components/Home/PostPage.tsx
import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Box,
    Chip,
    Collapse,
    Divider
} from "@mui/material";
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ChatBubbleOutline as CommentIcon,
    MoreVert as MoreVertIcon,
    AccessTime as TimeIcon
} from "@mui/icons-material";
import CommentSection from "./CommentSection";
import { PostService } from "../../services/postService.ts";
import type { Post, Comment } from "../../@type/post.ts";

interface PostProps {
    post: Post;
    onCommentAdded: (postId: string, comment: Comment) => void;
    onLikeToggled: (postId: string, isLiked: boolean) => void;
    currentUserId: string;
}

const PostPage = ({
                      post,
                      onCommentAdded,
                      onLikeToggled,
                      currentUserId
                  }: PostProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes.length);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUserId));
        setLikeCount(post.likes.length);
    }, [post.likes, currentUserId]);

    const handleLike = async () => {
        try {
            await PostService.likePost(post.id);
            const newLiked = !isLiked;
            setIsLiked(newLiked);
            setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
            onLikeToggled(post.id, newLiked);
        } catch (error) {
            alert("Lỗi khi thích bài viết");
        }
    };

    const formatDate = (date: string | Date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

        if (diff < 60) return "Vừa xong";
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return `${Math.floor(diff / 86400)} ngày trước`;
    };

    return (
        <Card
            elevation={2}
            sx={{
                borderRadius: 3,
                mb: 3,
                overflow: "visible",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: 4
                }
            }}
        >
            <CardHeader
                avatar={
                    <Avatar
                        src={post.user.avatar}
                        alt={post.user.username}
                        sx={{
                            width: 44,
                            height: 44,
                            border: "2px solid",
                            borderColor: "grey.200"
                        }}
                    />
                }
                action={
                    <IconButton aria-label="settings" size="small">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={
                    <Typography variant="subtitle1" fontWeight={600}>
                        {post.user.username}
                    </Typography>
                }
                subheader={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                        <TimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(post.createdAt || new Date())}
                        </Typography>
                    </Box>
                }
                sx={{ pb: 1.5 }}
            />

            <CardContent sx={{ pt: 0, pb: 1.5 }}>
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.6,
                        mb: post.mediaUrl ? 2 : 0
                    }}
                >
                    {post.content}
                </Typography>

                {post.mediaUrl && (
                    <Box
                        sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            mt: 2,
                            backgroundColor: "grey.100"
                        }}
                    >
                        <Box
                            component="img"
                            src={post.mediaUrl}
                            alt="Post media"
                            sx={{
                                width: "100%",
                                maxHeight: 500,
                                objectFit: "cover",
                                display: "block"
                            }}
                        />
                    </Box>
                )}
            </CardContent>

            <Box sx={{ px: 2, py: 1, display: "flex", justifyContent: "space-between" }}>
                <Chip
                    icon={<FavoriteIcon sx={{ fontSize: 16, color: "error.main" }} />}
                    label={`${likeCount} lượt thích`}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderColor: "transparent",
                        backgroundColor: "grey.50",
                        fontWeight: 500
                    }}
                />
                <Chip
                    icon={<CommentIcon sx={{ fontSize: 16 }} />}
                    label={`${post.comments?.length || 0} bình luận`}
                    size="small"
                    variant="outlined"
                    sx={{
                        borderColor: "transparent",
                        backgroundColor: "grey.50",
                        fontWeight: 500
                    }}
                />
            </Box>

            <Divider />

            <CardActions
                sx={{
                    px: 1,
                    py: 0.5,
                    display: "flex",
                    justifyContent: "space-around"
                }}
            >
                <IconButton
                    onClick={handleLike}
                    sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.2,
                        color: isLiked ? "error.main" : "text.secondary",
                        "&:hover": {
                            backgroundColor: isLiked ? "error.light" : "grey.100"
                        }
                    }}
                >
                    {isLiked ? (
                        <FavoriteIcon sx={{ mr: 1 }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ mr: 1 }} />
                    )}
                    <Typography
                        variant="body2"
                        fontWeight={isLiked ? 600 : 500}
                        sx={{ textTransform: "none" }}
                    >
                        {isLiked ? "Đã thích" : "Thích"}
                    </Typography>
                </IconButton>

                <IconButton
                    onClick={() => setShowComments(!showComments)}
                    sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1.2,
                        color: showComments ? "primary.main" : "text.secondary",
                        "&:hover": {
                            backgroundColor: showComments ? "primary.light" : "grey.100"
                        }
                    }}
                >
                    <CommentIcon sx={{ mr: 1 }} />
                    <Typography
                        variant="body2"
                        fontWeight={showComments ? 600 : 500}
                        sx={{ textTransform: "none" }}
                    >
                        Bình luận
                    </Typography>
                </IconButton>
            </CardActions>

            <Collapse in={showComments} timeout="auto" unmountOnExit>
                <Divider />
                <Box sx={{ p: 2, pt: 2.5, backgroundColor: "grey.50" }}>
                    <CommentSection
                        postId={post.id}
                        comments={post.comments}
                        onCommentAdded={(comment) => onCommentAdded(post.id, comment)}
                    />
                </Box>
            </Collapse>
        </Card>
    );
};

export default PostPage;