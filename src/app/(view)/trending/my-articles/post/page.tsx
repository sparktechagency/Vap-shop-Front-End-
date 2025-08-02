"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useRef } from "react";
import { Editor } from "primereact/editor";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useCreateApostMutation } from "@/redux/features/Trending/TrendingApi";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Featured() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plainTextContent, setPlainTextContent] = useState(""); // New state for plain text
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createApost, { isLoading }] = useCreateApostMutation();
  console.log('content', content);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content); // Using plain text instead of HTML
  formData.append("article_image", image || "");

  const handleSubmit = async () => {
    formData.forEach((value, key) => {
      console.log(key, value);
    })
    try {
      const response = await createApost(formData).unwrap();
      console.log('response', response);
      if (response.ok) {
        toast.success(response.message || "Article created successfully");
        router.push("/trending/my-articles");
        setTitle("");
        setContent("");
        setPlainTextContent("");
        setImage(null);
        setImagePreview(null);
      }
      if (!response.ok) {
        toast.error(response.message || "Failed to create article");
      }
    } catch (error) {
      toast.error("Failed to create article");
      console.log(error);
    }
  };

  const handleEditorChange = (e: { htmlValue: string | null, textValue: string }) => {
    setContent(e.htmlValue || '');
    setPlainTextContent(e.textValue || '');
  };

  return (
    <>
      <main className="!py-12 !px-2 md:!px-[7%]">
        <h1 className="text-center font-semibold text-2xl md:text-4xl lg:text-6xl">
          Post a new article
        </h1>
        <div className="w-full mt-12! space-y-6!">
          <Label>Article Title:</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
                className="max-h-80 object-contain rounded-lg border"
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
          <Editor
            value={content}
            onTextChange={handleEditorChange} // Updated handler
            className=""
            style={{ height: "50dvh", borderRadius: "5px" }}
          />

          <Button onClick={handleSubmit}>Post Article</Button>
        </div>
      </main>
    </>
  );
}