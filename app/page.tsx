import Image from "next/image";
import Countdown from "@/components/Countdown";
import SearchPanel from "@/components/SearchPanel";
import BrandGrid from "@/components/BrandGrid";

const DEADLINE = process.env.NEXT_PUBLIC_DEADLINE || "2026-09-18T18:00:00-03:00";
const CLAIM =
  process.env.NEXT_PUBLIC_CLAIM ||
  "Cada venta te acerca al Top del ranking. Participá y ganá premios exclusivos.";
const DEADLINE_LABEL = process.env.NEXT_PUBLIC_DEADLINE_LABEL || "18 de septiembre a las 18 hs";

export default function Home() {
  return (
    <div className="font-body bg-air-teal text-air-ink overflow-x-hidden">
      <section className="relative">
        <div className="relative w-full">
          <Image
            src="/assets/arena.png"
            alt="Air in Rio"
            width={1920}
            height={600}
            priority
            className="block w-full h-auto"
          />
          <nav className="absolute inset-0 z-[2] flex items-start justify-end pt-6 px-6 sm:px-10 pointer-events-none">
            <div className="flex items-center gap-2 bg-[rgba(10,40,32,.35)] border border-white/40 backdrop-blur-md rounded-full px-4 py-2 pointer-events-auto">
              <span className="w-[7px] h-[7px] rounded-full bg-[#5ee6c8] inline-block pulse-dot" />
              <span className="text-xs font-bold text-white tracking-wide">
                Incentivo de ventas a clientes
              </span>
            </div>
          </nav>
        </div>

        <div className="relative min-h-[420px] bg-air-teal">
          <div className="relative z-[1] px-6 sm:px-12 pt-14 pb-[90px] max-w-[640px] mx-auto text-center">
            <div className="w-[34px] h-[3px] bg-white mx-auto mb-5 rounded-sm opacity-85" />
            <p className="text-xl leading-relaxed font-semibold text-white max-w-[520px] mx-auto [text-shadow:0_2px_14px_rgba(0,30,40,.3)]">
              {CLAIM}
            </p>

            <div className="mt-[30px]">
              <Countdown deadline={DEADLINE} />
            </div>
            <div className="text-[12.5px] text-[#eafbf8] mt-2.5 font-semibold">
              Cierra el {DEADLINE_LABEL}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-[4] flex justify-center -mt-[58px] px-6">
        <SearchPanel />
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pt-24 pb-28">
        <div className="text-center max-w-[620px] mx-auto mb-[52px]">
          <div className="text-[12.5px] font-bold tracking-[.08em] uppercase text-[#e6faf7] mb-2.5">
            Marcas participantes
          </div>
          <h2 className="font-display font-bold text-4xl m-0 text-white">
            Sumá puntos con cada marca
          </h2>
          <p className="text-[15.5px] text-[#eafbf8] mt-3 leading-relaxed">
            Cada compra de las marcas del programa suma puntos a tu ranking. Elegí una para ver el
            detalle.
          </p>
        </div>

        <BrandGrid />
      </section>
    </div>
  );
}
