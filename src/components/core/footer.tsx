"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { footer_navs } from "./core-values/footerlinks";
// import { useTheme } from "next-themes";

export default function Footer() {
  // const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="bg-[#FCFAFF] dark:bg-zinc-900 w-full !pt-12 !px-6 sm:!px-10 lg:!px-[7%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 text-lg font-bold">
          <div
            className="w-12 h-12 bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/image/VSM_VAPE.svg')" }}
          ></div>
          <span>Vape Shop Maps</span>
        </div>
        <p className="text-sm sm:text-base">
          <span className="font-bold">🚫 For Adults 21+:</span> Access limited
          to users in jurisdictions where vape-related products are legal.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-bold">⚠️ No Sales or Payments in App: </span>
          Vape Shop Maps facilitates information and store discovery only. Any
          consumer purchases are completed in-store. B2B transactions are
          managed externally.
        </p>
        <p className="text-sm sm:text-base">
          <span className="font-bold">📚 Built for the Community: </span>
          Vape Shop Maps connects vape enthusiasts, shops, and businesses —
          explore, learn, and grow together.
        </p>
      </div>

      {footer_navs.map((nav, index) => (
        <div key={index} className="flex flex-col gap-4">
          <h2 className="font-semibold text-sm md:text-lg text-center">
            {nav.title}
          </h2>
          {mounted &&
            nav.links.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={link.target}
                className="text-sm sm:text-sm text-foreground hover:text-foreground hover:underline flex items-center gap-2"
              >
                {/* {resolvedTheme === "dark" ? link.icon?.light : link.icon?.dark} */}
                <span className="w-full flex justify-center items-center">
                  {link.label}
                </span>
              </Link>
            ))}
        </div>
      ))}
      <div className="w-full flex justify-center items-center h-[48px] text-sm text-center col-span-1 sm:col-span-2 lg:col-span-3">
        © 2025 Vape Shop Maps Inc. | | All rights reserved.
      </div>
    </footer>
  );
}
