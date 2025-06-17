// import Image from "next/image";
// import { JSX } from "react";

interface FooterNav {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  target: string;
  // icon?: { light: JSX.Element; dark: JSX.Element };
}

export const footer_navs: FooterNav[] = [
  {
    title: "Platform Navigation",
    links: [
      { label: "Log In / Sign up", target: "/auth" },
      { label: "Home", target: "/" },
      { label: "Trending", target: "/trending" },
      { label: "Find Stores", target: "/stores" },
      { label: "Find Brands", target: "/brands" },
      { label: "Forums", target: "/trending" },
      { label: "Featured", target: "/trending" },
    ],
  },
  {
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", target: "/legal/privacy" },
      { label: "Terms of Service", target: "/legal/terms" },
      { label: "Vape & Age Restriction Policy", target: "/legal/vape-age" },
      // { label: "Refund & Subscription Cancellation Policy", target: "/legal/refund-cancel" },
      { label: "Liability & Store/Brand", target: "/legal/liability" },
      {
        label: "Content & Review Moderation Policy",
        target: "/legal/moderation",
      },
      { label: "DMCA Copyright", target: "/legal/dmca" },
      { label: "Community Guidelines", target: "/legal/guidelines" },
      { label: "Acceptance of Terms", target: "/legal/acceptance" },
    ],
  },
];
