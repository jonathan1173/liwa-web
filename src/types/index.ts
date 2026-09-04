export interface Product {
  id: number;
  user_id?: string;
  title: string;
  description: string | null;
  price: number;
  barter: boolean;
  state_id?: number | null;
  status?: string;
  created_at: string;
  category: { name: string } | null;
  condition: { name: string } | null;
  state?: { id: number; name: string } | null;
  images: { url: string }[];
}

export interface SellerLocation {
  id: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  city?: { name: string } | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Condition {
  id: number;
  name: string;
}

export interface SendBarterProposalParams {
  sender_user_id: string;
  receiver_user_id: string;
  target_product_id: number;
  offered_product_ids: number[];
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  city_id?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  profile_completed?: boolean;
}
