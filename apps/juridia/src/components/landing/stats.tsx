"use client";

import { motion } from "framer-motion";
import { Building2, ShieldCheck, FileCheck2, FileText } from "lucide-react";

// O legado exibia números não comprovados mesmo quando /api/stats retornava 401.
// A página pública descreve capacidades e controles, sem fabricar estatísticas.
const items = [
  { icon: Building2, title: "Fontes oficiais", description: "Consulta com referência à origem" },
  { icon: ShieldCheck, title: "Revisão humana", description: "Validação jurídica antes do uso" },
  { icon: FileCheck2, title: "Citações verificáveis", description: "Rastreabilidade e conferência" },
  { icon: FileText, title: "Minutas jurídicas", description: "Produção assistida com supervisão" },
];

export function Stats() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="container-juridia py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold sm:text-base">{item.title}</div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
