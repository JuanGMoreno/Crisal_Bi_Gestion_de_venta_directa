"use client";

import Link from "next/link";
import Image from "next/image";
import SignupForm from "@/features/auth/components/singnupForm/signupForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-linear-to-br from-white/40 via-white/60 to-primary/50 dark:from-gray-900/80 dark:via-black/80 dark:to-gray-950/80">
      {/* Caja de registro centrada */}
      <div className="flex flex-col justify-center w-full max-w-md md:max-w-lg lg:max-w-xl px-8 py-10 bg-background rounded-2xl shadow-2xl md:rounded-3xl mx-12 ">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Registro</h2>
        <SignupForm />
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/signin" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
          </p>
        </div>

      </div>
      {/* Logo a la izquierda en desktop */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <Image
          width={320}
          height={320}
          src="/Logo_Just.svg"
          alt="Logo Just"
          className="w-64 h-auto max-w-xs drop-shadow-2xl "
        />
      </div>
    </div>
  );
}
