"use client";

import { useEffect, useState } from "react";

type Status = {
  loaded: boolean;
  updatedAt: string | null;
  fileName: string | null;
  brands: { name: string; count: number }[];
};

type UploadResult = { ok: true; updatedAt: string; brands: { name: string; count: number }[] };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<UploadResult | null>(null);

  function loadStatus() {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Elegí un archivo .xlsx primero.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append("password", password);
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir el archivo.");
      } else {
        setSuccess(data);
        setFile(null);
        loadStatus();
      }
    } catch {
      setError("No se pudo conectar. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f7] font-body text-[#0d2e30] py-12 px-6">
      <div className="max-w-[560px] mx-auto">
        <h1 className="font-display font-bold text-3xl mb-1">Admin — Air in Rio</h1>
        <p className="text-sm text-[#4b6a6b] mb-8">
          Subí el Excel con el Top 20 de cada marca. Esto reemplaza los datos actuales del sitio.
        </p>

        <div className="bg-white rounded-2xl border border-[#dbe6e6] p-5 mb-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[#4b6a6b] mb-2">
            Estado actual
          </div>
          {status?.loaded ? (
            <>
              <p className="text-sm mb-2">
                Última carga: <strong>{new Date(status.updatedAt!).toLocaleString("es-AR")}</strong>
                {status.fileName ? <> — archivo: {status.fileName}</> : null}
              </p>
              <ul className="text-sm text-[#4b6a6b] grid grid-cols-2 gap-x-4 gap-y-1">
                {status.brands.map((b) => (
                  <li key={b.name}>
                    {b.name}: {b.count} cliente{b.count === 1 ? "" : "s"}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-[#4b6a6b]">Todavía no se cargó ningún ranking.</p>
          )}
        </div>

        <a
          href="/templates/plantilla-top20.xlsx"
          className="inline-block text-sm font-semibold text-[#0e7c8c] mb-6 underline"
        >
          Descargar plantilla de Excel
        </a>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#dbe6e6] p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#4b6a6b] mb-1.5">
              Contraseña de administrador
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#cfdcdc] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#05bbc4]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#4b6a6b] mb-1.5">
              Archivo Excel (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#05bbc4] text-white font-bold text-sm rounded-lg py-3 disabled:opacity-60"
          >
            {loading ? "Subiendo…" : "Subir y reemplazar ranking"}
          </button>

          {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
          {success && (
            <p className="text-sm text-green-700 font-semibold">
              Listo — se cargaron {success.brands.length} marcas correctamente.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
