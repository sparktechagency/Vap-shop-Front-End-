export interface User {
  id: number;
  full_name: string;
  avatar?: string;
  role_label?: string;
  email?: string;
  phone?: string;
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
