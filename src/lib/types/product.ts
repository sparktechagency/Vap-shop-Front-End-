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
}

export interface BrandType {
  id: string;
  image: string; // URL to product image
  type: "ad" | "normal"; // To show if it's an ad
  storeName: string;
  isVerified: boolean;
  location: {
    city: string;
    state?: string;
    distance: string; // e.g. "4 mi"
  };
  rating: {
    value: number; // e.g. 4.9
    reviews: number; // e.g. 166
  };
  isOpen: boolean;
  closingTime: string; // e.g. "10 PM"
}
