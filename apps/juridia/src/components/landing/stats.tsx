"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileStack } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalDocuments: number;
  publicInstitutions: number;
  statesServed: number;
  lawOffices: number;
}

export function Stats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d && typeof d.totalDocuments === "number" ? d : null))
      .catch(() => null);
  }, []);

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `+ ${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return `+ ${Math.round(n / 1000)}k`;
    return `+ ${n}`;
  };

  const items = [
    { icon: FileStack, value: stats?.totalDocuments ?? 0, label: "Documentos no ambiente", big: true },
  ];

  if (!stats) return null; // Do not fabricate statistics while unsigned or offline.

  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="container-juridia py-12">
        <div className="grid grid-cols-1 gap-6">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <it.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight sm:text-3xl">
                {it.big ? fmt(it.value) : `+ ${it.value.toLocaleString("pt-BR")}`}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {it.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
