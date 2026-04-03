"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { authSigninSchema } from "@/features/auth/validations/authSigninSchema";
import { AuthSignin } from "@/features/auth/validations/authSigninSchema";
import authServices from "@/features/auth/services/authServices";
export default function SigninForm() {
    const authSrv = authServices();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(
            authSigninSchema
        ),
        defaultValues: {
            correo: "",
            contraseña: "",
        },
    });

    const onSubmit = async (data: AuthSignin) => {
        try {
            const response = await toast.promise(authSrv.Signin(data), {
                loading: "Validando credenciales...",
                success: "Inicio de sesion correcto",
                error: (error) => (error instanceof Error ? error.message : "Error al iniciar sesion"),
                position: "top-right",
            });
            console.log("Token recibido:", response);
            router.replace("/system");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} id="form-signin">
            <FieldSet className="w-full">
                <FieldGroup className="gap-3">
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
                                <Input {...field} id="password" type="password" aria-invalid={fieldState.invalid} placeholder="Ingrese su contraseña" className="w-full h-9" />
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
                {form.formState.isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
        </form>
    )
}
