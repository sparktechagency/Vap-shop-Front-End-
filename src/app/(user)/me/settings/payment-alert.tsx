import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PaymentAlert() {
  return (
    <div className="mt-6">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <CreditCard className="h-5 w-5 text-destructive" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-destructive">
                    Payment Gateway Setup Required
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {
                      "You'll need to configure your payment credentials to start receiving payments on this platform."
                    }
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className=""></div>
                <Button asChild className="w-fit">
                  <Link
                    href="/me/settings/payment"
                    className="flex items-center gap-2"
                  >
                    Configure Payment Gateway
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
