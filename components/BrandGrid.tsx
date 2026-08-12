"use client";

import { useEffect, useState } from "react";

type Brand = { name: string; url?: string | null; count: number };

export default function BrandGrid() {
  const [brands, setBrands] = useState<Brand[] | null>(null);

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
      {brands.map((brand) => (
        <div
          key={brand.name}
          className="glass-card rounded-[18px] p-6 flex flex-col gap-4 shadow-[0_8px_24px_-14px_rgba(2,20,22,.45)]"
        >
          <div className="font-extrabold text-lg text-white">{brand.name}</div>
          <div className="h-px bg-white/20" />
          <div className="flex justify-end">
            {brand.url ? (
              
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12.5px] font-bold text-white bg-black/28 border border-white/35 px-4 py-1.5 rounded-full hover:bg-black/40 transition-colors"
              >
                Ver productos →
              </a>
            ) : (
              <span className="text-[12.5px] font-bold text-white/60 px-4 py-1.5">
                Próximamente
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
