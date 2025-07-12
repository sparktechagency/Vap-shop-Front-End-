export interface ProductType {
  image: string | null;
  title: string;
  category: string;
  note: string;
  price?: string;
  type?: "ad" | string;
  discount?: string;
  hearts?: number;
  rating?: string;
  reviews?: number;
  id?: number;
  is_hearted?: boolean;
  thc_percentage?:string
}

export interface BrandType {
  id: string;
  image: string;
  avatar?: string;
  type: "normal" | "wholesaler" | "brand" | "store" | "ad";
  storeName: string;
  isVerified: boolean;
  location: {
    city: string;
    distance: string;
  };
  rating: {
    value: number;
    reviews: number;
  };
  isOpen: boolean;
  closingTime: string;
  isFollowing?: boolean;
  totalFollowers?: number;
  is_favourite?: boolean;
}
