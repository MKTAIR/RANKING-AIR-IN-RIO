"use client";

import { useState } from "react";

type LookupResult = { clientNumber: string; brands: string[] } | null;

export default function SearchPanel() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<LookupResult>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lookup?cliente=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo hacer la búsqueda.");
        setResult(null);
      } else {
        setResult(data);
      }
    } catch {
      setError("No se pudo conectar. Probá de nuevo en unos segundos.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-[20px] shadow-[0_18px_40px_-12px_rgba(2,20,22,.55)] p-6 sm:p-[26px_30px] w-full max-w-[640px]">
      <div className="text-[12.5px] font-bold tracking-[.06em] uppercase text-white mb-2.5">
        Buscá tu posición
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ingresá tu número de cliente"
          className="flex-1 border-[1.5px] border-white/30 bg-black/18 rounded-xl px-4 py-3.5 text-[15px] font-body text-white outline-none min-w-0"
          style={{ backgroundColor: "rgba(0,0,0,.18)" }}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#042c30] text-white border border-white/25 rounded-xl px-6 font-bold text-[14.5px] cursor-pointer disabled:opacity-60 shrink-0"
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && (
        <div className="mt-5 pt-5 border-t border-white/25 text-[14.5px] font-semibold text-white">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="mt-5 pt-5 border-t border-white/25">
          {result.brands.length > 0 ? (
            <>
              <div className="font-bold text-[14.5px] text-white mb-3">
                Cliente N° {result.clientNumber} está dentro del Top 20 de:
              </div>
              <div className="flex flex-col gap-2.5">
                {result.brands.map((brandName) => (
                  <div key={brandName} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] bg-white/90 text-base flex items-center justify-center shrink-0">
                      🏅
                    </div>
                    <div className="font-semibold text-[14.5px] text-white">{brandName}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-[10px] bg-black/28 text-white text-base font-extrabold flex items-center justify-center shrink-0">
                –
              </div>
              <div className="font-semibold text-[14.5px] text-white">
                Cliente N° {result.clientNumber} todavía no está en el Top 20 de ninguna marca
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
