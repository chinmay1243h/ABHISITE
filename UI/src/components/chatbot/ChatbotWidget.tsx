import React, { useMemo, useRef, useState } from "react";
import { Box, IconButton, TextField, Typography, CircularProgress, Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { askChatbot } from "../../services/services";
import color from "../utils/Colors";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the Liv Abhi assistant. Ask me anything about courses, movies, jobs, or the platform itself.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
    setError(null);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    });
  };

  const conversationHistory = useMemo(
    () =>
      messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    [messages]
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const updatedMessages = [...messages, { role: "user", content: trimmed } as ChatMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    scrollToBottom();

    try {
      const res = await askChatbot({
        message: trimmed,
        history: conversationHistory,
      });
      const reply = res?.data?.data?.reply || "I'm having trouble responding right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      scrollToBottom();
    } catch (err: any) {
      console.error("Chatbot error", err);
      setError("Unable to reach the chatbot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <IconButton
        onClick={toggleWidget}
        sx={{
          position: "fixed",
          bottom: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          background: color.textColor1,
          color: "white",
          width: 56,
          height: 56,
          borderRadius: "50%",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          zIndex: 1200,
          "&:hover": {
            background: color.secondColor,
          },
        }}
      >
        <ChatBubbleOutlineIcon />
      </IconButton>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        width: { xs: 300, sm: 360 },
        height: 420,
        background: "white",
        borderRadius: 3,
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1300,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: color.textColor1,
          color: "white",
          px: 2.5,
          py: 1.5,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Liv Abhi Chatbot
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Powered by Groq
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: "white" }} onClick={toggleWidget}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        ref={listRef}
        sx={{
          flex: 1,
          px: 2,
          py: 1,
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={`${msg.role}-${idx}-${msg.content.slice(0, 8)}`}
            sx={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                maxWidth: "80%",
                background: msg.role === "user" ? color.textColor1 : "white",
                color: msg.role === "user" ? "white" : "black",
                px: 1.5,
                py: 1,
                borderRadius: 2,
                boxShadow: msg.role === "assistant" ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </Box>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}>
            <Box
              sx={{
                background: "white",
                px: 1.5,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="body2">Thinking...</Typography>
            </Box>
          </Box>
        )}
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
        sx={{
          display: "flex",
          gap: 1,
          p: 1.5,
          borderTop: "1px solid #eee",
          background: "white",
        }}
      >
        <TextField
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            minWidth: 48,
            background: color.textColor1,
            "&:hover": { background: color.secondColor },
          }}
        >
          <SendIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatbotWidget;
