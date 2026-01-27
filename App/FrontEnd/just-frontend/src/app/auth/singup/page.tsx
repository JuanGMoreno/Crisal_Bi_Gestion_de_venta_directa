"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, EyeClosed } from "lucide-react";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Consultora");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-white/40 via-white/60 to-primary/50 dark:from-gray-900/80 dark:via-black/80 dark:to-gray-950/80">
      {/* Caja de registro centrada */}
      <div className="flex flex-col justify-center w-full max-w-md md:max-w-lg lg:max-w-xl px-8 py-10 bg-background rounded-2xl shadow-2xl md:rounded-3xl mx-12 ">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Registro</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldSet className="w-full">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" className="w-full h-11" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full h-11" required />
              </Field>
              <Field className="relative">
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-11" required />
                {/* <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeClosed size={16} /> : <Eye size={16} />}
                </button> */}
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Rol</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="engineering">Consultora</SelectItem>
                      <SelectItem value="design">Líder de Grupo</SelectItem>
                      <SelectItem value="marketing">Líder</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>
          <Button type="submit" className="w-full h-11 font-semibold rounded-lg shadow-md transition hover:scale-105 hover:cursor-pointer active:scale-95 duration-300">
            Registrarse
          </Button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/singin" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
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
