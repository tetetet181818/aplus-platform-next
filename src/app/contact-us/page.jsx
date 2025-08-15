import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ContactUsPage from "@/pages/ContactUsPage";
import { Suspense } from "react";

export default function ContactUs() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <ContactUsPage />
    </Suspense>
  );
}
