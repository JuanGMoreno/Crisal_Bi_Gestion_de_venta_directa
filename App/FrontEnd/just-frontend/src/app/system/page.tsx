import Image from "next/image";
import Link from "next/link";
import SystemUrls from "@/app/system/urls";
import { Button } from "@/shared/components/ui/button";
import { BRAND } from "@/shared/config/brand";

export default function SystemPage() {
  return (
    <section className="animate-hero-fade relative flex h-[calc(100svh-6rem)] max-h-[calc(100svh-6rem)] min-h-0 w-full items-center justify-center overflow-hidden rounded-3xl border border-white/20 motion-reduce:animate-none">
      <Image
        src={BRAND.heroImage}
        alt="Crisal con mariposa morfo y visuales de gestion comercial"
        fill
        priority
        sizes="100vw"
        className="animate-hero-fade object-cover motion-reduce:animate-none"
      />

      <div className="animate-hero-fade absolute inset-0 bg-linear-to-r from-[#031b2f]/82 via-[#0f3f5f]/62 to-[#2f5f3a]/48 [animation-delay:120ms] motion-reduce:animate-none" />
      <div className="animate-hero-fade absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(166,211,170,0.26),transparent_45%)] [animation-delay:180ms] motion-reduce:animate-none" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-5 py-6 text-white md:gap-6 md:px-10 md:py-8 lg:gap-7 lg:px-12">
        <div className="animate-hero-rise inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md [animation-delay:220ms] motion-reduce:animate-none">
          {BRAND.productName}
        </div>

        <h1 className="animate-hero-rise max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-balance drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)] [animation-delay:320ms] motion-reduce:animate-none md:text-5xl lg:text-6xl">
          Controla tu operacion comercial
        </h1>

        <p className="animate-hero-rise max-w-3xl text-sm leading-relaxed text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] [animation-delay:420ms] motion-reduce:animate-none md:text-lg lg:text-xl">
          Gestiona productos, inventario, clientes y ventas desde un panel claro, con trazabilidad y datos listos para decidir.
        </p>

        <div className="animate-hero-rise mt-2 flex w-full flex-col gap-3 [animation-delay:520ms] motion-reduce:animate-none sm:w-auto sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl px-7 text-base font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            <Link href={SystemUrls["system:dashboard"]}>Ir al Panel de Control</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white/60 bg-white/12 px-7 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/22 hover:text-white"
          >
            <Link href={SystemUrls["system:sales"]}>Ir a Ventas</Link>
          </Button>
        </div>
      </div>

      <div className="animate-hero-fade pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#03111f]/50 to-transparent [animation-delay:180ms] motion-reduce:animate-none" />
    </section>
  );
}
