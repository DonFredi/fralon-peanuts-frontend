import { Suspense } from "react";
import OrderSuccessPage from "@/modules/orders/pages/order-success-page";

// Suspense is required because OrderSuccessPage uses useSearchParams()
// which only works inside a Suspense boundary in the App Router
export default function Page() {
  return (
    <Suspense>
      <OrderSuccessPage />
    </Suspense>
  );
}

export const metadata = {
  title: "Order placed",
};
