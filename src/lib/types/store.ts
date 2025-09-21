export interface Address {
  id: number;
  user_id: number;
  region_id: number;
  address: string;
  zip_code: string;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: number;
  first_name: string;
  last_name: string | null;
  dob: string | null;
  email: string;
  role: number;
  avatar: string;
  cover_photo: string;
  phone: string | null;
  banned_at: string | null;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
  role_label: string;
  full_name: string;
  total_followers: number;
  total_following: number;
  is_following: boolean;
  avg_rating: number;
  total_reviews: number;
  is_favourite: boolean;
  is_banned: boolean;
  address: Address;
  distance?: string;
}

export interface StoreApiResponse {
  ok: boolean;
  message: string;
  data: {
    current_page: number;
    data: Store[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
