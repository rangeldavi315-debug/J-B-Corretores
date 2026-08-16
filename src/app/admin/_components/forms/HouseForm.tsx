"use client";

import type { HouseData } from "@/types/property";
import { CheckboxField, FieldGrid, NumberField, Section, TagListInput, TextField } from "../fields";

export function HouseForm({ data, onChange }: { data: HouseData; onChange: (data: HouseData) => void }) {
  const set = <K extends keyof HouseData>(field: K, value: HouseData[K]) => onChange({ ...data, [field]: value });

  return (
    <>
      <Section title="Características">
        <FieldGrid columns={3}>
          <NumberField label="Área construída (m²)" value={data.builtArea} onChange={(v) => set("builtArea", v)} placeholder="Ex: 68" />
          <NumberField label="Área do lote (m²)" value={data.lotArea} onChange={(v) => set("lotArea", v)} placeholder="Ex: 360" />
          <NumberField label="Salas" value={data.livingRooms} onChange={(v) => set("livingRooms", v)} placeholder="Ex: 2" />
          <NumberField label="Quartos" value={data.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="Ex: 3" />
          <NumberField label="Suítes" value={data.suites} onChange={(v) => set("suites", v)} placeholder="Ex: 1" />
          <NumberField label="Banheiros" value={data.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="Ex: 2" />
          <NumberField label="Vagas de garagem" value={data.garageSpots} onChange={(v) => set("garageSpots", v)} placeholder="Ex: 2" />
        </FieldGrid>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <CheckboxField label="Cozinha equipada" checked={!!data.hasKitchen} onChange={(v) => set("hasKitchen", v)} />
          <CheckboxField label="Área de serviço" checked={!!data.hasLaundry} onChange={(v) => set("hasLaundry", v)} />
        </div>
      </Section>

      <Section title="Lazer">
        <TagListInput label="Itens de lazer" items={data.leisure} onChange={(v) => set("leisure", v)} placeholder="Ex: Piscina, churrasqueira, área gourmet" />
      </Section>

      <Section title="Comercial">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={3}>
            <NumberField label="Preço (R$)" value={data.price} onChange={(v) => set("price", v)} placeholder="Ex: 480000" />
            <NumberField label="Condomínio (R$/mês)" value={data.condominiumFee} onChange={(v) => set("condominiumFee", v)} placeholder="Ex: 350" />
            <NumberField label="IPTU (R$/ano)" value={data.iptu} onChange={(v) => set("iptu", v)} placeholder="Ex: 1200" />
          </FieldGrid>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <CheckboxField label={'Valor é "a partir de" (não é preço fechado)'} checked={!!data.priceFrom} onChange={(v) => set("priceFrom", v)} />
        </div>
        <TextField label="Condições" value={data.conditions || ""} onChange={(v) => set("conditions", v || undefined)} placeholder="Ex: Aceita financiamento e permuta" multiline />
      </Section>

      <Section title="Diferenciais">
        <TagListInput label="Principais diferenciais" items={data.differentials} onChange={(v) => set("differentials", v)} placeholder="Ex: Documentação regularizada" />
      </Section>
    </>
  );
}
