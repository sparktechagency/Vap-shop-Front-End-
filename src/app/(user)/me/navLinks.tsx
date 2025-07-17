import * as Lucide from "lucide-react";

const baseLinks = {
  viewProfile: {
    icon: <Lucide.User className="size-5" />,
    label: "View Profile",
    to: "/me",
  },
  editProfile: {
    icon: <Lucide.UserPlus className="size-5" />,
    label: "Edit Profile",
    to: "/edit-me",
  },
  editBrand: {
    icon: <Lucide.UserPlus className="size-5" />,
    label: "Edit Brand",
    to: "/edit-me",
  },
  editStore: {
    icon: <Lucide.UserPlus className="size-5" />,
    label: "Edit Store",
    to: "/edit-me",
  },
  manageProducts: {
    icon: <Lucide.BookCopy className="size-5" />,
    label: "Manage Products",
    to: "/me/manage",
  },
  orders: {
    icon: <Lucide.MailOpen className="size-5" />,
    label: "Orders & Requests",
    to: "/me/orders",
  },
  favs: {
    icon: <Lucide.HeartIcon className="size-5" />,
    label: "Your Favourites",
    to: "/me/favs",
  },
  mostHearted: {
    icon: <Lucide.HeartIcon className="size-5" />,
    label: "Most Hearted",
    to: "/me/most-hearted",
  },
  manageLocations: {
    icon: <Lucide.LocationEditIcon className="size-5" />,
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
    icon: <Lucide.MessageSquareDotIcon className="size-5" />,
    label: "Inbox",
    to: "/me/inbox",
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
        baseLinks.reviews,
        baseLinks.settings,
        baseLinks.logout,
      ];
    default:
      return [];
  }
};
