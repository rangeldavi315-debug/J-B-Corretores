"use client";

import { motion } from "framer-motion";
import { Star, Users, Building, ShieldCheck, type LucideIcon } from "lucide-react";
import styles from "./Indicators.module.css";
import { useCountUp } from "../hooks/useCountUp";

interface IndicatorData {
  id: number;
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const indicatorsData: IndicatorData[] = [
  { id: 1, end: 10, suffix: "+", label: "Anos de Experiência", description: "Atuando no mercado de luxo", icon: Star },
  { id: 2, end: 500, suffix: "+", label: "Famílias Atendidas", description: "Clientes plenamente satisfeitos", icon: Users },
  { id: 3, end: 250, prefix: "R$ ", suffix: "M+", label: "Em Negócios", description: "Volume geral de vendas", icon: Building },
  { id: 4, end: 100, suffix: "%", label: "Segurança", description: "Garantia jurídica e transparência", icon: ShieldCheck },
];

function IndicatorCard({ data, index }: { data: IndicatorData; index: number }) {
  const { count, ref } = useCountUp(data.end, 2000, true);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={styles.card}
    >
      <div className={styles.iconWrapper}>
        <data.icon size={28} className={styles.icon} />
      </div>
      <h3 className={styles.number}>
        {data.prefix}{count}{data.suffix}
      </h3>
      <h4 className={styles.label}>{data.label}</h4>
      <p className={styles.description}>{data.description}</p>
    </motion.div>
  );
}

export default function Indicators() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {indicatorsData.map((item, index) => (
            <IndicatorCard key={item.id} data={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
