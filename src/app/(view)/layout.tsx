import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;

  return (
    <>
      <Navbar token={token} />
      {children}
      <Footer />
    </>
  );
}
