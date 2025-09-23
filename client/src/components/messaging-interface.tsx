import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Paperclip, Phone, Video, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Message, User } from "@shared/schema";

interface MessagingInterfaceProps {
  currentUserId: string;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagingInterface({ currentUserId }: MessagingInterfaceProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages", "conversations", currentUserId],
    queryFn: async () => {
      const response = await fetch(`/api/messages?userId=${currentUserId}`);
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", currentUserId, selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      const response = await fetch(`/api/messages?senderId=${currentUserId}&receiverId=${selectedUserId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!selectedUserId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; content: string; projectId?: string }) => {
      return apiRequest("POST", "/api/messages", {
        senderId: currentUserId,
        receiverId: messageData.receiverId,
        content: messageData.content,
        projectId: messageData.projectId || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setMessageText("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!selectedUserId && conversations.length > 0) {
      setSelectedUserId(conversations[0].user.id);
    }
  }, [conversations, selectedUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    await sendMessageMutation.mutateAsync({
      receiverId: selectedUserId,
      content: messageText.trim(),
    });
  };

  const selectedUser = conversations.find(conv => conv.user.id === selectedUserId)?.user;

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLastMessageTime = (date: Date | string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageDate.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]" data-testid="messaging-interface">
      {/* Conversations List */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Messages</h3>
        </div>
        <div className="overflow-y-auto h-[520px]">
          {conversationsLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading conversations...</div>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.user.id}
                onClick={() => setSelectedUserId(conversation.user.id)}
                className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer ${
                  selectedUserId === conversation.user.id ? 'bg-muted/30' : ''
                }`}
                data-testid={`conversation-${conversation.user.id}`}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={conversation.user.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                    alt={`${conversation.user.username} profile`}
                    className="w-10 h-10 rounded-full"
                    data-testid={`img-conversation-avatar-${conversation.user.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground" data-testid={`text-conversation-name-${conversation.user.id}`}>
                        {conversation.user.username}
                      </h4>
                      <span className="text-xs text-muted-foreground" data-testid={`text-last-message-time-${conversation.user.id}`}>
                        {formatLastMessageTime(conversation.lastMessage.createdAt || new Date())}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate" data-testid={`text-last-message-${conversation.user.id}`}>
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="flex items-center mt-1">
                        <span 
                          className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
                          data-testid={`badge-unread-count-${conversation.user.id}`}
                        >
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedUser.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                  alt={`${selectedUser.username} profile`}
                  className="w-10 h-10 rounded-full"
                  data-testid={`img-chat-avatar-${selectedUser.id}`}
                />
                <div>
                  <h4 className="text-sm font-medium text-foreground" data-testid={`text-chat-name-${selectedUser.id}`}>
                    {selectedUser.username}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedUser.isFreelancer ? "Freelancer" : "Client"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" data-testid="button-video-call">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-voice-call">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" data-testid="button-chat-menu">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-muted-foreground">Loading messages...</div>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.senderId === currentUserId ? 'justify-end' : ''
                    }`}
                    data-testid={`message-${message.id}`}
                  >
                    {message.senderId !== currentUserId && (
                      <img 
                        src={selectedUser.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
                        alt="Sender"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div 
                      className={`rounded-lg p-3 max-w-xs ${
                        message.senderId === currentUserId 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.fileAttachment && (
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">{message.fileAttachment}</span>
                        </div>
                      )}
                      <p className="text-sm" data-testid={`text-message-content-${message.id}`}>
                        {message.content}
                      </p>
                      <span 
                        className={`text-xs ${
                          message.senderId === currentUserId 
                            ? 'text-primary-foreground/70' 
                            : 'text-muted-foreground'
                        }`}
                        data-testid={`text-message-time-${message.id}`}
                      >
                        {formatTime(message.createdAt || new Date())}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button type="button" variant="ghost" size="sm" data-testid="button-attach-file">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                  data-testid="input-message-text"
                />
                <Button 
                  type="submit" 
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
