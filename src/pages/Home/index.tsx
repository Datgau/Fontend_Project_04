import { useState, useEffect } from "react";
import { Box, Container, Typography, Alert, Card, Skeleton, Button, CircularProgress } from "@mui/material";
import Header from "../../components/Home/Header";
import Stories from "../../components/Home/Stories";
import PostForm from "../../components/Home/PostForm";
import PostCard from "../../components/Home/PostCard";
import type { Post, Comment } from "../../@type/post";
import {  mockCurrentUser } from "../../data/mockData";
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
      const response = await PostService.getFeed(pageNum, 10); // Load 10 posts at a time
      
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
    // Optimistic UI - add post immediately
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleCommentAdd = (postId: number, _comment: Comment) => {
    // TODO: Call API to add comment
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, commentsCount: post.commentsCount + 1 }
          : post
      )
    );
  };

  const handleLikeToggle = (postId: number, isLiked: boolean) => {
    // TODO: Call API to toggle like
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
        backgroundColor: "#f0f2f5",
      }}
    >
      <Header />

      <Container
        maxWidth="md"
        sx={{
          pt: { xs: 2, sm: 3 },
          pb: { xs: 3, sm: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        {/* Stories Section */}
        <Box sx={{ mb: 2 }}>
          <Stories />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Create Post Form */}
        <PostForm onPostCreated={handlePostCreated} />

        {/* Loading State - Skeleton */}
        {loading && (
          <Box>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="20%" />
                  </Box>
                </Box>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 1 }} />
              </Card>
            ))}
          </Box>
        )}

        {/* Posts List */}
        {!loading && posts.length > 0 && (
          <Box>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
                onCommentAdd={handleCommentAdd}
                currentUserId={mockCurrentUser.id}
              />
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  disabled={loadingMore}
                  startIcon={loadingMore ? <CircularProgress size={20} /> : null}
                >
                  {loadingMore ? "Đang tải..." : "Xem thêm"}
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chưa có bài viết nào
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hãy là người đầu tiên chia sẻ điều gì đó!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;