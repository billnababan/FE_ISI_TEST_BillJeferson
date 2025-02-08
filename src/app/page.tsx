"use client"; // Tambahkan ini karena kita menggunakan hook dari Next.js

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redirect ke /pages/login saat komponen dimuat
  useEffect(() => {
    router.push("/pages/login");
  }, [router]);

  return null; // Tidak perlu menampilkan apa pun karena langsung diarahkan
}
