"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_API_ENDPOINT } from "@/lib/config/data";
import { useGetAdFollowersPricingQuery } from "@/redux/features/ad/adApi";
import { useCountysQuery } from "@/redux/features/AuthApi";

import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetSponsoredBrandsQuery } from "@/redux/features/Trending/TrendingApi";

const MoreVertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EditPriceModal = ({
  isOpen,
  onClose,
  slotNumber,
  ad_slot_id,
  region_id,
  desc,
}: {
  isOpen: boolean;
  onClose: () => void;
  slotNumber: number;
  ad_slot_id: string | number;
  region_id: string | number;
  desc: string;
}) => {
  const token = Cookies.get("token");
  const [prices, setPrices] = useState<string[]>(["", "", "", ""]);
  if (!isOpen) return null;
  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const handlePriceChange = (index: number, value: string) => {
    const updated = [...prices];
    updated[index] = value;
    setPrices(updated);
  };

  const savePricing = async () => {
    const payload = new FormData();

    payload.append("ad_slot_id", String(ad_slot_id));
    payload.append("region_id", String(region_id));
    payload.append("description", desc);
    payload.append("type", "follower");

    prices.forEach((val, i) => {
      payload.append(`weekly_prices[week_${i + 1}]`, val || "0");
    });

    const call = await fetch(`${BASE_API_ENDPOINT}admin/ad-pricings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });
    if (!call.ok) {
      const res = await call.json();
      toast.error(res.message ?? "Something went wrong");
      return;
    }
    const res = await call.json();
    toast.success(res.message ?? "");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/35 flex justify-center items-center z-50 p-4">
      {/* Modal Panel */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8 transform transition-all">
        <header className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Edit Slot {slotNumber} Price
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <CloseIcon />
          </button>
        </header>

        {/* Form Content */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            savePricing();
          }}
        >
          {weekLabels.map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label}:
              </label>
              <input
                type="number"
                placeholder="Enter price"
                value={prices[index]}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-gray-900 text-white font-bold py-2 px-8 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdCard = ({
  slotNumber,
  named,
  imageUrl,
  ad_slot_id,
  region_id,
  desc,
}: {
  slotNumber: number;
  imageUrl: string;
  named?: string;
  ad_slot_id: string;
  region_id: string;
  desc: string;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { data: prices } = useGetAdFollowersPricingQuery(
    { adId: ad_slot_id, regionId: region_id },
    {
      skip: !region_id,
    }
  );
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 relative">
        {/* Header with Slot number and Three-dot menu */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-600">Slot {slotNumber}</p>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200"
            >
              <MoreVertIcon />
            </button>
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border z-10">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  <EditIcon />
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-md overflow-hidden h-48 mb-4">
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            // height={500}
            // width={500}
            alt="img"
          />
        </div>
        <div className="">{named}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">View</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ad Pricing Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {prices?.data?.map((item: any) => (
                  <Card key={item.id} className="">
                    <CardHeader>
                      <CardTitle className="text-amber-400 font-semibold text-lg mb-2">
                        {item.ad_slot?.name}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(item.details).map(([week, price]) => (
                        <Card
                          key={week}
                          className="flex flex-col justify-center items-center"
                        >
                          <p className="text-zinc-400 text-sm">
                            {week.replace("_", " ")}
                          </p>
                          <p className="">${String(price)}</p>
                        </Card>
                      ))}
                    </CardContent>

                    <CardFooter className="text-zinc-500 text-xs mt-2">
                      Last Updated: {new Date(item.updated_at).toLocaleString()}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action can not be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    toast.info("This feature is under development");
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Render the modal */}
      <EditPriceModal
        ad_slot_id={ad_slot_id}
        region_id={region_id}
        desc={desc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slotNumber={slotNumber}
      />
    </>
  );
};

function AdManagementPage() {
  const { data: countryData, isLoading: isRegionsLoading } = useCountysQuery();
  const [selectedRegi, setSelectedRegi] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const { data, isLoading } = useGetSponsoredBrandsQuery(
    {
      region: selectedRegi,
    },
    { skip: !selectedRegi }
  );

  const adData = [
    {
      id: 1,
      slotNumber: 1,
      name: data?.data[0]?.product_name,
      imageUr:
        data?.data[0]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+1",
    },
    {
      id: 2,
      slotNumber: 2,
      name: data?.data[1]?.product_name,
      imageUr:
        data?.data[1]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+2",
    },
    {
      id: 3,
      slotNumber: 3,
      name: data?.data[2]?.product_name,
      imageUr:
        data?.data[2]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+3",
    },
    {
      id: 4,
      slotNumber: 4,
      name: data?.data[3]?.product_name,
      imageUr:
        data?.data[3]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+4",
    },
    {
      id: 5,
      slotNumber: 5,
      name: data?.data[4]?.product_name,
      imageUr:
        data?.data[4]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+5",
    },
    {
      id: 6,
      slotNumber: 6,
      name: data?.data[5]?.product_name,
      imageUr:
        data?.data[5]?.product_image ??
        "https://placehold.co/400x300/e8e8e8/555?text=Ad+6",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 sm:p-6 md:p-8 font-['Montserrat']">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Ad Request Management
        </h1>
        <p className="mt-2 text-gray-600">
          Review, approve, and manage ad placements across the platform.
        </p>
      </header>
      <main className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Most followers Ad Manager
          </h2>
          {selectedRegi ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {adData?.map((ad) => (
                <AdCard
                  desc={desc}
                  named={ad.name}
                  ad_slot_id={String(ad.id)}
                  region_id={selectedRegi}
                  imageUrl={ad.imageUr}
                  key={ad.id}
                  {...ad}
                />
              ))}
            </div>
          ) : (
            <div>Select Category and Region first</div>
          )}
        </section>

        <section>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="relative">
              <Select
                onValueChange={(e) => {
                  setSelectedRegi(e);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {!isRegionsLoading &&
                    countryData?.data?.flatMap((ctr: any) =>
                      ctr.regions.map((r: any) => (
                        <SelectItem value={String(r.id)} key={r.id}>
                          {r.name} ({r.code}), {ctr.name}
                        </SelectItem>
                      ))
                    )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Edit Description
            </h2>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type here..."
              value={desc}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
            ></textarea>
            {/* <div className="flex justify-end mt-4">
              <button className="bg-gray-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors">
                Save Changes
              </button>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdManagementPage;

//testing
