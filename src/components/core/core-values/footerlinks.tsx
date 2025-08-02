// import Image from "next/image";
// import { JSX } from "react";

interface FooterNav {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  target: string;
  type?: string
  // icon?: { light: JSX.Element; dark: JSX.Element };
}

export const footer_navs: FooterNav[] = [
  {
    title: "Platform Navigation",
    links: [
      { label: "Log In / Sign up", target: "/login" },
      { label: "Home", target: "/" },
      { label: "Trending", target: "/trending" },
      { label: "Find Stores", target: "/stores" },
      { label: "Find Brands", target: "/brands" },
      { label: "Forums", target: "/trending" },
      { label: "Featured", target: "/trending" },
    ],
  },
  // privacy-policy,terms-of-service,vape-&-age-restriction-policy,brand,content-&-review-moderation-policy,dmca-copyright,community-guidelines,acceptance-of-terms

  {
    title: "Legal & Policies",
    links: [
      { label: "Privacy Policy", target: "/legal/privacy", type: 'privacy-policy' },
      { label: "Terms of Service", target: "/legal/privacy", type: 'terms-of-service' },
      { label: "Vape & Age Restriction Policy", target: "/legal/privacy", type: 'vape-&-age-restriction-policy' },
      // { label: "Refund & Subscription Cancellation Policy", target: "/legal/refund-cancel" },
      { label: "Liability & Store/Brand", target: "/legal/privacy", type: 'brand' },
      {
        label: "Content & Review Moderation Policy",
        target: "/legal/privacy", type: 'content-&-review-moderation-policy'
      },
      { label: "DMCA Copyright", target: "/legal/privacy", type: 'dmca-copyright' },
      { label: "Community Guidelines", target: "/legal/privacy", type: 'community-guidelines' },
      { label: "Acceptance of Terms", target: "/legal/privacy", type: 'acceptance-of-terms' },
    ],
  },
];
