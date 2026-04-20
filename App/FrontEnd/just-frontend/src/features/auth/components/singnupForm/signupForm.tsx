"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/shared/components/ui/field"
import { authSignupSchema } from "@/features/auth/validations/authSignupSchema";
import useAuthServices from "@/features/auth/services/authServices";
import { signupParams } from "@/features/auth/types/authTypes";

type SignupFormInput = z.input<typeof authSignupSchema>;
type SignupFormOutput = z.output<typeof authSignupSchema>;


export default function SignupForm() {
    const authSrv = useAuthServices();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<SignupFormInput, unknown, SignupFormOutput>({
        resolver: zodResolver(
            authSignupSchema
        ),
        defaultValues: {
            nombre: "",
            correo: "",
            contraseña: "",
            confirmarContrasena: "",
            rol: "Consultora",
        },
    });

    const onSubmit = async (data: SignupFormOutput) => {
        const payload: signupParams = {
            nombre: data.nombre,
            correo: data.correo,
            contraseña: data.contraseña,
            rol: data.rol,
        };

        try {
            const response = await toast.promise(authSrv.Signup(payload), {
                loading: "Creando cuenta...",
                success: "Cuenta creada correctamente",
                error: (error) => (error instanceof Error ? error.message : "Error al registrarse"),
                position: "top-right",
            });
            console.log("Usuario creado:", response);
            form.reset({
                nombre: "",
                correo: "",
                contraseña: "",
                confirmarContrasena: "",
                rol: "Consultora",
            });
            router.push("/auth/signin");
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    }

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} id="form-signin">
            <FieldSet className="w-full">
                <FieldGroup className="gap-3">
                    <Controller
                        name="nombre"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                                <Input {...field} id="name" type="text" aria-invalid={fieldState.invalid} placeholder="Ingrese su nombre" className="w-full h-9" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="correo"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                                <Input {...field} id="email" type="email" aria-invalid={fieldState.invalid} placeholder="Correo Electrónico" className="w-full h-9" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="contraseña"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ingrese su contraseña"
                                        className="w-full h-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name="confirmarContrasena"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirm-password">Confirmar Contraseña</FieldLabel>
                                <div className="relative">
                                    <Input
                                        {...field}
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Confirme su contraseña"
                                        className="w-full h-9 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </FieldSet>
            <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full h-11 font-semibold rounded-lg shadow-md hover:scale-105 hover:cursor-pointer active:scale-95 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                form="form-signin"
            >
                {form.formState.isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
        </form>
    )
}
