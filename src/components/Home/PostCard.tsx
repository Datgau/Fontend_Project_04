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
  Fade,
  Zoom,
} from "@mui/material";
import {
  MoreVert,
  ThumbUp,
  ThumbUpOutlined,
  ChatBubbleOutline,
  Share,
  Send,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { Post, Comment } from "../../@type/post";
import { PostService } from "../../services/postService";
import { useAuth } from "../../routes/AuthContext";
import { mockCurrentUser } from "../../data/mockData";

interface PostCardProps {
  post: Post;
  onLikeToggle: (postId: number, isLiked: boolean) => void;
  onCommentAdd: (postId: number, comment: Comment) => void;
  currentUserId: number;
}

const PostCard = ({ post, onLikeToggle, onCommentAdd }: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const isLiked = post.likedByCurrentUser;
  const likesCount = post.likesCount;
  const commentsCount = post.commentsCount;

  // Fallback values cho user avatar
  const currentUserAvatar = user?.avatar || "/heartbeat.svg";

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const result = await PostService.getComments(post.id);
        if (result.success && result.comments) {
          setComments(result.comments);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 600);

    try {
      console.log('Toggling like for post:', post.id);
      const result = await PostService.toggleLike(post.id);
      console.log('Like result:', result);

      if (result.success) {
        onLikeToggle(post.id, result.isLiked);
      } else {
        console.error('Failed to toggle like:', result.message);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      console.log('Adding comment to post:', post.id);
      const result = await PostService.addComment(post.id, commentText.trim());
      console.log('Comment result:', result);

      if (result.success && result.comment) {
        // Sử dụng comment từ API response (đã được transform trong postService)
        setComments([result.comment, ...comments]);
        onCommentAdd(post.id, result.comment);
        setCommentText("");
      } else {
        console.error('Failed to add comment:', result.message);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
      <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
            },
            overflow: 'hidden',
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
          }}
      >
        {/* Header với hiệu ứng hover */}
        <CardHeader
            avatar={
              <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    },
                    '&:hover::before': {
                      opacity: 0.2,
                    },
                  }}
              >
                <Avatar
                    src={post.user.avatar}
                    sx={{
                      width: { xs: 40, sm: 44 },
                      height: { xs: 40, sm: 44 },
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                />
              </Box>
            }
            action={
              <IconButton
                  size="small"
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.08)',
                      transform: 'rotate(90deg)',
                    },
                  }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            }
            title={
              <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
              >
                {post.user.fullName}
              </Typography>
            }
            subheader={
              <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                    fontWeight: 500,
                    mt: 0.5,
                    display: 'block',
                  }}
              >
                {timeAgo}
              </Typography>
            }
            sx={{ pb: 1.5, pt: 2 }}
        />

        {/* Content với animation fade-in */}
        <CardContent sx={{ pt: 0, px: { xs: 2.5, sm: 3 }, pb: { xs: 1.5, sm: 2 } }}>
          <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                lineHeight: 1.7,
                color: '#2c3e50',
                fontWeight: 400,
              }}
          >
            {post.content}
          </Typography>
        </CardContent>

        {/* Images với hover effect */}
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
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 2,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                          opacity: 0,
                          transition: 'opacity 0.4s',
                        },
                        '&:hover::after': {
                          opacity: 1,
                        },
                        '&:hover img': {
                          transform: 'scale(1.05)',
                        },
                      }}
                  >
                    <Box
                        component="img"
                        src={image}
                        alt={`Post image ${index + 1}`}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: post.images!.length === 1 ? 400 : 200,
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                  </Box>
              ))}
            </Box>
        )}

        {/* Stats với animation */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 1.5, display: "flex", justifyContent: "space-between" }}>
          <Zoom in={likesCount > 0}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
            >
              {likesCount > 0 && (
                  <>
                    <Box
                        component="span"
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                    >
                      <ThumbUp sx={{ fontSize: 10, color: 'white' }} />
                    </Box>
                    {likesCount}
                  </>
              )}
            </Typography>
          </Zoom>
          <Zoom in={commentsCount > 0}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  fontWeight: 600,
                }}
            >
              {commentsCount > 0 && `${commentsCount} bình luận`}
            </Typography>
          </Zoom>
        </Box>

        <Divider sx={{ mx: 2 }} />

        {/* Actions với gradient hover */}
        <CardActions sx={{ justifyContent: "space-around", py: 1, px: { xs: 1, sm: 2 } }}>
          <Button
              startIcon={
                <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      transform: isLikeAnimating ? 'scale(1.3)' : 'scale(1)',
                      transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    }}
                >
                  {isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                </Box>
              }
              onClick={handleLike}
              sx={{
                flex: 1,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                minWidth: 0,
                fontWeight: 600,
                position: 'relative',
                color: isLiked ? '#667eea' : 'inherit',
                transition: 'all 0.3s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover': {
                  color: 'white',
                  '&::before': {
                    opacity: 1,
                  },
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.1)',
                  },
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Thích</Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Like</Box>
          </Button>

          <Button
              startIcon={<ChatBubbleOutline fontSize="small" />}
              onClick={handleToggleComments}
              sx={{
                flex: 1,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                minWidth: 0,
                fontWeight: 600,
                position: 'relative',
                transition: 'all 0.3s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover': {
                  color: 'white',
                  '&::before': {
                    opacity: 1,
                  },
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.1)',
                  },
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
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
                fontWeight: 600,
                position: 'relative',
                transition: 'all 0.3s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 1,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover': {
                  color: 'white',
                  '&::before': {
                    opacity: 1,
                  },
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.1)',
                  },
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
              }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Chia sẻ</Box>
            <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>Share</Box>
          </Button>
        </CardActions>

        <Divider sx={{ mx: 2 }} />

        {/* Comments Section với fade animation */}
        <Collapse in={showComments} timeout={400}>
          <Box sx={{ p: { xs: 2.5, sm: 3 }, bgcolor: '#fafafa' }}>
            {loadingComments ? (
                <Fade in>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#667eea',
                          animation: 'pulse 1.4s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                            '50%': { opacity: 1, transform: 'scale(1)' },
                          },
                        }}
                    />
                    <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#667eea',
                          animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                            '50%': { opacity: 1, transform: 'scale(1)' },
                          },
                        }}
                    />
                    <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#667eea',
                          animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                            '50%': { opacity: 1, transform: 'scale(1)' },
                          },
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Đang tải bình luận...
                    </Typography>
                  </Box>
                </Fade>
            ) : comments.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  {comments.map((comment, idx) => (
                      <Fade in key={comment.id} timeout={300} style={{ transitionDelay: `${idx * 50}ms` }}>
                        <Box
                            sx={{
                              display: "flex",
                              gap: 1.5,
                              mb: 2,
                              opacity: 0,
                              animation: 'slideIn 0.3s forwards',
                              animationDelay: `${idx * 50}ms`,
                              '@keyframes slideIn': {
                                from: {
                                  opacity: 0,
                                  transform: 'translateX(-20px)',
                                },
                                to: {
                                  opacity: 1,
                                  transform: 'translateX(0)',
                                },
                              },
                            }}
                        >
                          <Avatar
                              src={comment.user?.avatar}
                              sx={{
                                width: 36,
                                height: 36,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box
                                sx={{
                                  bgcolor: "white",
                                  borderRadius: 3,
                                  p: 1.5,
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                                    transform: 'translateY(-1px)',
                                  },
                                }}
                            >
                              <Typography variant="body2" fontWeight="700" sx={{ mb: 0.5 }}>
                                {comment.user?.fullName || comment.user?.username}
                              </Typography>
                              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                {comment.content}
                              </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  ml: 1.5,
                                  mt: 0.5,
                                  display: 'block',
                                  fontWeight: 500,
                                }}
                            >
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                            </Typography>
                          </Box>
                        </Box>
                      </Fade>
                  ))}
                </Box>
            ) : commentsCount > 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                  {commentsCount} bình luận
                </Typography>
            ) : null}

            {/* Add Comment với gradient button */}
            <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
              <Avatar
                  src={currentUserAvatar}
                  sx={{
                    width: 36,
                    height: 36,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
              />
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
                      borderRadius: 4,
                      bgcolor: 'white',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 2px 12px rgba(102, 126, 234, 0.2)',
                      },
                    },
                  }}
              />
              <Button
                  variant="contained"
                  size="small"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                  endIcon={<Send fontSize="small" />}
                  sx={{
                    borderRadius: 3,
                    px: 2.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: '#e0e0e0',
                      boxShadow: 'none',
                    },
                  }}
              >
                Gửi
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Card>
  );
};

export default memo(PostCard);