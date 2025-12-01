import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Avatar,
  TextField,
  Box,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Fade,
  Grow,
  Zoom,
  Typography,
} from "@mui/material";
import { PhotoLibrary, EmojiEmotions, VideoLibrary, Close, Send } from "@mui/icons-material";
import { PostService } from "../../services/postService";
import type { Post } from "../../@type/post";
import { useAuth } from "../../routes/AuthContext";

interface PostFormProps {
  onPostCreated: (post: Post) => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback values cho user
  const displayName = user?.fullName || user?.username || "User";
  const displayAvatar = user?.avatar || "/heartbeat.svg";

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setSelectedImages((prev) => [...prev, ...newImages]);

    // Create previews
    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      setSnackbar({ open: true, message: "Vui lòng nhập nội dung hoặc chọn ảnh", severity: "error" });
      return;
    }

    setLoading(true);

    try {
      let imageUrls: string[] = [];

      // Bước 1: Upload ảnh nếu có
      if (selectedImages.length > 0) {
        console.log("Uploading images...", selectedImages.length);
        const uploadResponse = await PostService.uploadImages(selectedImages);

        if (!uploadResponse.success || !uploadResponse.data) {
          setSnackbar({
            open: true,
            message: uploadResponse.message || "Upload ảnh thất bại",
            severity: "error"
          });
          setLoading(false);
          return;
        }

        imageUrls = uploadResponse.data.imageUrls;
        console.log("Images uploaded:", imageUrls);
      }

      // Bước 2: Tạo post với content và imageUrls
      const trimmedContent = content.trim();
      console.log("Creating post with:", {
        content: trimmedContent,
        imageUrls
      });

      const response = await PostService.createPost({
        content: trimmedContent,
        imageUrls,
      });

      console.log("Post response:", response);

      if (response.success && response.data) {
        console.log("Post created successfully:", response.data);
        onPostCreated(response.data);
        setContent("");
        setSelectedImages([]);
        setImagePreviews([]);
        setIsExpanded(false);
        setSnackbar({ open: true, message: "Đăng bài thành công!", severity: "success" });
      } else {
        console.error("Post creation failed:", response.message);
        setSnackbar({ open: true, message: response.message || "Đăng bài thất bại", severity: "error" });
      }
    } catch (error: any) {
      console.error("Create post error:", error);
      console.error("Error details:", error.response?.data);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || "Có lỗi xảy ra khi đăng bài",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.06)',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
            },
          }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          {/* Header với greeting */}
          <Fade in timeout={500}>
            <Box sx={{ mb: 2 }}>
              <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
              >
                Tạo bài viết
              </Typography>
              <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
              >
                Chia sẻ suy nghĩ của bạn với mọi người
              </Typography>
            </Box>
          </Fade>

          <Divider sx={{ mb: 2, opacity: 0.6 }} />

          <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, alignItems: "flex-start" }}>
            {/* Avatar với gradient border */}
            <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -3,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: isExpanded ? 1 : 0,
                    transition: 'opacity 0.4s',
                    animation: isExpanded ? 'rotate 3s linear infinite' : 'none',
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  },
                }}
            >
              <Avatar
                  src={displayAvatar}
                  sx={{
                    width: { xs: 40, sm: 44 },
                    height: { xs: 40, sm: 44 },
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
              />
            </Box>

            {/* TextField với animation */}
            <TextField
                fullWidth
                multiline
                rows={isExpanded ? 3 : 1}
                placeholder={`${displayName} ơi, bạn đang nghĩ gì?`}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    backgroundColor: 'white',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.15)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputBase-input': {
                    '&::placeholder': {
                      opacity: 0.7,
                      fontWeight: 500,
                    },
                  },
                }}
            />
          </Box>

          {/* Expanded content với animation */}
          {isExpanded && (
              <Fade in timeout={400}>
                <Box>
                  {/* Image Previews với stagger animation */}
                  {imagePreviews.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <ImageList cols={imagePreviews.length === 1 ? 1 : 2} gap={8}>
                          {imagePreviews.map((preview, index) => (
                              <Zoom
                                  in
                                  key={index}
                                  timeout={300}
                                  style={{ transitionDelay: `${index * 100}ms` }}
                              >
                                <ImageListItem
                                    sx={{
                                      borderRadius: 3,
                                      overflow: 'hidden',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                      transition: 'all 0.3s',
                                      position: 'relative',
                                      '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s',
                                      },
                                      '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                        '&::after': {
                                          opacity: 1,
                                        },
                                      },
                                    }}
                                >
                                  <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      loading="lazy"
                                      style={{
                                        borderRadius: 12,
                                        objectFit: "cover",
                                        height: 200,
                                        width: '100%',
                                      }}
                                  />
                                  <ImageListItemBar
                                      position="top"
                                      actionIcon={
                                        <IconButton
                                            sx={{
                                              color: "white",
                                              bgcolor: "rgba(0,0,0,0.6)",
                                              m: 1,
                                              backdropFilter: 'blur(8px)',
                                              transition: 'all 0.3s',
                                              '&:hover': {
                                                bgcolor: "rgba(239, 68, 68, 0.9)",
                                                transform: 'scale(1.1) rotate(90deg)',
                                              },
                                            }}
                                            onClick={() => handleRemoveImage(index)}
                                            size="small"
                                        >
                                          <Close fontSize="small" />
                                        </IconButton>
                                      }
                                      sx={{ background: "transparent" }}
                                  />
                                </ImageListItem>
                              </Zoom>
                          ))}
                        </ImageList>
                      </Box>
                  )}

                  <Divider sx={{ my: 2.5, opacity: 0.6 }} />

                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        gap: 1.5,
                      }}
                  >
                    {/* Media buttons với gradient hovers */}
                    <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
                      <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          style={{ display: "none" }}
                          onChange={handleImageSelect}
                      />

                      <Grow in timeout={500}>
                        <IconButton
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            sx={{
                              position: 'relative',
                              color: '#667eea',
                              transition: 'all 0.3s',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                              },
                              '&:hover': {
                                color: 'white',
                                transform: 'translateY(-2px)',
                                '&::before': {
                                  opacity: 1,
                                },
                              },
                              '& svg': {
                                position: 'relative',
                                zIndex: 1,
                              },
                            }}
                        >
                          <PhotoLibrary fontSize="small" />
                        </IconButton>
                      </Grow>

                      <Grow in timeout={500} style={{ transitionDelay: '100ms' }}>
                        <IconButton
                            size="small"
                            disabled
                            sx={{
                              position: 'relative',
                              color: '#f56565',
                              opacity: 0.5,
                              transition: 'all 0.3s',
                            }}
                        >
                          <VideoLibrary fontSize="small" />
                        </IconButton>
                      </Grow>

                      <Grow in timeout={500} style={{ transitionDelay: '200ms' }}>
                        <IconButton
                            size="small"
                            disabled
                            sx={{
                              position: 'relative',
                              color: '#f59e0b',
                              opacity: 0.5,
                              transition: 'all 0.3s',
                            }}
                        >
                          <EmojiEmotions fontSize="small" />
                        </IconButton>
                      </Grow>

                      <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            ml: 1,
                            alignSelf: 'center',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                      >
                        Thêm vào bài viết
                      </Typography>
                    </Box>

                    {/* Action buttons với gradient */}
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setContent("");
                            setSelectedImages([]);
                            setImagePreviews([]);
                            setIsExpanded(false);
                          }}
                          disabled={loading}
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            fontWeight: 600,
                            borderRadius: 3,
                            px: 2.5,
                            borderWidth: 2,
                            borderColor: '#e5e7eb',
                            color: '#6b7280',
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderWidth: 2,
                              borderColor: '#9ca3af',
                              backgroundColor: '#f9fafb',
                              transform: 'translateY(-1px)',
                            },
                          }}
                      >
                        Hủy
                      </Button>

                      <Button
                          variant="contained"
                          size="small"
                          onClick={handleSubmit}
                          disabled={loading || (!content.trim() && selectedImages.length === 0)}
                          endIcon={loading ? null : <Send fontSize="small" />}
                          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            fontWeight: 700,
                            borderRadius: 3,
                            px: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                            },
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                              transform: 'translateY(-2px)',
                              '&::before': {
                                opacity: 1,
                              },
                            },
                            '&:active': {
                              transform: 'translateY(0)',
                            },
                            '&:disabled': {
                              background: '#e5e7eb',
                              boxShadow: 'none',
                              color: '#9ca3af',
                            },
                            '& > *': {
                              position: 'relative',
                              zIndex: 1,
                            },
                          }}
                      >
                        {loading ? "Đang đăng..." : "Đăng bài"}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Fade>
          )}
        </CardContent>

        {/* Snackbar với custom styling */}
        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            TransitionComponent={Fade}
        >
          <Alert
              severity={snackbar.severity}
              sx={{
                width: "100%",
                borderRadius: 3,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem',
                },
              }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Card>
  );
};

export default PostForm;