"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("http://localhost:6500/api/auth/getCurrentUser", {
          withCredentials: true,
        });

        if (res.data?.success && res.data?.user) {
          setAuthenticated(true);
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
