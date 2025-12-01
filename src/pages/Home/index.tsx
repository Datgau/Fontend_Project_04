import { useState, useEffect } from "react";
import { Box, Container, Typography, Alert, Card, Skeleton, Button, CircularProgress, Fade, Zoom, Grow } from "@mui/material";
import { Refresh, TrendingUp } from "@mui/icons-material";
import Header from "../../components/Home/Header";
import Stories from "../../components/Home/Stories";
import PostForm from "../../components/Home/PostForm";
import PostCard from "../../components/Home/PostCard";
import type { Post, Comment } from "../../@type/post";
import { mockCurrentUser } from "../../data/mockData";
import { PostService } from "../../services/postService";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(0);
  }, []);

  const fetchPosts = async (pageNum: number) => {
    if (pageNum === 0) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await PostService.getFeed(pageNum, 10);

      if (response.success && response.data) {
        console.log("Loaded posts:", response.data);

        const newPosts = response.data || [];

        if (pageNum === 0) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(newPosts.length === 10);
        setPage(pageNum);
      } else {
        console.warn("API failed:", response.message);
        setError(response.message || "Không thể tải bài viết");
      }
    } catch (error) {
      console.error("Fetch posts error:", error);
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleCommentAdd = (postId: number, _comment: Comment) => {
    setPosts((prevPosts) =>
        prevPosts.map((post) =>
            post.id === postId
                ? { ...post, commentsCount: post.commentsCount + 1 }
                : post
        )
    );
  };

  const handleLikeToggle = (postId: number, isLiked: boolean) => {
    setPosts((prevPosts) =>
        prevPosts.map((post) =>
            post.id === postId
                ? {
                  ...post,
                  likedByCurrentUser: isLiked,
                  likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
                }
                : post
        )
    );
  };

  return (
      <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(to bottom, #f0f2f5 0%, #e5e7eb 100%)",
            position: "relative",
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 300,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              pointerEvents: 'none',
            },
          }}
      >
        <Header />

        <Container
            maxWidth="md"
            sx={{
              pt: { xs: 2, sm: 3 },
              pb: { xs: 3, sm: 4 },
              px: { xs: 1, sm: 2, md: 3 },
              position: 'relative',
              zIndex: 1,
            }}
        >
          {/* Stories Section */}
          <Box sx={{ mb: 3 }}>
            <Stories />
          </Box>

          {/* Error Alert với animation */}
          {error && (
              <Fade in>
                <Alert
                    severity="warning"
                    sx={{
                      mb: 3,
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      fontWeight: 600,
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem',
                      },
                    }}
                    onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              </Fade>
          )}

          {/* Create Post Form */}
          <PostForm onPostCreated={handlePostCreated} />

          {/* Feed Header */}
          {!loading && posts.length > 0 && (
              <Fade in timeout={500}>
                <Box
                    sx={{
                      mb: 3,
                      px: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                          width: 4,
                          height: 24,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          color: '#1f2937',
                        }}
                    >
                      Bảng tin
                    </Typography>
                    <TrendingUp
                        sx={{
                          fontSize: 20,
                          color: '#667eea',
                          animation: 'pulse 2s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                          },
                        }}
                    />
                  </Box>

                  <Button
                      size="small"
                      startIcon={<Refresh />}
                      onClick={() => fetchPosts(0)}
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#667eea',
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                        },
                      }}
                  >
                    Làm mới
                  </Button>
                </Box>
              </Fade>
          )}

          {/* Loading State - Enhanced Skeleton */}
          {loading && (
              <Box>
                {[1, 2, 3].map((i) => (
                    <Fade in key={i} timeout={400} style={{ transitionDelay: `${i * 100}ms` }}>
                      <Card
                          sx={{
                            mb: 3,
                            p: { xs: 2.5, sm: 3 },
                            borderRadius: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                          }}
                      >
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                          <Skeleton
                              variant="circular"
                              width={44}
                              height={44}
                              sx={{
                                background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.5s infinite',
                                '@keyframes shimmer': {
                                  '0%': { backgroundPosition: '200% 0' },
                                  '100%': { backgroundPosition: '-200% 0' },
                                },
                              }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Skeleton
                                variant="text"
                                width="30%"
                                height={24}
                                sx={{
                                  background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shimmer 1.5s infinite',
                                  borderRadius: 2,
                                }}
                            />
                            <Skeleton
                                variant="text"
                                width="20%"
                                height={20}
                                sx={{
                                  background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                                  backgroundSize: '200% 100%',
                                  animation: 'shimmer 1.5s infinite',
                                  borderRadius: 2,
                                }}
                            />
                          </Box>
                        </Box>
                        <Skeleton
                            variant="text"
                            sx={{
                              background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite',
                              borderRadius: 2,
                            }}
                        />
                        <Skeleton
                            variant="text"
                            width="80%"
                            sx={{
                              background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite',
                              borderRadius: 2,
                            }}
                        />
                        <Skeleton
                            variant="rectangular"
                            height={200}
                            sx={{
                              mt: 2,
                              borderRadius: 3,
                              background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
                              backgroundSize: '200% 100%',
                              animation: 'shimmer 1.5s infinite',
                            }}
                        />
                      </Card>
                    </Fade>
                ))}
              </Box>
          )}

          {/* Posts List với stagger animation */}
          {!loading && posts.length > 0 && (
              <Box>
                {posts.map((post, index) => (
                    <Fade
                        in
                        key={post.id}
                        timeout={400}
                        style={{ transitionDelay: `${Math.min(index * 50, 200)}ms` }}
                    >
                      <div>
                        <PostCard
                            post={post}
                            onLikeToggle={handleLikeToggle}
                            onCommentAdd={handleCommentAdd}
                            currentUserId={mockCurrentUser.id}
                        />
                      </div>
                    </Fade>
                ))}

                {/* Load More Button - Enhanced */}
                {hasMore && (
                    <Zoom in timeout={400}>
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Button
                            variant="outlined"
                            onClick={loadMore}
                            disabled={loadingMore}
                            startIcon={loadingMore ? <CircularProgress size={20} /> : <Refresh />}
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              borderRadius: 3,
                              px: 4,
                              py: 1.5,
                              borderWidth: 2,
                              borderColor: '#667eea',
                              color: '#667eea',
                              textTransform: 'none',
                              position: 'relative',
                              overflow: 'hidden',
                              transition: 'all 0.3s',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                              },
                              '&:hover': {
                                borderWidth: 2,
                                borderColor: '#667eea',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                '&::before': {
                                  opacity: 1,
                                },
                              },
                              '&:disabled': {
                                borderColor: '#e5e7eb',
                                color: '#9ca3af',
                              },
                              '& > *': {
                                position: 'relative',
                                zIndex: 1,
                              },
                            }}
                        >
                          {loadingMore ? "Đang tải..." : "Xem thêm bài viết"}
                        </Button>
                      </Box>
                    </Zoom>
                )}

                {/* End of feed indicator */}
                {!hasMore && (
                    <Fade in timeout={500}>
                      <Box
                          sx={{
                            textAlign: "center",
                            py: 4,
                            position: 'relative',
                          }}
                      >
                        <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 2,
                              '&::before, &::after': {
                                content: '""',
                                width: 60,
                                height: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                              },
                            }}
                        >
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.85rem',
                              }}
                          >
                            Bạn đã xem hết bài viết
                          </Typography>
                        </Box>
                      </Box>
                    </Fade>
                )}
              </Box>
          )}

          {/* Empty State - Enhanced */}
          {!loading && posts.length === 0 && (
              <Grow in timeout={600}>
                <Card
                    sx={{
                      textAlign: "center",
                      py: 8,
                      px: 4,
                      borderRadius: 4,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                      border: '2px dashed rgba(102, 126, 234, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -100,
                        right: -100,
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%)',
                      },
                    }}
                >
                  <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        position: 'relative',
                        zIndex: 1,
                        animation: 'float 3s ease-in-out infinite',
                        '@keyframes float': {
                          '0%, 100%': {
                            transform: 'translateY(0)',
                          },
                          '50%': {
                            transform: 'translateY(-10px)',
                          },
                        },
                      }}
                  >
                    <TrendingUp sx={{ fontSize: 40, color: 'white' }} />
                  </Box>

                  <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        zIndex: 1,
                      }}
                  >
                    Chưa có bài viết nào
                  </Typography>
                  <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1,
                      }}
                  >
                    Hãy là người đầu tiên chia sẻ điều gì đó!
                  </Typography>
                </Card>
              </Grow>
          )}
        </Container>
      </Box>
  );
};

export default Home;