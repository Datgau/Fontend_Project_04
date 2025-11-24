import { useState, memo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Collapse,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import {
  MoreVert,
  ThumbUp,
  ThumbUpOutlined,
  ChatBubbleOutline,
  Share,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Post, Comment } from "../../@type/post";
import { mockCurrentUser } from "../../data/mockData";

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: number, isLiked: boolean) => void;
  onCommentAdd: (postId: number, comment: Comment) => void;
  currentUserId: number;
}

const PostCard = ({ post, onLikeToggle, onCommentAdd, currentUserId }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = post.likedByCurrentUser;
  const likesCount = post.likesCount;
  const commentsCount = post.commentsCount;

  const handleLike = () => {
    // TODO: Replace with API call
    // await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
    onLikeToggle(post.id, !isLiked);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    // TODO: Replace with API call
    // const response = await fetch(`/api/posts/${post.id}/comments`, {
    //   method: 'POST',
    //   body: JSON.stringify({ content: commentText }),
    // });
    // const newComment = await response.json();

    const newComment: Comment = {
      id: Date.now(),
      postId: post.id,
      user: mockCurrentUser,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    onCommentAdd(post.id, newComment);
    setCommentText("");
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <Card sx={{ mb: 2, boxShadow: 1 }}>
      {/* Header */}
      <CardHeader
        avatar={
          <Avatar 
            src={post.user.avatar}
            sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}
          />
        }
        action={
          <IconButton size="small">
            <MoreVert fontSize="small" />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
            {post.user.fullName}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
            {timeAgo}
          </Typography>
        }
        sx={{ pb: 1 }}
      />

      {/* Content */}
      <CardContent sx={{ pt: 0, px: { xs: 2, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: "pre-wrap",
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {post.content}
        </Typography>
      </CardContent>

      {/* Images */}
      {post.images && Array.isArray(post.images) && post.images.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              post.images.length === 1
                ? "1fr"
                : post.images.length === 2
                ? "1fr 1fr"
                : "1fr 1fr",
            gap: 0.5,
            px: 2,
            pb: 2,
          }}
        >
          {post.images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Post image ${index + 1}`}
              loading="lazy"
              sx={{
                width: "100%",
                height: post.images!.length === 1 ? 400 : 200,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      )}

      {/* Stats */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          {likesCount > 0 && `${likesCount} lượt thích`}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
          {commentsCount > 0 && `${commentsCount} bình luận`}
        </Typography>
      </Box>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ justifyContent: "space-around", py: 0.5, px: { xs: 1, sm: 2 } }}>
        <Button
          startIcon={isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
          onClick={handleLike}
          color={isLiked ? "primary" : "inherit"}
          sx={{ 
            flex: 1,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Thích</Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Like</Box>
        </Button>
        <Button
          startIcon={<ChatBubbleOutline fontSize="small" />}
          onClick={() => setShowComments(!showComments)}
          sx={{ 
            flex: 1,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Bình luận</Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Comment</Box>
        </Button>
        <Button 
          startIcon={<Share fontSize="small" />} 
          sx={{ 
            flex: 1,
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            minWidth: 0,
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Chia sẻ</Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Share</Box>
        </Button>
      </CardActions>

      <Divider />

      {/* Comments Section */}
      <Collapse in={showComments}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Existing Comments */}
          {/* TODO: Load comments from API when expanded */}
          {commentsCount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {commentsCount} bình luận
            </Typography>
          )}

          {/* Add Comment */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Avatar src={mockCurrentUser.avatar} sx={{ width: 32, height: 32 }} />
            <TextField
              fullWidth
              size="small"
              placeholder="Viết bình luận..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(PostCard);
