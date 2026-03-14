"use client"


import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/shared/components/ui/field"


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de login

  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white/40 via-white/60 to-primary/50 dark:from-gray-900/80 dark:via-black/80 dark:to-gray-950/80">
      {/* Caja de login centrada */}
      <div className="flex flex-col justify-center w-full max-w-md  md:max-w-lg lg:max-w-xl px-8 py-10  bg-background rounded-2xl shadow-2xl md:rounded-3xl mx-12 ">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldSet className="w-full">
            <FieldGroup className="gap-3">
              <Field>
                <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                <Input id="email" type="text" placeholder="Correo Electrónico" className="w-full h-9"/>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input id="password" type="password" placeholder="Ingrese su contraseña" className="w-full h-9"/>
                <p className="text-sm text-primary hover:underline cursor-pointer w-full text-right">¿Olvidaste la contraseña?</p>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button type="submit" className="w-full h-11 font-semibold rounded-lg shadow-md hover:scale-105 hover:cursor-pointer active:scale-95 transition duration-300" >
            Iniciar Sesión
          </Button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/singup" className="font-semibold text-primary hover:underline">Regístrate</Link>
          </p>
        </div>
        <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-6">Sistema de gestión para distribuidores autorizados</p>
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
