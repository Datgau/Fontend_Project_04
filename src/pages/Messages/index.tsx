import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Divider,
  Badge,
} from "@mui/material";
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Circle,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Header from "../../components/Home/Header";
import { mockConversations, getMessagesByConversation } from "../../data/mockNotifications";
import type { Conversation, Message } from "../../@type/notification";

const Messages = () => {
  // TODO: Replace with API calls
  const [conversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations[0] || null
  );
  const [messages, setMessages] = useState<Message[]>(
    selectedConversation ? getMessagesByConversation(selectedConversation.id) : []
  );
  const [newMessage, setNewMessage] = useState("");

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // TODO: Replace with API call
    // const msgs = await fetch(`/api/conversations/${conversation.id}/messages`);
    setMessages(getMessagesByConversation(conversation.id));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // TODO: Replace with API call
    // await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
    //   method: 'POST',
    //   body: JSON.stringify({ content: newMessage }),
    // });

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: "current-user",
      content: newMessage.trim(),
      type: "text",
      read: true,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper
          sx={{
            height: "calc(100vh - 140px)",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* Conversations List */}
          <Box
            sx={{
              width: { xs: "100%", md: 360 },
              borderRight: { md: 1 },
              borderColor: "divider",
              display: { xs: selectedConversation ? "none" : "block", md: "block" },
            }}
          >
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6" fontWeight={600}>
                Tin nhắn
              </Typography>
            </Box>

            <List sx={{ overflow: "auto", height: "calc(100% - 73px)" }}>
              {conversations.map((conversation) => {
                const participant = conversation.participants[0];
                const isSelected = selectedConversation?.id === conversation.id;
                const isUnread = conversation.unreadCount > 0;

                return (
                  <ListItem
                    key={conversation.id}
                    button
                    selected={isSelected}
                    onClick={() => handleConversationSelect(conversation)}
                    sx={{
                      backgroundColor: isUnread && !isSelected ? "action.hover" : undefined,
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        badgeContent={
                          participant.online ? (
                            <Circle
                              sx={{
                                width: 12,
                                height: 12,
                                color: "success.main",
                                border: "2px solid white",
                                borderRadius: "50%",
                              }}
                            />
                          ) : null
                        }
                      >
                        <Avatar src={participant.avatar} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle2"
                          fontWeight={isUnread ? 600 : 400}
                        >
                          {participant.fullName}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color={isUnread ? "text.primary" : "text.secondary"}
                          fontWeight={isUnread ? 500 : 400}
                          noWrap
                        >
                          {conversation.lastMessage.content}
                        </Typography>
                      }
                    />
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
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/* Chat Area */}
          {selectedConversation ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar src={selectedConversation.participants[0].avatar} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedConversation.participants[0].fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedConversation.participants[0].online
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </Typography>
                </Box>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {messages.map((message) => {
                  const isOwn = message.senderId === "current-user";

                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent: isOwn ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          backgroundColor: isOwn ? "primary.main" : "grey.200",
                          color: isOwn ? "white" : "text.primary",
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            opacity: 0.7,
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), {
                            locale: vi,
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Divider />

              {/* Message Input */}
              <Box sx={{ p: 2, display: "flex", gap: 1, alignItems: "center" }}>
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Chọn một cuộc trò chuyện để bắt đầu
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Messages;
