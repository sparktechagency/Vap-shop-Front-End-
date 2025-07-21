export interface User {
  id: number;
  full_name: string;
  avatar?: string;
  role_label?: string;
  email?: string;
  phone?: string;
}

export interface subscribuser {
  id: number | string;
  role: number;
  is_subscribed: boolean;
  [key: string]: any;
}
export interface Message {
  id: number | string;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  is_sender: boolean;
}

export interface SendMessagePayload {
  receiver_id: number;
  message: string;
}

interface ChatAreaProps {
  user: User | null;
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onLoadMore: () => void;
  onScroll: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
