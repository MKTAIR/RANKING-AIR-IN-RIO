"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getLogoForBrand, getBrandInitials } from "@/lib/logos";

type Brand = { name: string; count: number };

export default function BrandGrid() {
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [openBrand, setOpenBrand] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => setBrands(data.brands ?? []))
      .catch(() => setBrands([]));
  }, []);

  if (brands === null) return null;

  if (brands.length === 0) {
    return (
      <p className="text-center text-[#eafbf8] text-[15px]">
        Todavía no se cargó el listado de marcas participantes.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[26px]">
      {brands.map((brand) => {
        const logo = getLogoForBrand(brand.name);
        const isOpen = openBrand === brand.name;
        return (
          <div
            key={brand.name}
            className="glass-card rounded-[18px] p-6 flex flex-col gap-4 shadow-[0_8px_24px_-14px_rgba(2,20,22,.45)]"
          >
            <div className="flex items-center gap-3">
              {logo ? (
                <div className="bg-white/90 rounded-lg px-2.5 py-2 h-10 flex items-center">
                  <Image src={logo} alt={brand.name} width={64} height={24} className="h-5 w-auto object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/90 text-[#0d2e30] font-extrabold text-sm flex items-center justify-center shrink-0">
                  {getBrandInitials(brand.name)}
                </div>
              )}
              <div className="font-extrabold text-base text-white">{brand.name}</div>
            </div>
            <div className="h-px bg-white/20" />
            {isOpen && (
              <p className="text-[13.5px] text-[#eafbf8] leading-relaxed">
                Cada compra de {brand.name} suma puntos a tu ranking. Los primeros 20 clientes en
                volumen de compra se llevan premios exclusivos del incentivo.
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpenBrand(isOpen ? null : brand.name)}
                className="text-[12.5px] font-bold text-white bg-black/28 border border-white/35 px-4 py-1.5 rounded-full cursor-pointer"
              >
                {isOpen ? "Ver menos" : "Ver más"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
