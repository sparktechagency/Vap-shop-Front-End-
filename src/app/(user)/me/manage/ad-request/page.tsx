import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-background mt-6!">
      {/* Header Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-9 !py-12 bg-secondary dark:bg-zinc-900 px-4! gap-8">
        <div className="col-span-1 lg:col-span-3">
          <Image
            src="/image/shop/item.jpg"
            width={400}
            height={400}
            alt="Product Preview"
            className="aspect-square object-cover object-center w-full rounded-md shadow-lg"
          />
          <div className="!mt-4 !space-y-2">
            <Badge variant="secondary" className="w-full justify-center !py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Ad Request
            </Badge>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-6">
          <h1 className="text-4xl lg:text-6xl font-semibold !mb-6">
            Request Trending Ad Placement
          </h1>
          <p className="text-muted-foreground !mb-8 text-lg">
            Submit your product for consideration in our trending ads section.
            Get maximum visibility and boost your sales with premium placement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 !mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 !mx-auto !mb-2 text-yellow-500" />
                <h3 className="font-semibold">Premium Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Top section placement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 !mx-auto !mb-2 text-green-500" />
                <h3 className="font-semibold">Increased Attention</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 300% more views
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4! text-center">
                <Clock className="w-8 h-8 !mx-auto !mb-2 text-blue-500" />
                <h3 className="font-semibold">Quick Approval</h3>
                <p className="text-sm text-muted-foreground">
                  24-48 hour review
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-2/3 mx-auto! px-4! lg:px-[7%]! py-12!">
        <div className="w-full">
          <div className="">
            {/* Ad Preferences */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Advertisement Preferences
                </CardTitle>
                <CardDescription>
                  Specify your advertising requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="">
                  <div className="space-y-4!">
                    <Label htmlFor="ad-duration">Preferred Duration *</Label>
                    <Select>
                      <SelectTrigger className="mt-1! w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-week">1 Week</SelectItem>
                        <SelectItem value="2-weeks">2 Weeks</SelectItem>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Submit */}
            <Card className="mt-8!">
              <CardContent className="pt-6!">
                <div className="space-y-4!">
                  <div className="flex items-start space-x-2!">
                    <input type="checkbox" id="terms" className="mt-1!" />
                    <Label
                      htmlFor="terms"
                      className="inline-block text-sm leading-relaxed"
                    >
                      I agree to the{" "}
                      <span className="text-primary underline cursor-pointer">
                        Terms of Service
                      </span>{" "}
                      and
                      <span className="text-primary underline cursor-pointer">
                        {" "}
                        Privacy Policy
                      </span>
                      . I understand that ad placement is subject to approval
                      and availability.
                    </Label>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8!">
                  <Button className="flex-1">Submit Ad Request</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4! text-center">
                  Admin will review your request within 24-48 hours and contact
                  you with next steps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
