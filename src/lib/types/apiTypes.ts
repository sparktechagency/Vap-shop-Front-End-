/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Address {
  id: number;
  user_id: number;
  region_id: string | null;
  address: string;
  zip_code: string | null;
  latitude: string | null;
  longitude: string | null;
  created_at: string;
  updated_at: string;
  region?: any | null;
}

export interface FavouriteEntity {
  id: number;
  full_name: string;
  avatar: string;
  address: Omit<Address, "region">; // nested address here doesn’t include `region`
}

export interface UserData {
  about: string | null;
  brand_name: string;
  store_name: string;
  cover_photo: string;
  id: string;
  first_name: string;
  last_name: string;
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
  is_favourite?: boolean;
  favourite_store_list?: FavouriteEntity[];
  favourite_brand_list?: FavouriteEntity[];
  address?: (Address & { region?: any | null }) | null;
  open_from?: string;
  close_at?: string;
}
export interface Message {
  id: number | string; // id এখন number অথবা string দুটোই হতে পারে
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
  is_sender: boolean;
}
