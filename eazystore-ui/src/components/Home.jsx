import PageHeading from "./PageHeading";
import ProductListings from "./ProductListings";
import apiClient from "../api/apiClient";
import { useLoaderData } from "react-router-dom";

// Hooks
export default function Home() {
  const products = useLoaderData();
  return (
    <div className="max-w-[1152px] mx-auto px-6 py-8">
      {/* Seasonal Offers Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 mb-8 rounded shadow-sm flex flex-col items-center">
        <p className="text-xl font-bold flex items-center gap-2">🎉 Seasonal Offer!</p>
        <p className="text-lg mt-1">Use code <span className="font-mono bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">WELCOME20</span> or <span className="font-mono bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded">FREESHIP</span> for amazing discounts on your entire order!</p>
      </div>

      <PageHeading title="Explore Eazy Retail!">
        Delicious Pizzas, refreshing Cold Drinks, and freshly baked Breads delivered right to your door! Order now and enjoy!
      </PageHeading>
      <ProductListings products={products} />
    </div>
  );
}

export async function productsLoader() {
  try {
    const response = await apiClient.get("/products"); // Axios GET Request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch products. Please try again.",
      { status: error.status || 500 }
    );
  }
}
