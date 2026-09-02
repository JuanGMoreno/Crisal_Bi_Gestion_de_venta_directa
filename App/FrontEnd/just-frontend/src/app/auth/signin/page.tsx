"use client";

import Link from "next/link";
import Image from "next/image";
import SigninForm from "@/features/auth/components/signinForm/signinForm";
import { BRAND } from "@/shared/config/brand";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-linear-to-br from-white/40 via-white/60 to-primary/50 dark:from-gray-900/80 dark:via-black/80 dark:to-gray-950/80">
      <div className="flex flex-col justify-center w-full max-w-md md:max-w-lg lg:max-w-xl px-8 py-10 bg-background rounded-2xl shadow-2xl md:rounded-3xl mx-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
          Iniciar sesión en {BRAND.productName}
        </h2>
        <SigninForm />
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-center text-foreground">
            No tienes una cuenta?{" "}
            <Link href="/auth/signup" className="font-semibold text-link hover:text-link-hover hover:underline">
              Registrate
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {BRAND.tagline}
        </p>
      </div>
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Image
          width={320}
          height={320}
          loading="eager"
          src={BRAND.logo}
          alt={`${BRAND.productName} logo`}
          className="h-auto w-auto"
        />
      </div>
    </div>
  );
}
