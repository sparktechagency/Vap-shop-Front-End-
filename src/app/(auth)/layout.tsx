import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  if (token) {
    redirect("/");
    return;
  }

  return (
    <>
      <Navbar token={undefined} />
      {children}
      <Footer />
    </>
  );
}
