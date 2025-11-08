"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Editor } from "primereact/editor";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
// Assuming you have an update mutation hook, e.g., useUpdateApostMutation
import {
  useGetArtialByidQuery,
  useUpdateArticalMutation,
} from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import JoditEditor from "jodit-react";

export default function Featured() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>(); // Specify type for id

  // Fetch the existing article data
  const { data: article } = useGetArtialByidQuery({ id: id });
  const articleData = article?.data;

  // State for form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useRef(null);
  // Use the update mutation hook
  const [updateArtical, { isLoading }] = useUpdateArticalMutation();

  // Effect to populate form with fetched data
  useEffect(() => {
    if (articleData) {
      setTitle(articleData.title || "");
      setContent(articleData.content || "");
      setImagePreview(articleData.article_image || null);
    }
  }, [articleData]); // This effect runs when articleData is available

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typing your article here...",
      height: "50dvh",
    }),
    []
  );
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // Only append the image if a new one has been selected
    if (image) {
      formData.append("image", image);
    }
    // Many backends require a _method field to handle PUT requests with FormData
    formData.append("_method", "PUT");

    try {
      // Call the update mutation with the article ID and form data
      const response = await updateArtical({ id, formData }).unwrap();
      console.log("response", response);

      if (response.ok) {
        toast.success(response.message || "Article updated successfully");
        router.push("/trending/my-articles");
      } else {
        toast.error(response.message || "Failed to update article");
      }
    } catch (error) {
      toast.error("An unexpected error occurred while updating the article.");
      console.error(error);
    }
  };

  const handleEditorChange = (e: {
    htmlValue: string | null;
    textValue: string;
  }) => {
    setContent(e.htmlValue || "");
  };

  return (
    <>
      <main className="!py-12 !px-2 md:!px-[7%]">
        <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
          Edit article
        </h1>
        <div className="w-full mt-12! space-y-6!">
          <Label>Article Title:</Label>
          {/* The value is now controlled by state, which is set by useEffect */}
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />

          <Label htmlFor="image" className="mb-2 block text-sm font-medium">
            Article Image:
          </Label>

          {/* This logic now correctly shows the existing image or the new preview */}
          {imagePreview ? (
            <div className="mb-4">
              <Image
                src={imagePreview}
                alt="Article Preview"
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
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="cursor-pointer py-12! flex flex-col justify-center items-center w-full border-2 border-dashed rounded-lg hover:border-muted transition-colors space-y-6! hover:bg-secondary"
            >
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2!" />
              <h4 className="text-base font-medium">
                {image ? image.name : "Select an image"}
              </h4>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, or GIF up to 5mb
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
          />

          <Label>Article Description:</Label>
          {/* The value is now controlled by state, which is set by useEffect */}
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => {}}
          />

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Article"}
          </Button>
        </div>
      </main>
    </>
  );
}
