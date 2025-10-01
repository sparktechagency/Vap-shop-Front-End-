"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { useCookies } from "react-cookie";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut] = useState(false);
  const [, , removeCookie] = useCookies(["token"]);
  const handleLogout = async () => {
    removeCookie("token");
    router.push("/login");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4!">
      <Card className="w-full max-w-md shadow-lg border backdrop-blur-sm">
        <CardHeader className="text-center space-y-2! pb-4!">
          <div className="mx-auto! w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-2!">
            <LogOut className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Confirm Logout
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Are you sure you want to log out of your account? You&apos;ll need
            to sign in again to access your dashboard.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-3 pt-6">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full font-medium"
            variant="destructive"
            size="lg"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </>
            )}
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
            size="lg"
            disabled={isLoggingOut}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
