// src/app/auth/login/page.tsx
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}