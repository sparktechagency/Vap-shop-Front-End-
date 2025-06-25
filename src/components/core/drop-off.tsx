"use client";
import React from "react";
import { toast } from "sonner";

type DropOffProps = {
  type?: "square" | "video";
  onFileSelect: (file: File) => void; // sync callback with validated file
};

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE_MB = 5;

export default function DropOff({ type, onFileSelect }: DropOffProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className={`${type === "square" ? "w-full" : "max-w-2xl"} mx-auto`}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border rounded-lg border-dashed hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleChange}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")}
            accept={ALLOWED_TYPES.join(",")}
          />
        </label>
      </div>
    </div>
  );
}
