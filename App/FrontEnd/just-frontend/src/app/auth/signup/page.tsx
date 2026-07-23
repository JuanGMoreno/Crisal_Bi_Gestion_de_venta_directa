"use client";

import Link from "next/link";
import Image from "next/image";
import SignupForm from "@/features/auth/components/singnupForm/signupForm";
import { BRAND } from "@/shared/config/brand";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-linear-to-br from-white/40 via-white/60 to-primary/50 dark:from-gray-900/80 dark:via-black/80 dark:to-gray-950/80">
      <div className="flex flex-col justify-center w-full max-w-md md:max-w-lg lg:max-w-xl px-8 py-10 bg-background rounded-2xl shadow-2xl md:rounded-3xl mx-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">
          Crear cuenta en {BRAND.productName}
        </h2>
        <SignupForm />
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-foreground">
            Ya tienes una cuenta?{" "}
            <Link href="/auth/signin" className="font-semibold text-primary hover:underline">
              Inicia sesion
            </Link>
          </p>
        </div>
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
