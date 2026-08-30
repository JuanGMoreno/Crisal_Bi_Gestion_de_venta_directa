import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";
import { BRAND } from "@/shared/config/brand";

type SessionLoadingScreenProps = {
  title?: string;
  description?: string;
};

export function SessionLoadingScreen({
  title = `Estamos preparando ${BRAND.productName}`,
  description = "El primer acceso puede tardar unos segundos mientras iniciamos el servicio.",
}: SessionLoadingScreenProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-linear-to-br from-sky-50 via-background to-blue-100 px-4 py-8 dark:from-slate-950 dark:via-background dark:to-blue-950 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-[-5rem] h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-700/20 sm:h-96 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-blue-400/25 blur-3xl dark:bg-blue-600/20 sm:h-[28rem] sm:w-[28rem]"
      />

      <section
        role="status"
        aria-live="polite"
        aria-label="Cargando la sesión de Crisal"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-background/90 px-6 py-8 text-center shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:border-white/10 dark:shadow-black/30 sm:px-10 sm:py-10"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent"
        />

        <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-primary/20 bg-primary/5 animate-pulse motion-reduce:animate-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-full border border-sky-300/70 dark:border-sky-700/60"
          />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-primary/10 dark:bg-slate-900 sm:h-24 sm:w-24">
            <Image
              src={BRAND.logo}
              alt=""
              width={96}
              height={96}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <Sparkles
            aria-hidden="true"
            className="absolute right-0 top-1 h-5 w-5 text-sky-500 animate-pulse motion-reduce:animate-none sm:h-6 sm:w-6"
          />
        </div>

        <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-primary uppercase">
          {BRAND.productName}
        </p>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mx-auto mt-7 flex w-full max-w-xs items-center gap-3 rounded-2xl border bg-muted/50 px-4 py-3 text-left">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
            Estamos comprobando tu sesión de forma segura.
          </p>
        </div>

        <div aria-hidden="true" className="mt-7 flex items-center justify-center gap-2">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce motion-reduce:animate-pulse"
              style={{ animationDelay: `${dot * 140}ms` }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
