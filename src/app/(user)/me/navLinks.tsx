import * as Lucide from "lucide-react";

const baseLinks = {
  viewProfile: {
    icon: <Lucide.User className="size-5" />,
    label: "View Profile",
    to: "/me",
  },
  editProfile: {
    icon: <Lucide.UserCog className="size-5" />, // User with settings
    label: "Edit Profile",
    to: "/edit-me",
  },
  editBrand: {
    icon: <Lucide.Building2 className="size-5" />, // Brand/Business vibe
    label: "Edit Brand",
    to: "/edit-me",
  },
  editStore: {
    icon: <Lucide.Store className="size-5" />, // Store-specific icon
    label: "Edit Store",
    to: "/edit-me",
  },
  manageProducts: {
    icon: <Lucide.Package className="size-5" />, // Product/Package
    label: "Manage Products",
    to: "/me/manage",
  },
  orders: {
    icon: <Lucide.ShoppingCart className="size-5" />, // Fits orders
    label: "Orders & Requests",
    to: "/me/orders",
  },
  favs: {
    icon: <Lucide.Heart className="size-5" />,
    label: "Your Favorites",
    to: "/me/favs",
  },
  mostHearted: {
    icon: <Lucide.Heart className="size-5" />,
    label: "Most Hearted",
    to: "/me/most-hearted",
  },
  favProducts: {
    icon: <Lucide.BookHeart className="size-5" />,
    label: "Favorites Products",
    to: "/me/fav-products",
  },
  manageLocations: {
    icon: <Lucide.MapPin className="size-5" />,
    label: "Manage Locations",
    to: "/me/locations",
  },
  reviews: {
    icon: <Lucide.ListChecks className="size-5" />,
    label: "Reviews",
    to: "/me/reviews",
  },
  settings: {
    icon: <Lucide.Settings className="size-5" />,
    label: "Settings",
    to: "/me/settings",
  },
  inbox: {
    icon: <Lucide.MessageSquareDot className="size-5" />,
    label: "Inbox",
    to: "/chat",
  },
  logout: {
    icon: <Lucide.LogOut className="size-5" />,
    label: "Logout",
    to: "/logout",
  },
};

export const createNavLinks = (
  role: "user" | "brand" | "store" | "wholesaler" | "association"
) => {
  switch (role) {
    case "user":
      return [
        baseLinks.viewProfile,
        baseLinks.editProfile,
        baseLinks.inbox,
        baseLinks.favs,
        baseLinks.favProducts,
        baseLinks.orders,
        baseLinks.reviews,
        baseLinks.settings,
        baseLinks.logout,
      ];
    case "brand":
      return [
        baseLinks.viewProfile,
        baseLinks.editBrand,
        baseLinks.manageProducts,
        baseLinks.inbox,
        baseLinks.orders,
        baseLinks.mostHearted,
        baseLinks.reviews,
        baseLinks.settings,
        baseLinks.logout,
      ];
    case "store":
      return [
        baseLinks.viewProfile,
        baseLinks.editStore,
        baseLinks.manageProducts,
        baseLinks.inbox,
        baseLinks.orders,
        baseLinks.mostHearted,
        baseLinks.manageLocations,
        baseLinks.reviews,
        baseLinks.settings,
        baseLinks.logout,
      ];
    case "wholesaler":
      return [
        baseLinks.viewProfile,
        baseLinks.editProfile,
        baseLinks.manageProducts,
        baseLinks.inbox,
        baseLinks.orders,
        baseLinks.mostHearted,
        baseLinks.reviews,
        baseLinks.settings,
        baseLinks.logout,
      ];
    case "association":
      return [
        baseLinks.viewProfile,
        baseLinks.editProfile,
        baseLinks.inbox,
        baseLinks.settings,
        baseLinks.logout,
      ];
    default:
      return [];
  }
};
