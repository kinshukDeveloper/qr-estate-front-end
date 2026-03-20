// src/app/dashboard/qr/page.tsx
import { Suspense } from "react";
import QRClient from "./QRClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white">Loading QR Dashboard...</div>}>
      <QRClient />
    </Suspense>
  );
}