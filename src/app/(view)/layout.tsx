"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import Cookies from "js-cookie";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestedPath, setRequestedPath] = useState("");

  const isUnprotectedPage = pathname === "/" || pathname === "/legal/privacy";

  useEffect(() => {
    if (pathname !== "/") {
      setRequestedPath(pathname);
    }

    const token = Cookies.get("token");
    if (!token && pathname !== "/") {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleLogin = () => {
    setIsLoading(true);
    // Redirect to login with return URL
    router.push(
      `/login?returnUrl=${encodeURIComponent(requestedPath || "/dashboard")}`
    );
  };

  const handleClose = () => {
    // Just close the modal, don't redirect anywhere
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Show children only if authenticated or on homepage */}
        {isUnprotectedPage || Cookies.get("token") ? (
          children
        ) : (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Welcome to Our Platform
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Please log in to access all features and content.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
                  <p className="text-gray-600">
                    Access exclusive content available only to registered users.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
                  <p className="text-gray-600">
                    Save your preferences and access personalized
                    recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md rounded-lg shadow-xl">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl font-semibold text-gray-900">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              To access {requestedPath || "this page"}, please log in to your
              account. Do not have an account yet? You can register for free.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-3">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              variant={"special"}
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redirecting...
                </>
              ) : (
                "Continue to Login"
              )}
            </Button>

            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full border-gray-300 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue Browsing Homepage
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
