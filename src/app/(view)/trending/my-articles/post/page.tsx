"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useCreateApostMutation } from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Dynamically import JoditEditor to prevent SSR issues, as it relies on the 'window' object.
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// Consider a more descriptive name like "CreateArticleForm"
export default function Featured() {
  const router = useRouter();
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createApost, { isLoading }] = useCreateApostMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  // Configuration for the Jodit Editor
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typing your article here...",
      height: "50dvh",
    }),
    []
  );

  const handleSubmit = async () => {
    if (!title || !content || !image) {
      toast.error(
        "Please fill in the title, description, and select an image."
      );
      return;
    }

    // Create FormData inside the handler to capture the latest state
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await createApost(formData).unwrap();
      toast.success(response.message || "Article created successfully!");
      router.push("/trending/my-articles");
    } catch (error) {
      console.error("Failed to create article:", error);
      const errorMessage =
        (error as any)?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <main className="!py-12 !px-2 md:!px-[7%]">
        <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
          Post a new article
        </h1>
        <div className="w-full mt-12 space-y-6">
          <Label>Article Title:</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your catchy title"
            disabled={isLoading}
          />

          <Label htmlFor="image" className="mb-2 block text-sm font-medium">
            Article Image:
          </Label>

          {imagePreview ? (
            <div className="mb-4">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={300}
                className="max-h-80 w-auto object-contain rounded-lg border"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="mt-2 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                disabled={isLoading}
              >
                Remove Image
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="cursor-pointer py-12 flex flex-col justify-center items-center w-full border-2 border-dashed rounded-lg hover:border-primary transition-colors space-y-4 hover:bg-secondary"
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
              <h4 className="text-base font-medium">
                Click to upload an image
              </h4>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, or GIF (max 5MB)
              </p>
            </label>
          )}

          <Input
            type="file"
            id="image"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/gif"
            disabled={isLoading}
          />

          <Label>Article Description:</Label>
          {/* Jodit Editor Component */}
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => {}}
          />

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Article"}
          </Button>
        </div>
      </main>
    </>
  );
}
