import Footer from "@/components/core/footer";
import Navbar from "@/components/core/navbar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const res = await fetch("https://10.0.80.13/api/me");
  // console.log(res);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
