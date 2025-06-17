import ProductCarousel from "@/components/product-carousel";
import Link from "next/link";

export default function Home() {
  const slides = [
    {
      id: 1,
      image: "/image/home/car3.png",
      alt: "ARGUS Z2 Product",
    },
    {
      id: 2,
      image: "/image/home/car2.png",
      alt: "ARGUS Z2 Side View",
    },
    {
      id: 3,
      image: "/image/home/car2.png",
      alt: "ARGUS Z2 Features",
    },
    {
      id: 4,
      image: "/image/home/car1.png",
      alt: "ARGUS Z2 Colors",
    },
    {
      id: 5,
      image: "/image/home/car3.png",
      alt: "ARGUS Z2 Usage",
    },
  ];
  return (
    <>
      <header className="w-screen !py-12">
        <ProductCarousel slides={slides} />
        <div className="!py-12">
          <h1 className="font-bold text-2xl md:text-4xl text-center">
            Trending
          </h1>

          <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-6">
            {trendingCategories.map((title, i) => (
              <Link href={"/trending"} key={i}>
                <div className="w-full flex flex-col justify-center items-center hover:scale-105 transition-transform cursor-pointer">
                  <div
                    className="size-20 lg:size-[150px] xl:size-[200px] rounded-3xl border bg-cover bg-center bg-no-repeat overflow-hidden"
                    style={{
                      backgroundImage: `url('/image/home/trend1.webp')`,
                    }}
                  />
                  <div className="w-full text-center font-semibold !pt-4 text-xs sm:text-sm md:text-lg">
                    {title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
const trendingCategories = [
  "Pod Systems",
  "Mod Kits",
  "Disposable Vapes",
  "Nicotine Pouches",
  "E-Liquids",
  "Coils & Pods",
];
