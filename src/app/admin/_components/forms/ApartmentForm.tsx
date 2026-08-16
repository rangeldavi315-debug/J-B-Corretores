"use client";

import type { ApartmentData } from "@/types/property";
import { CheckboxField, FieldGrid, NumberField, Section, TagListInput, TextField } from "../fields";

export function ApartmentForm({ data, onChange }: { data: ApartmentData; onChange: (data: ApartmentData) => void }) {
  const set = <K extends keyof ApartmentData>(field: K, value: ApartmentData[K]) => onChange({ ...data, [field]: value });

  return (
    <>
      <Section title="Características">
        <FieldGrid columns={3}>
          <NumberField label="Área privativa (m²)" value={data.area} onChange={(v) => set("area", v)} placeholder="Ex: 85" />
          <NumberField label="Quartos" value={data.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="Ex: 3" />
          <NumberField label="Suítes" value={data.suites} onChange={(v) => set("suites", v)} placeholder="Ex: 1" />
          <NumberField label="Banheiros" value={data.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="Ex: 2" />
          <NumberField label="Vagas de garagem" value={data.garageSpots} onChange={(v) => set("garageSpots", v)} placeholder="Ex: 2" />
          <NumberField label="Andar" value={data.floor} onChange={(v) => set("floor", v)} placeholder="Ex: 12" />
        </FieldGrid>
      </Section>

      <Section title="Estrutura do Condomínio">
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <CheckboxField label="Elevador" checked={!!data.hasElevator} onChange={(v) => set("hasElevator", v)} />
          <CheckboxField label="Piscina" checked={!!data.hasPool} onChange={(v) => set("hasPool", v)} />
          <CheckboxField label="Academia" checked={!!data.hasGym} onChange={(v) => set("hasGym", v)} />
          <CheckboxField label="Salão de festas" checked={!!data.hasPartyRoom} onChange={(v) => set("hasPartyRoom", v)} />
          <CheckboxField label="Portaria" checked={!!data.hasPortaria} onChange={(v) => set("hasPortaria", v)} />
          <CheckboxField label="Segurança 24h" checked={!!data.hasSecurity} onChange={(v) => set("hasSecurity", v)} />
        </div>
      </Section>

      <Section title="Comercial">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={2}>
            <NumberField label="Preço (R$)" value={data.price} onChange={(v) => set("price", v)} placeholder="Ex: 850000" />
            <NumberField label="Condomínio (R$/mês)" value={data.condominiumFee} onChange={(v) => set("condominiumFee", v)} placeholder="Ex: 900" />
          </FieldGrid>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <CheckboxField label={'Valor é "a partir de" (não é preço fechado)'} checked={!!data.priceFrom} onChange={(v) => set("priceFrom", v)} />
        </div>
        <TextField label="Condições" value={data.conditions || ""} onChange={(v) => set("conditions", v || undefined)} placeholder="Ex: Aceita financiamento" multiline />
      </Section>

      <Section title="Diferenciais">
        <TagListInput label="Principais diferenciais" items={data.differentials} onChange={(v) => set("differentials", v)} placeholder="Ex: Vista panorâmica" />
      </Section>
    </>
  );
}
