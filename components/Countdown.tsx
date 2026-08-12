"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export default function Countdown({ deadline }: { deadline: string }) {
  const deadlineMs = new Date(deadline).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) {
    // evita mismatch de hidratación: no renderiza números hasta montar en cliente
    return <div className="h-[78px]" aria-hidden />;
  }

  const diff = Math.max(0, deadlineMs - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const units = [
    { value: pad(days), label: "Días" },
    { value: pad(hours), label: "Hs" },
    { value: pad(mins), label: "Min" },
    { value: pad(secs), label: "Seg" },
  ];

  return (
    <div className="flex gap-3.5 flex-wrap justify-center">
      {units.map((u) => (
        <div
          key={u.label}
          className="bg-[rgba(6,30,36,.35)] border border-white/35 backdrop-blur-md rounded-2xl px-4.5 py-3.5 min-w-[78px] text-center"
        >
          <div className="font-display font-bold text-[30px] text-white leading-none">{u.value}</div>
          <div className="text-[10.5px] font-bold tracking-[.1em] uppercase text-[#d3f2ee] mt-0.5">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
