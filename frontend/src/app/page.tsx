import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/lib/locale-config";

// The root path always redirects to the default locale (Arabic).
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
