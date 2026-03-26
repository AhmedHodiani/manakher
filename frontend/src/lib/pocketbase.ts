import PocketBase from "pocketbase";

const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090"
);

// Disable auto-cancellation to prevent request collisions
pb.autoCancellation(false);

// Sync authStore to a cookie so that proxy.ts (server-side) can read it.
// PocketBase JS SDK uses localStorage by default which is invisible to
// the Next.js proxy/middleware layer.
if (typeof document !== "undefined") {
  pb.authStore.onChange(() => {
    const isValid = pb.authStore.isValid;
    if (isValid) {
      // Store the token and model in a cookie accessible to the proxy
      const cookieValue = JSON.stringify({
        token: pb.authStore.token,
        record: pb.authStore.record,
      });
      document.cookie = `pb_auth=${encodeURIComponent(cookieValue)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    } else {
      // Clear the cookie on logout
      document.cookie = "pb_auth=; path=/; max-age=0; SameSite=Lax";
    }
  }, true);
}

export default pb;
