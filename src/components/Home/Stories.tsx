import { Box, Avatar, Typography, Card, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { mockStories, mockCurrentUser } from "../../data/mockData";
import type { Story } from "../../@type/post";

const StoryCard = ({ story }: { story: Story }) => {
  return (
    <Card
      sx={{
        minWidth: 110,
        height: 180,
        borderRadius: 2,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
        backgroundImage: `url(${story.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Avatar */}
      <Avatar
        src={story.user.avatar}
        sx={{
          width: 40,
          height: 40,
          position: "absolute",
          top: 10,
          left: 10,
          border: story.viewed ? "2px solid #ccc" : "3px solid #1976d2",
        }}
      />

      {/* Username */}
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          right: 10,
          color: "white",
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
        }}
      >
        {story.user.fullName}
      </Typography>
    </Card>
  );
};

const CreateStoryCard = () => {
  return (
    <Card
      sx={{
        minWidth: 110,
        height: 180,
        borderRadius: 2,
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
        backgroundImage: `url(${mockCurrentUser.avatar})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top half - Avatar */}
      <Box
        sx={{
          height: "70%",
          position: "relative",
        }}
      />

      {/* Bottom half - Create button */}
      <Box
        sx={{
          height: "30%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: -20,
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
          size="small"
        >
          <Add />
        </IconButton>
        <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
          Tạo story
        </Typography>
      </Box>
    </Card>
  );
};

const Stories = () => {
  // TODO: Replace with API call
  // const { data: stories } = useQuery('/api/stories');
  const stories = mockStories;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": {
          height: 8,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 4,
        },
      }}
    >
      <CreateStoryCard />
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </Box>
  );
};

export default Stories;
