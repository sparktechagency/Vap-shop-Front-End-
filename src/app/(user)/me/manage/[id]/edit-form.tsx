import React from "react";
import ProductForm from "./manual";
import howl from "@/lib/howl";
import { cookies } from "next/headers";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default async function EditForm({ id }: { id: string }) {
  const token = (await cookies()).get("token")?.value;
  const prod = await howl({ link: `product-manage/${id}`, token });
  console.log(prod);

  if (!prod.ok) {
    toast.error(prod.message ?? "Something went wrong");
    redirect("/me/manage");
  }

  return (
    <section>
      <ProductForm prod={prod?.data} />
    </section>
  );
}
