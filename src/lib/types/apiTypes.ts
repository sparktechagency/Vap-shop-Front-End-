export interface UserData {
  id: number;
  first_name: string;
  last_name: string | null;
  dob: string | null;
  email?: string;
  role: string;
  avatar: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  role_label?: string;
  full_name?: string;
  total_followers?: string;
  total_following?: string;
  is_following?: boolean;
  avg_rating?: string;
  total_reviews?: string;
  address?: string | null;
}
