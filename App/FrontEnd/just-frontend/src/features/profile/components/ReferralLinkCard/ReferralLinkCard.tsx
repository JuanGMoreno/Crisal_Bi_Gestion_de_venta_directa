"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GitBranchPlus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { DistributorProfile } from "../../types/Profile";
import {
  ReferralCodeFormData,
  ReferralCodeFormInput,
  referralCodeSchema,
} from "../../validations/profileSchema";
import { useLinkReferralCodeMutation } from "../../hooks/useLinkReferralCodeMutation";

type ReferralLinkCardProps = {
  profile: DistributorProfile;
};

export function ReferralLinkCard({ profile }: ReferralLinkCardProps) {
  const linkReferralCodeMutation = useLinkReferralCodeMutation();
  const form = useForm<ReferralCodeFormInput, unknown, ReferralCodeFormData>({
    resolver: zodResolver(referralCodeSchema),
    defaultValues: {
      codigo_referido: "",
    },
  });

  const hasParent = Boolean(profile.padre);

  const onSubmit = async (data: ReferralCodeFormData) => {
    try {
      await toast.promise(linkReferralCodeMutation.mutateAsync(data.codigo_referido.trim()), {
        loading: "Vinculando perfil...",
        success: "Relacion jerarquica registrada correctamente",
        error: (error) =>
          error instanceof Error ? error.message : "No se pudo vincular tu perfil",
        position: "top-right",
      });

      form.reset({ codigo_referido: "" });
    } catch {
      // El toast.promise ya muestra el resultado.
    }
  };

  return (
    <div className="mt-5 rounded-2xl border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="font-semibold">Vinculacion por codigo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasParent
              ? "Tu perfil ya pertenece a una jerarquia."
              : "Ingresa el codigo vigente del distribuidor padre para asociarte a su jerarquia."}
          </p>
        </div>
        <GitBranchPlus className="h-5 w-5 text-muted-foreground" />
      </div>

      <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet disabled={hasParent || linkReferralCodeMutation.isPending}>
          <FieldGroup className="gap-3">
            <Controller
              name="codigo_referido"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="referral-code">Codigo de referido</FieldLabel>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      {...field}
                      id="referral-code"
                      className="h-9"
                      placeholder="EJEMPLO-1A2B"
                      aria-invalid={fieldState.invalid}
                      disabled={hasParent || linkReferralCodeMutation.isPending}
                    />
                    <Button
                      type="submit"
                      className="sm:w-40"
                      disabled={hasParent || linkReferralCodeMutation.isPending}
                    >
                      {linkReferralCodeMutation.isPending ? "Vinculando..." : "Vincular"}
                    </Button>
                  </div>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}
