// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { useUser } from "@/context/userContext";
// import { useUpdateAboutMutation } from "@/redux/features/users/userApi";
// import { Editor } from "primereact/editor";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import DOMPurify from "dompurify";
// import { toast } from "sonner";
// import howl from "@/lib/howl";
// type FormData = {
//   about: string;
// };

// export default function About() {
//   const my = useUser();
//   const [updateAbout] = useUpdateAboutMutation();
//   const { handleSubmit, setValue, watch } = useForm<FormData>({
//     defaultValues: {
//       about: "",
//     },
//   });

//   useEffect(() => {
//     async function getAbout() {
//       const call = await howl({ link: `about?user_id=${my.id}` });
//       const aboutData = call?.data?.content;
//       console.log(call);

//       if (aboutData) {
//         setValue("about", aboutData);
//       }
//     }
//     getAbout();
//   }, []);
//   const aboutValue = watch("about");
//   const handleEditorChange = (e: any) => {
//     setValue("about", e.htmlValue);
//   };

//   const onSubmit = async (data: FormData) => {
//     console.log("Submitted about:", data.about);
//     const dataset = {
//       content: data.about,
//     };
//     try {
//       const res = await updateAbout(dataset).unwrap();
//       console.log(res);

//       if (res.ok) {
//         toast.success("About us updated Successfully");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   console.log(my);

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6! pt-4!">
//       <h1 className="text-3xl font-semibold">About Us</h1>

//       <Editor
//         value={aboutValue}
//         onTextChange={handleEditorChange}
//         style={{ height: "50dvh" }}
//       />

//       <Button type="submit">Update About Us</Button>

//       <Separator />
//       <h2 className="text-xl font-semibold mb-12">Preview:</h2>
//       <div
//         className="prose dark:prose-invert max-w-none"
//         dangerouslySetInnerHTML={{
//           __html: DOMPurify.sanitize(aboutValue || "Start typing to see a preview..."),
//         }}
//       />
//     </form>
//   );
// }



// Your main page file, e.g., app/dashboard/about/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/userContext";
import { useUpdateAboutMutation } from "@/redux/features/users/userApi";
import React, { useEffect, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import DOMPurify from "dompurify";
import { toast } from "sonner";
import howl from "@/lib/howl";

// ✅ Import JoditEditor instead of TipTap or PrimeReact
import JoditEditor from "jodit-react";

type FormData = {
  about: string;
};

export default function About() {
  const my = useUser();
  const [updateAbout] = useUpdateAboutMutation();
  const editor = useRef(null); // Create a ref for the editor instance

  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      about: "",
    },
  });

  const aboutValue = watch("about");

  // Fetch initial data - this logic remains the same
  useEffect(() => {
    async function getAbout() {
      if (!my?.id) return;
      const call = await howl({ link: `about?user_id=${my.id}` });
      const aboutData = call?.data?.content || "";
      setValue("about", aboutData);
    }
    getAbout();
  }, [my?.id, setValue]);

  // Form submission logic - this also remains the same
  const onSubmit = async (data: FormData) => {
    const dataset = {
      content: data.about,
    };
    try {
      const res = await updateAbout(dataset).unwrap();
      if (res.ok) {
        toast.success("About us updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update");
    }
  };

  // ✅ Jodit configuration object
  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/
      placeholder: "Start typing...",
      height: "50dvh",
      buttons: [
        "bold", "italic", "underline", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "image", "link", "table", "|",
        "align", "left", "center", "right", "justify", "|",
        "undo", "redo", "|",
        "source", "fullsize"
      ],
    }),
    []
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
      <h1 className="text-3xl font-semibold">About Us</h1>

      {/* --- JODIT EDITOR REPLACEMENT --- */}
      <JoditEditor
        ref={editor}
        value={aboutValue}
        config={config}
        // Updates the form state when you click out of the editor
        onBlur={(newContent) => setValue("about", newContent)}
      />
      {/* ----------------------------- */}

      <Button type="submit">Update About Us</Button>

      <Separator />

      <h2 className="text-xl font-semibold">Preview:</h2>
      {/* The preview section works exactly the same */}
      <div
        className="prose dark:prose-invert max-w-none rounded-md border p-4"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(aboutValue || "Start typing to see a preview..."),
        }}
      />
    </form>
  );
}