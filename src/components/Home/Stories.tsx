import { Box, Avatar, Typography, Card, IconButton, Fade, Zoom } from "@mui/material";
import { Add, FiberManualRecord } from "@mui/icons-material";
import { mockStories } from "../../data/mockData";
import type { Story } from "../../@type/post";
import { useAuth } from "../../routes/AuthContext";

const StoryCard = ({ story, index }: { story: Story; index: number }) => {
    return (
        <Zoom in timeout={400} style={{ transitionDelay: `${index * 80}ms` }}>
            <Card
                sx={{
                    minWidth: 120,
                    height: 200,
                    borderRadius: 3,
                    position: "relative",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    backgroundImage: `url(${story.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    '&::before': {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                        transition: 'all 0.4s',
                    },
                    "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
                        '&::before': {
                            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
                        },
                        '& .story-avatar': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        },
                        '& .story-name': {
                            transform: 'translateY(-2px)',
                        },
                    },
                }}
            >
                {/* Avatar với gradient ring */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        padding: '3px',
                        borderRadius: '50%',
                        background: story.viewed
                            ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        animation: !story.viewed ? 'pulse-ring 2s ease-in-out infinite' : 'none',
                        '@keyframes pulse-ring': {
                            '0%, 100%': {
                                opacity: 1,
                                transform: 'scale(1)',
                            },
                            '50%': {
                                opacity: 0.8,
                                transform: 'scale(1.05)',
                            },
                        },
                    }}
                >
                    <Avatar
                        className="story-avatar"
                        src={story.user.avatar}
                        sx={{
                            width: 44,
                            height: 44,
                            border: "3px solid white",
                            transition: 'all 0.3s',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                    />
                </Box>

                {/* Live indicator cho story chưa xem */}
                {!story.viewed && (
                    <Fade in>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                bgcolor: 'rgba(239, 68, 68, 0.9)',
                                backdropFilter: 'blur(8px)',
                                px: 1,
                                py: 0.5,
                                borderRadius: 2,
                                animation: 'fade-pulse 2s ease-in-out infinite',
                                '@keyframes fade-pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.7 },
                                },
                            }}
                        >
                            <FiberManualRecord sx={{ fontSize: 8, color: 'white' }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                    letterSpacing: 0.5,
                                }}
                            >
                                MỚI
                            </Typography>
                        </Box>
                    </Fade>
                )}

                {/* Username với backdrop blur */}
                <Box
                    className="story-name"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 1.5,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "white",
                            fontWeight: 700,
                            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {story.user.fullName}
                    </Typography>
                </Box>

                {/* Shimmer effect on hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.6s',
                        pointerEvents: 'none',
                        '.MuiCard-root:hover &': {
                            left: '100%',
                        },
                    }}
                />
            </Card>
        </Zoom>
    );
};

const CreateStoryCard = () => {
    const { user } = useAuth();
    const displayAvatar = user?.avatar || "/heartbeat.svg";

    return (
        <Zoom in timeout={300}>
            <Card
                sx={{
                    minWidth: 120,
                    height: 200,
                    borderRadius: 3,
                    position: "relative",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    background: 'white',
                    border: '2px dashed transparent',
                    "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: '0 12px 24px rgba(102, 126, 234, 0.25)',
                        borderColor: '#667eea',
                        '& .create-avatar-section': {
                            transform: 'scale(1.05)',
                        },
                        '& .create-button': {
                            transform: 'scale(1.15) rotate(90deg)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        },
                        '& .create-text': {
                            color: '#667eea',
                        },
                    },
                }}
            >
                {/* Top section - Avatar */}
                <Box
                    className="create-avatar-section"
                    sx={{
                        height: "65%",
                        position: "relative",
                        backgroundImage: `url(${displayAvatar})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: 'all 0.3s',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(255,255,255,0.9) 90%)',
                        },
                    }}
                />

                {/* Bottom section - Create button */}
                <Box
                    sx={{
                        height: "35%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        pt: 2,
                    }}
                >
                    {/* Floating button */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -24,
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 2,
                        }}
                    >
                        <IconButton
                            className="create-button"
                            sx={{
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: "white",
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                },
                            }}
                            size="small"
                        >
                            <Add sx={{ fontWeight: 'bold' }} />
                        </IconButton>
                    </Box>

                    <Typography
                        className="create-text"
                        variant="body2"
                        sx={{
                            mt: 1.5,
                            fontWeight: 700,
                            color: '#374151',
                            transition: 'color 0.3s',
                            fontSize: '0.85rem',
                        }}
                    >
                        Tạo story
                    </Typography>
                </Box>

                {/* Decorative gradient border on hover */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: -2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        zIndex: -1,
                        '.MuiCard-root:hover &': {
                            opacity: 0.1,
                        },
                    }}
                />
            </Card>
        </Zoom>
    );
};

const Stories = () => {
    // TODO: Replace with API call
    // const { data: stories } = useQuery('/api/stories');
    const stories = mockStories;

    return (
        <Box
            sx={{
                position: 'relative',
                mb: 3,
            }}
        >
            {/* Section header */}
            <Fade in timeout={500}>
                <Box sx={{ mb: 2, px: 0.5 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1rem', sm: '1.1rem' },
                            color: '#1f2937',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                width: 4,
                                height: 24,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        />
                        Stories
                    </Typography>
                </Box>
            </Fade>

            {/* Stories container */}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    pb: 2,
                    px: 0.5,
                    position: 'relative',
                    // Custom scrollbar
                    "&::-webkit-scrollbar": {
                        height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 4,
                        transition: 'all 0.3s',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        },
                    },
                    // Fade out effect on edges
                    '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        bottom: 12,
                        width: 40,
                        pointerEvents: 'none',
                        zIndex: 1,
                    },
                    '&::before': {
                        left: 0,
                        background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                    },
                    '&::after': {
                        right: 0,
                        background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                    },
                }}
            >
                <CreateStoryCard />
                {stories.map((story, index) => (
                    <StoryCard key={story.id} story={story} index={index} />
                ))}
            </Box>

            {/* Scroll hint indicator */}
            <Fade in timeout={1000}>
                <Box
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        opacity: 0.4,
                        pointerEvents: 'none',
                        animation: 'bounce-horizontal 2s ease-in-out infinite',
                        '@keyframes bounce-horizontal': {
                            '0%, 100%': {
                                transform: 'translateY(-50%) translateX(0)',
                            },
                            '50%': {
                                transform: 'translateY(-50%) translateX(5px)',
                            },
                        },
                    }}
                >
                    <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#667eea',
                    }} />
                    <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#667eea',
                    }} />
                    <Box sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: '#667eea',
                    }} />
                </Box>
            </Fade>
        </Box>
    );
};

export default Stories;