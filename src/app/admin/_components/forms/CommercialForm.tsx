"use client";

import type { CommercialData } from "@/types/property";
import { CheckboxField, FieldGrid, NumberField, Section, TagListInput, TextField } from "../fields";

export function CommercialForm({ data, onChange }: { data: CommercialData; onChange: (data: CommercialData) => void }) {
  const set = <K extends keyof CommercialData>(field: K, value: CommercialData[K]) => onChange({ ...data, [field]: value });

  return (
    <>
      <Section title="Características">
        <div style={{ marginBottom: "1rem" }}>
          <TextField label="Tipo de imóvel comercial" value={data.businessType || ""} onChange={(v) => set("businessType", v || undefined)} placeholder="Ex: Loja, Sala comercial, Galpão, Prédio comercial" />
        </div>
        <FieldGrid columns={3}>
          <NumberField label="Área (m²)" value={data.area} onChange={(v) => set("area", v)} placeholder="Ex: 120" />
          <NumberField label="Banheiros" value={data.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="Ex: 2" />
          <NumberField label="Vagas de garagem" value={data.garageSpots} onChange={(v) => set("garageSpots", v)} placeholder="Ex: 4" />
          <NumberField label="Andar (se em prédio)" value={data.floor} onChange={(v) => set("floor", v)} placeholder="Ex: 3" />
        </FieldGrid>
      </Section>

      <Section title="Estrutura">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <CheckboxField label="Elevador" checked={!!data.hasElevator} onChange={(v) => set("hasElevator", v)} />
          <CheckboxField label="Segurança 24h" checked={!!data.hasSecurity} onChange={(v) => set("hasSecurity", v)} />
        </div>
      </Section>

      <Section title="Comercial">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={2}>
            <NumberField label="Preço (R$)" value={data.price} onChange={(v) => set("price", v)} placeholder="Ex: 650000" />
            <NumberField label="Condomínio (R$/mês)" value={data.condominiumFee} onChange={(v) => set("condominiumFee", v)} placeholder="Ex: 500" />
          </FieldGrid>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <CheckboxField label={'Valor é "a partir de" (não é preço fechado)'} checked={!!data.priceFrom} onChange={(v) => set("priceFrom", v)} />
        </div>
        <TextField label="Condições" value={data.conditions || ""} onChange={(v) => set("conditions", v || undefined)} placeholder="Ex: Aceita permuta" multiline />
      </Section>

      <Section title="Diferenciais">
        <TagListInput label="Principais diferenciais" items={data.differentials} onChange={(v) => set("differentials", v)} placeholder="Ex: Esquina, alto fluxo de pessoas" />
      </Section>
    </>
  );
}
