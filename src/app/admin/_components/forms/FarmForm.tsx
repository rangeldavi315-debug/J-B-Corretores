"use client";

import type { FarmData } from "@/types/property";
import { CheckboxField, FieldGrid, NumberField, Section, SelectField, TagListInput, TextField } from "../fields";

export function FarmForm({ data, onChange }: { data: FarmData; onChange: (data: FarmData) => void }) {
  const set = <K extends keyof FarmData>(field: K, value: FarmData[K]) => onChange({ ...data, [field]: value });

  return (
    <>
      <Section title="Área">
        <FieldGrid columns={2}>
          <NumberField label="Área total" value={data.totalArea} onChange={(v) => set("totalArea", v)} placeholder="Ex: 5000" />
          <SelectField
            label="Unidade"
            value={data.areaUnit || "m2"}
            onChange={(v) => set("areaUnit", v as FarmData["areaUnit"])}
            options={[
              { value: "m2", label: "m²" },
              { value: "ha", label: "hectares" },
            ]}
          />
        </FieldGrid>
      </Section>

      <Section title="Casa Sede">
        <div style={{ marginBottom: "1rem" }}>
          <CheckboxField label="Possui casa construída" checked={!!data.hasHouse} onChange={(v) => set("hasHouse", v)} />
        </div>
        <FieldGrid columns={3}>
          <NumberField label="Área construída (m²)" value={data.builtArea} onChange={(v) => set("builtArea", v)} placeholder="Ex: 180" />
          <NumberField label="Quartos" value={data.bedrooms} onChange={(v) => set("bedrooms", v)} placeholder="Ex: 3" />
          <NumberField label="Suítes" value={data.suites} onChange={(v) => set("suites", v)} placeholder="Ex: 1" />
          <NumberField label="Banheiros" value={data.bathrooms} onChange={(v) => set("bathrooms", v)} placeholder="Ex: 2" />
          <NumberField label="Vagas de garagem" value={data.garageSpots} onChange={(v) => set("garageSpots", v)} placeholder="Ex: 4" />
        </FieldGrid>
      </Section>

      <Section title="Lazer">
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <CheckboxField label="Piscina" checked={!!data.hasPool} onChange={(v) => set("hasPool", v)} />
          <CheckboxField label="Churrasqueira" checked={!!data.hasBbqArea} onChange={(v) => set("hasBbqArea", v)} />
          <CheckboxField label="Área gourmet" checked={!!data.hasGourmetArea} onChange={(v) => set("hasGourmetArea", v)} />
        </div>
        <TagListInput label="Outras características da propriedade" items={data.propertyFeatures} onChange={(v) => set("propertyFeatures", v)} placeholder="Ex: Lago para pesca, pomar" />
      </Section>

      <Section title="Estrutura">
        <FieldGrid columns={3}>
          <TextField label="Energia" value={data.energyType || ""} onChange={(v) => set("energyType", v || undefined)} placeholder="Ex: Rede pública" />
          <TextField label="Água" value={data.waterSource || ""} onChange={(v) => set("waterSource", v || undefined)} placeholder="Ex: Poço artesiano" />
          <TextField label="Acesso" value={data.access || ""} onChange={(v) => set("access", v || undefined)} placeholder="Ex: Estrada asfaltada" />
        </FieldGrid>
      </Section>

      <Section title="Comercial">
        <div style={{ marginBottom: "1rem" }}>
          <FieldGrid columns={2}>
            <NumberField label="Preço (R$)" value={data.price} onChange={(v) => set("price", v)} placeholder="Ex: 580000" />
            <div />
          </FieldGrid>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <CheckboxField label={'Valor é "a partir de" (não é preço fechado)'} checked={!!data.priceFrom} onChange={(v) => set("priceFrom", v)} />
        </div>
        <TextField label="Condições" value={data.conditions || ""} onChange={(v) => set("conditions", v || undefined)} placeholder="Ex: Aceita permuta" multiline />
      </Section>

      <Section title="Diferenciais">
        <TagListInput label="Principais diferenciais" items={data.differentials} onChange={(v) => set("differentials", v)} placeholder="Ex: Hípica privativa" />
      </Section>
    </>
  );
}
