"use client";

import { InstallDrawer } from "@/components/install-drawer";
import { Button } from "@/components/ui/button";
import { useA2HS } from "@/hooks/useA2H";
import { isPWA } from "@/utils/pwa";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const { promptEvent } = useA2HS();
  const [mounted, setMounted] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { data: session } = useSession();

  // PWA detection and redirect
  useEffect(() => {
    setMounted(true);

    // Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Redirect to proposals if notification is enabled, otherwise to onboarding
    if (isPWA()) {
      if (session?.user?.notificationEnabled) {
        router.replace("/proposals");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [router, session]);

  // Monitor URL changes and return to landing page if not a PWA
  useEffect(() => {
    if (!isPWA()) {
      // Event listener for URL changes
      window.addEventListener("popstate", () => {
        if (window.location.pathname !== "/") {
          router.replace("/");
        }
      });

      return () => {
        window.removeEventListener("popstate", () => {});
      };
    }
  }, [router]);

  // Don't render before mounting (prevent hydration mismatch)
  if (!mounted) return null;

  // Return null if already in PWA mode (redirect before rendering)
  if (isPWA()) return null;

  return (
    <div className="h-screen flex flex-col relative bg-black overflow-hidden">
      {/* Checkerboard Background */}
      <div className="absolute inset-0 bg-[#000000] bg-opacity-70 z-0">
        <div className="absolute inset-0 bg-[url('/checkerboard.svg')] bg-repeat opacity-50"></div>
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex items-center justify-center pt-12 pb-6">
        <div className="flex items-center gap-2">
          <Image src="/icon.jpg" alt="Daiko Logo" width={32} height={32} />
          <span className="text-2xl font-bold text-white">DAIKO</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 text-center relative z-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">
            <span className="text-primary">Exit Strategy Agent</span>
          </h1>
          <p className="text-md mb-10 text-white/80">
            An AI-powered trading assistant for busy investors. No constant monitoring or Twitter scrolling
            required—Daiko delivers personalized trading strategies optimized just for you.
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4 text-left">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Vibe Trading for Beginners</h3>
                <p className="text-white/70 text-sm">
                  Just hit Accept or Decline. AI monitors your portfolio and gives you personalized proposals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 text-left">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-5 h-5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Talk Trading for Pros</h3>
                <p className="text-white/70 text-sm">
                  Understand the “why” behind every proposal with sources and smart chats
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Install Button */}
      <div className="relative z-10 px-4 pb-8 space-y-3">
        <InstallDrawer>
          <Button
            size="lg"
            className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90 flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Install App
          </Button>
        </InstallDrawer>

        <div className="flex justify-center items-center text-xs text-white/50 mt-4 flex-wrap">
          <span className="mr-2">© 2024 DAIKO</span>
          <span className="mx-2 hidden sm:inline">•</span>
          <span className="mx-2 hidden sm:inline">Democratizing Crypto Trading</span>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-white/80 transition-colors mx-2">
            Terms
          </Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-white/80 transition-colors mx-2">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
};
