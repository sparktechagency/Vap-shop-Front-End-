import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function Hearts() {
  return (
    <>
      {" "}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Hearts</h2>
      <p className="text-gray-600 mb-6">
        Easily update heart counts for products
      </p>
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="profileUrl" className="mb-4">
            Product URL
          </Label>
          <Input
            id="profileUrl"
            type="url"
            placeholder="Paste product link here"
          />
        </div>

        <div className="flex flex-col">
          <Label htmlFor="followerCount" className=" mb-4">
            Heart Count
          </Label>
          <Input
            id="followerCount"
            type="number"
            placeholder="Set total hearts"
          />
        </div>

        <Button>Confirm</Button>
      </div>
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Steps:</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
          <li>Copy the product page URL.</li>
          <li>Paste it into the input above.</li>
          <li>Set the total heart count.</li>
          <li>Click Confirm to update.</li>
        </ol>
      </div>
    </>
  );
}
