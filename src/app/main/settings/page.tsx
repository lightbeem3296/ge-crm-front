"use client";

import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/main/settings/profile');
  }, [router]);

  return null;
}
