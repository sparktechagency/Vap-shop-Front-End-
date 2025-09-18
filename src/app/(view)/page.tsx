// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import SliderWithSkeleton, {
//   SliderSkeleton,
// } from "@/components/SliderWithSkeleton";
// import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
// import Link from "next/link";
// import Cookies from "js-cookie";
// export default function Home() {
//   const token = Cookies.get("token");
//   const { data: categorys, isLoading: isCategoriesLoading } =
//     useGetallCategorysQuery();
//   console.log(categorys);

//   const trendingCategories = categorys?.data?.map(
//     (category: any) => category
//   ) || [
//     "Pod Systems",
//     "Mod Kits",
//     "Disposable Vapes",
//     "Nicotine Pouches",
//     "E-Liquids",
//     "Coils & Pods",
//   ];

//   if (isCategoriesLoading) {
//     return (
//       <div className="w-screen !py-12">
//         <SliderSkeleton />
//         <div className="!py-12">
//           <h1 className="font-bold text-2xl md:text-4xl text-center mb-12 opacity-10">
//             Trending
//           </h1>
//           <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="flex flex-col items-center">
//                 <div className="size-20 lg:size-[150px] xl:size-[200px] rounded-3xl bg-gray-200 animate-pulse" />
//                 <div className="w-3/4 h-4 mt-4 bg-gray-200 rounded animate-pulse" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <>
//       <header className="w-screen !py-12">
//         <SliderWithSkeleton />

//         <div className="!py-12 mx-auto">
//           <h1 className="font-bold text-2xl md:text-4xl text-center">
//             Trending
//           </h1>
//           <div className="flex justify-center">
//             <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6 justify-center place-items-center">
//               {trendingCategories.map((cat: any, i: number) => (
//                 <Link href={`/trending?title=${cat.name}`} key={i}>
//                   <div className="w-full flex flex-col justify-center items-center hover:scale-105 transition-transform cursor-pointer">
//                     <div
//                       className="size-20 lg:size-[150px] xl:size-[220px] rounded-3xl border bg-cover bg-center bg-no-repeat overflow-hidden"
//                       style={{
//                         backgroundImage: `url(${cat.image})`,
//                       }}
//                     />
//                     <div className="w-full text-center font-semibold !pt-4 text-xs sm:text-sm md:text-xl">
//                       {cat.name}
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SliderWithSkeleton, {
  SliderSkeleton,
} from "@/components/SliderWithSkeleton";
import { useGetallCategorysQuery } from "@/redux/features/Home/HomePageApi";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Home() {
  const token = Cookies.get("token");
  const { data: categorys, isLoading: isCategoriesLoading } =
    useGetallCategorysQuery();
  console.log(categorys);

  const trendingCategories = categorys?.data?.map(
    (category: any) => category
  ) || [
    "Pod Systems",
    "Mod Kits",
    "Disposable Vapes",
    "Nicotine Pouches",
    "E-Liquids",
    "Coils & Pods",
  ];

  if (isCategoriesLoading) {
    return (
      <div className="w-screen !py-12">
        <SliderSkeleton />
        <div className="!py-12">
          <h1 className="font-bold text-2xl md:text-4xl text-center mb-12 opacity-10">
            Trending
          </h1>
          <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="size-20 lg:size-[150px] xl:size-[200px] rounded-3xl bg-gray-200 animate-pulse" />
                <div className="w-3/4 h-4 mt-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <header className="w-screen !py-12">
        <SliderWithSkeleton />

        <div className="!py-12 mx-auto relative">
          {/* Blur overlay when token is not available */}
          {!token && (
            <div className="absolute inset-0 z-10 backdrop-blur-sm flex flex-col items-center justify-center  rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Authentication Required
                </h2>
                <p className="text-gray-600 mb-4">
                  Please sign in to view trending products and categories.
                </p>
                <Link 
                  href="/login" 
                  className="inline-block bg-black hover:bg-black/60 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
          
          <h1 className="font-bold text-2xl md:text-4xl text-center">
            Trending
          </h1>
          <div className="flex justify-center">
            <div className="!p-12 !px-[7%] grid grid-cols-3 md:grid-cols-4 2xl:grid-cols-7 gap-6 justify-center place-items-center">
              {trendingCategories.map((cat: any, i: number) => (
                <Link 
                  href={token ? `/trending?title=${cat.name}` : "#"} 
                  key={i}
                  onClick={!token ? (e) => e.preventDefault() : undefined}
                >
                  <div className="w-full flex flex-col justify-center items-center hover:scale-105 transition-transform cursor-pointer">
                    <div
                      className="size-20 lg:size-[150px] xl:size-[220px] rounded-3xl border bg-cover bg-center bg-no-repeat overflow-hidden"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                      }}
                    />
                    <div className="w-full text-center font-semibold !pt-4 text-xs sm:text-sm md:text-xl">
                      {cat?.name.slice(0, 20) + (cat?.name.length > 20 ? "..." : "")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}