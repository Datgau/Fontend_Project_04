import { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { Message as MessageIcon, Circle } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { mockConversations } from "../../data/mockNotifications";

const MessageDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // TODO: Replace with API call
  // const { data: conversations } = useQuery('/api/conversations');
  const conversations = mockConversations;

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/messages/${conversationId}`);
    handleClose();
  };

  const handleViewAll = () => {
    navigate("/messages");
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={totalUnread} color="error">
          <MessageIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 480,
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={600}>
            Tin nhắn
          </Typography>
        </Box>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tin nhắn nào
            </Typography>
          </Box>
        ) : [
            ...conversations.slice(0, 5).map((conversation) => {
              const participant = conversation.participants[0];
              const isUnread = conversation.unreadCount > 0;

              return (
                <MenuItem
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    backgroundColor: isUnread ? "action.hover" : "transparent",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
                    {/* Avatar with online status */}
                    <Box sx={{ position: "relative" }}>
                      <Avatar
                        src={participant.avatar}
                        sx={{ width: 48, height: 48 }}
                      />
                      {participant.online && (
                        <Circle
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            right: 2,
                            width: 12,
                            height: 12,
                            color: "success.main",
                            backgroundColor: "white",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={isUnread ? 600 : 400}
                          noWrap
                        >
                          {participant.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(
                            new Date(conversation.updatedAt),
                            {
                              locale: vi,
                            }
                          )}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          variant="body2"
                          color={isUnread ? "text.primary" : "text.secondary"}
                          fontWeight={isUnread ? 500 : 400}
                          noWrap
                          sx={{ flex: 1 }}
                        >
                          {conversation.lastMessage.content}
                        </Typography>
                        {isUnread && (
                          <Box
                            sx={{
                              minWidth: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            {conversation.unreadCount}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              );
            }),
            <Divider key="divider" />,
            <Box key="view-all" sx={{ p: 1 }}>
              <Button fullWidth onClick={handleViewAll}>
                Xem tất cả tin nhắn
              </Button>
            </Box>
          ]
        }
      </Menu>
    </>
  );
};

export default MessageDropdown;
