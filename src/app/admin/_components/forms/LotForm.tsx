"use client";

import type { LotData } from "@/types/property";
import { FieldGrid, NumberField, Section, TagListInput, TextField } from "../fields";

export function LotForm({ data, onChange }: { data: LotData; onChange: (data: LotData) => void }) {
  const set = <K extends keyof LotData>(field: K, value: LotData[K]) => onChange({ ...data, [field]: value });
  const setCommercial = <K extends keyof LotData["commercial"]>(field: K, value: LotData["commercial"][K]) =>
    onChange({ ...data, commercial: { ...data.commercial, [field]: value } });

  return (
    <>
      <Section title="Landing (Hero)">
        <div style={{ marginBottom: "1rem" }}>
          <TextField label="Headline (vende o benefício, não repete o título)" value={data.heroHeadline || ""} onChange={(v) => set("heroHeadline", v || undefined)} placeholder="Ex: Seu próximo espaço para construir começa aqui" />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <TextField label="Subheadline" value={data.heroSubheadline || ""} onChange={(v) => set("heroSubheadline", v || undefined)} placeholder="Ex: Lotes planejados para quem quer construir, morar ou começar um novo projeto." multiline />
        </div>
        <TextField label="Texto do botão principal (CTA)" value={data.ctaLabel || ""} onChange={(v) => set("ctaLabel", v || undefined)} placeholder='Ex: "Quero saber as condições" (padrão se vazio)' />
      </Section>

      <Section title='Seção "Por que conhecer"'>
        <div style={{ marginBottom: "1rem" }}>
          <TextField label="Título emocional" value={data.whyKnowTitle || ""} onChange={(v) => set("whyKnowTitle", v || undefined)} placeholder="Ex: Mais do que um lote. Um espaço para os próximos planos." />
        </div>
        <TextField label="Texto de apoio" value={data.whyKnowText || ""} onChange={(v) => set("whyKnowText", v || undefined)} placeholder="Explique em 1-2 frases por que esse empreendimento merece atenção." multiline />
      </Section>

      <Section title="Lotes">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={3}>
            <NumberField label="Metragem mínima (m²)" value={data.minLotSize} onChange={(v) => set("minLotSize", v)} placeholder="Ex: 225" />
            <NumberField label="Metragem máxima (m²)" value={data.maxLotSize} onChange={(v) => set("maxLotSize", v)} placeholder="Ex: 450" />
            <NumberField label="Lotes disponíveis" value={data.availableUnits} onChange={(v) => set("availableUnits", v)} placeholder="Ex: 12" />
          </FieldGrid>
        </div>
        <TagListInput label="Tipos de lotes disponíveis" items={data.lotTypes} onChange={(v) => set("lotTypes", v)} placeholder="Ex: Lote de esquina" />
      </Section>

      <Section title="Condição Comercial">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={2}>
            <NumberField label="Preço a partir de (R$)" value={data.commercial.priceFrom} onChange={(v) => setCommercial("priceFrom", v)} placeholder="Ex: 95000" />
            <NumberField label="Entrada (R$)" value={data.commercial.downPayment} onChange={(v) => setCommercial("downPayment", v)} placeholder="Ex: 15000" />
            <NumberField label="Valor da parcela (R$)" value={data.commercial.installment} onChange={(v) => setCommercial("installment", v)} placeholder="Ex: 519.99" />
            <NumberField label="Quantidade de parcelas" value={data.commercial.installmentCount} onChange={(v) => setCommercial("installmentCount", v)} placeholder="Ex: 120" />
          </FieldGrid>
        </div>
        <TextField
          label="Condições / observações comerciais"
          value={data.commercial.conditions || ""}
          onChange={(v) => setCommercial("conditions", v || undefined)}
          placeholder="Ex: Documentação inclusa, sem juros abusivos, financiamento direto com a construtora."
          multiline
        />
      </Section>

      <Section title="Infraestrutura">
        <TagListInput label="O que já está pronto no local" items={data.infrastructure} onChange={(v) => set("infrastructure", v)} placeholder="Ex: Água, energia, asfalto" />
      </Section>

      <Section title="Diferenciais">
        <TagListInput label="Principais diferenciais do empreendimento" items={data.differentials} onChange={(v) => set("differentials", v)} placeholder="Ex: Área verde preservada" />
      </Section>
    </>
  );
}
