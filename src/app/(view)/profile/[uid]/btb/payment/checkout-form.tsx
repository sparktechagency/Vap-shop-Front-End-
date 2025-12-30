"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Loader2,
  ShoppingCart,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/context/userContext";
import { useGetOwnprofileQuery } from "@/redux/features/AuthApi";
import { useBtbCheckoutMutation } from "@/redux/features/b2b/btbApi";

interface CardDetails {
  card_number: string;
  expiration_month: number;
  expiration_year: number;
  cvc: string;
}

interface CustomerData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_dob: string;
  customer_address: string;
  card_details: CardDetails;
}

interface CheckoutData extends CustomerData {
  cart_items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export default function CheckoutForm() {
  const navig = useRouter();
  const { data: me, isLoading } = useGetOwnprofileQuery();
  const [checkout] = useBtbCheckoutMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cart, setCart] = useState<any>();
  const [checks, setChecks] = useState({
    authorizedRep: false,
    resaleCompliance: false,
    coaVerified: false,
    recordKeeping: false,
  });

  const [formData, setFormData] = useState<CustomerData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_dob: "",
    customer_address: "",
    card_details: {
      card_number: "",
      expiration_month: new Date().getMonth() + 1,
      expiration_year: new Date().getFullYear(),
      cvc: "",
    },
  });
  const [errors, setErrors] = useState<Partial<CustomerData>>({});
  const my = me?.data;
  useEffect(() => {
    if (my) {
      setFormData((prev) => ({
        ...prev,
        customer_name: my.full_name || `${my.first_name} ${my.last_name}`,
        customer_email: my.email || "",
        customer_phone: my.phone || "",
        customer_dob: my.dob || "",
        customer_address: my.address?.address || "", // assuming address has 'full_address' field
      }));

      setFormData((prev) => ({
        ...prev,
        card_details: {
          ...prev.card_details,
          card_number: "",
          expiration_month: new Date().getMonth() + 1,
          expiration_year: new Date().getFullYear(),
          cvc: "",
        },
      }));
    }
  }, [my]);
  const allChecked = useMemo(
    () => Object.values(checks).every(Boolean),
    [checks]
  );
  if (!cart) {
    return <></>;
  }
  useEffect(() => {
    const cartData = localStorage.getItem("btbCart");

    if (cartData) {
      setCart(JSON.parse(cartData));
    } else {
      toast.error("Please add items to your B2B cart");
      navig.back();
    }

    return () => {};
  }, []);

  const handleChange = (key: keyof typeof checks, value: boolean) => {
    setChecks((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerData> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Name is required";
    }

    if (!formData.customer_email.trim()) {
      newErrors.customer_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
      newErrors.customer_email = "Please enter a valid email address";
    }

    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = "Phone number is required";
    } else if (
      !/^\d{10,15}$/.test(formData.customer_phone.replace(/\D/g, ""))
    ) {
      newErrors.customer_phone = "Please enter a valid phone number";
    }

    // if (!formData.customer_dob) {
    //   newErrors.customer_dob = "Date of birth is required";
    // }

    if (!formData.customer_address.trim()) {
      newErrors.customer_address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForBackend = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total: any, item: any) => total + item.unitPrice * item.quantity,
      0
    );
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCardInputChange = (
    field: keyof CardDetails,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      card_details: {
        ...prev.card_details,
        [field]: value,
      },
    }));
  };

  const prepareCheckoutData = (): CheckoutData => {
    return {
      customer_name: formData.customer_name.trim(),
      customer_email: formData.customer_email.trim(),
      customer_phone: formData.customer_phone.trim(),
      customer_dob: formatDateForBackend(formData.customer_dob),
      customer_address: formData.customer_address.trim(),
      card_details: formData.card_details,
      cart_items: cart.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const checkoutData = prepareCheckoutData();

      const response = await checkout(prepareCheckoutData()).unwrap();

      if (!response.ok) {
        throw new Error("Failed to process checkout");
      }

      const result = await response.json();

      toast("Success!", {
        description:
          response.message ?? "Your order has been submitted successfully",
      });

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_dob: "",
        customer_address: "",
        card_details: {
          card_number: "",
          expiration_month: new Date().getMonth() + 1,
          expiration_year: new Date().getFullYear(),
          cvc: "",
        },
      });
      localStorage.removeItem("btbCart");
      navig.push("store/stores");
    } catch (error: any) {
      console.log(error);

      toast.error(
        error.data.message ?? "Failed to submit order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cart.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b py-4"
              >
                <div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    height={128}
                    width={128}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.unitPrice.toFixed(2)} / unit
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-sm text-gray-600">
                      Quantity:{" "}
                      <span className="font-medium">{item.quantity}</span>
                    </p>
                    <p className="text-base font-bold text-black">
                      Total: ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
          <CardDescription>
            Please provide your information to complete the order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.customer_name}
                onChange={(e) =>
                  handleInputChange("customer_name", e.target.value)
                }
                className={errors.customer_name ? "border-red-500" : ""}
              />
              {errors.customer_name && (
                <p className="text-sm text-red-500">{errors.customer_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.customer_email}
                onChange={(e) =>
                  handleInputChange("customer_email", e.target.value)
                }
                className={errors.customer_email ? "border-red-500" : ""}
              />
              {errors.customer_email && (
                <p className="text-sm text-red-500">{errors.customer_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.customer_phone}
                onChange={(e) =>
                  handleInputChange("customer_phone", e.target.value)
                }
                className={errors.customer_phone ? "border-red-500" : ""}
              />
              {errors.customer_phone && (
                <p className="text-sm text-red-500">{errors.customer_phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.customer_dob}
                onChange={(e) =>
                  handleInputChange("customer_dob", e.target.value)
                }
                className={errors.customer_dob ? "border-red-500" : ""}
              />
              {errors.customer_dob && (
                <p className="text-sm text-red-500">{errors.customer_dob}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                id="address"
                placeholder="Enter your full address"
                value={formData.customer_address}
                onChange={(e) =>
                  handleInputChange("customer_address", e.target.value)
                }
                className={`${errors.customer_address ? "border-red-500" : ""}`}
              />
              {errors.customer_address && (
                <p className="text-sm text-red-500">
                  {errors.customer_address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="card_number">Card Number</Label>
              <Input
                id="card_number"
                type="text"
                placeholder="Card Number"
                value={formData.card_details.card_number}
                onChange={(e) =>
                  handleCardInputChange("card_number", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiration_month">Exp. Month</Label>
                <Input
                  id="expiration_month"
                  type="number"
                  min={1}
                  max={12}
                  value={formData.card_details.expiration_month}
                  onChange={(e) =>
                    handleCardInputChange(
                      "expiration_month",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_year">Exp. Year</Label>
                <Input
                  id="expiration_year"
                  type="number"
                  min={2024}
                  value={formData.card_details.expiration_year}
                  onChange={(e) =>
                    handleCardInputChange(
                      "expiration_year",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="CVC"
                  value={formData.card_details.cvc}
                  onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading || !allChecked}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Request"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
