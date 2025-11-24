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
} from "@mui/material";
import { PhotoLibrary, EmojiEmotions, VideoLibrary, Close } from "@mui/icons-material";
import { mockCurrentUser } from "../../data/mockData";
import { PostService } from "../../services/postService";
import type { Post } from "../../@type/post";

interface PostFormProps {
  onPostCreated: (post: Post) => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <Card sx={{ mb: 2, boxShadow: 1 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, alignItems: "flex-start" }}>
          <Avatar 
            src={mockCurrentUser.avatar}
            sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}
          />
          <TextField
            fullWidth
            multiline
            rows={isExpanded ? 3 : 1}
            placeholder={`${mockCurrentUser.fullName} ơi, bạn đang nghĩ gì?`}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Box>

        {isExpanded && (
          <>
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <ImageList cols={imagePreviews.length === 1 ? 1 : 2} gap={8}>
                  {imagePreviews.map((preview, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 8, objectFit: "cover", height: 200 }}
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{ color: "white", bgcolor: "rgba(0,0,0,0.5)" }}
                            onClick={() => handleRemoveImage(index)}
                            size="small"
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        }
                        sx={{ background: "transparent" }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 } }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
                <IconButton 
                  color="primary" 
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <PhotoLibrary fontSize="small" />
                </IconButton>
                <IconButton color="error" size="small" disabled>
                  <VideoLibrary fontSize="small" />
                </IconButton>
                <IconButton color="warning" size="small" disabled>
                  <EmojiEmotions fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
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
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit}
                  disabled={loading || (!content.trim() && selectedImages.length === 0)}
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {loading ? "Đang đăng..." : "Đăng"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </CardContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default PostForm;
