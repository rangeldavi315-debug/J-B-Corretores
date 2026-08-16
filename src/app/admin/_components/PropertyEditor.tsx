"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, GripVertical, MapPin, Star, X } from "lucide-react";
import type { Agent, Property } from "@/types/property";
import { STATUS_LABELS } from "@/types/property";
import { slugify } from "@/lib/slugify";
import { isValidGoogleMapsUrl } from "@/lib/propertyPresentation";
import { PropertyLocationSection } from "@/components/property-templates/shared";
import companyData from "../../../../content/company.json";
import { CheckboxField, FieldGrid, labelStyle, NumberField, Section, SelectField, TextField } from "./fields";
import { ImageUploadBtn } from "./shared";
import { ImageSlotField } from "./ImageSlotField";
import { IMAGE_RECOMMENDATIONS } from "./imageRatio";
import { PreviewModal } from "./PreviewModal";
import { LotForm } from "./forms/LotForm";
import { HouseForm } from "./forms/HouseForm";
import { FarmForm } from "./forms/FarmForm";
import { ApartmentForm } from "./forms/ApartmentForm";

const agents = companyData.agents as Agent[];

export function PropertyEditor({
  initial,
  count,
  passcode,
  onSave,
  onCancel,
}: {
  initial: Property;
  count: number;
  passcode: string;
  onSave: (p: Property) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Property>(initial);
  const [showPreview, setShowPreview] = useState(false);
  const [showLocationPreview, setShowLocationPreview] = useState(false);
  const isNew = !initial.id;
  const dragImgIdx = useRef<number | null>(null);

  const setBase = <K extends keyof Property>(field: K, value: Property[K]) => setDraft((prev) => ({ ...prev, [field]: value }));

  const addGalleryImg = (path: string) => {
    if (draft.images.length >= 10) return;
    setBase("images", [...draft.images, path]);
  };

  const removeGalleryImg = (idx: number) => {
    setBase("images", draft.images.filter((_, i) => i !== idx));
  };

  const reorderGalleryImg = (targetIdx: number) => {
    const fromIdx = dragImgIdx.current;
    dragImgIdx.current = null;
    if (fromIdx == null || fromIdx === targetIdx) return;
    const arr = [...draft.images];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(targetIdx, 0, moved);
    setBase("images", arr);
  };

  const setGalleryImageAsCover = (idx: number) => {
    const arr = [...draft.images];
    const newCover = arr[idx];
    arr[idx] = draft.coverImage;
    setDraft((prev) => ({ ...prev, coverImage: newCover, images: arr }));
  };

  const canPreview = !!draft.title.trim() && !!draft.coverImage.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return alert("Informe o título.");
    if (!draft.coverImage.trim()) return alert("Selecione a imagem de capa.");
    if (!draft.city.trim()) return alert("Informe a cidade.");
    if (!draft.description.trim()) return alert("Informe a descrição.");

    const slug = isNew || !draft.slug ? slugify(draft.title) : draft.slug;

    onSave({
      ...draft,
      id: draft.id || String(Date.now()),
      slug,
      order: draft.order || count + 1,
      whatsappAgentId: draft.whatsappAgentId || agents[0].whatsapp,
    });
  };

  return (
    <>
      {showPreview && <PreviewModal property={draft} onClose={() => setShowPreview(false)} />}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        <Section title="Identificação">
          <div style={{ marginBottom: "1rem" }}>
            <TextField label="Título *" value={draft.title} onChange={(v) => setBase("title", v)} placeholder="Ex: Residencial Vista Verde" />
          </div>
          <FieldGrid columns={2}>
            <SelectField
              label="Status"
              value={draft.status}
              onChange={(v) => setBase("status", v as Property["status"])}
              options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            />
            <div>
              <label style={labelStyle}>Destaque</label>
              <div style={{ paddingTop: "0.1rem" }}>
                <CheckboxField label="Imóvel em destaque" checked={draft.featured} onChange={(v) => setBase("featured", v)} />
              </div>
            </div>
          </FieldGrid>
        </Section>

        <Section title="Localização">
          <div style={{ marginBottom: "1rem" }}>
            <FieldGrid columns={3}>
              <TextField label="Cidade *" value={draft.city} onChange={(v) => setBase("city", v)} placeholder="Ex: Goiânia" />
              <TextField label="Estado (UF)" value={draft.state || ""} onChange={(v) => setBase("state", v || undefined)} placeholder="Ex: GO" />
              <TextField label="Bairro / Região" value={draft.neighborhood || ""} onChange={(v) => setBase("neighborhood", v || undefined)} placeholder="Ex: Setor Bueno" />
            </FieldGrid>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <TextField label="Endereço" value={draft.address || ""} onChange={(v) => setBase("address", v || undefined)} placeholder="Ex: Av. T-63, 1000" />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <TextField
              label="Referência (linha de contexto sob o endereço)"
              value={draft.reference || ""}
              onChange={(v) => setBase("reference", v || undefined)}
              placeholder="Ex: Próximo ao Flamboyant / 35 km de Goiânia"
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <TextField
              label="Link do Google Maps (opcional)"
              value={draft.googleMapsUrl || ""}
              onChange={(v) => setBase("googleMapsUrl", v || undefined)}
              placeholder="https://www.google.com/maps/place/..."
            />
            {draft.googleMapsUrl && !isValidGoogleMapsUrl(draft.googleMapsUrl) && (
              <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                Esse link não parece ser do Google Maps — o botão público vai ignorá-lo e usar cidade/endereço em vez dele.
              </p>
            )}
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <FieldGrid columns={2}>
              <NumberField label="Latitude (opcional)" value={draft.latitude} onChange={(v) => setBase("latitude", v)} placeholder="Ex: -16.6799" />
              <NumberField label="Longitude (opcional)" value={draft.longitude} onChange={(v) => setBase("longitude", v)} placeholder="Ex: -49.255" />
            </FieldGrid>
            <p style={{ color: "#666", fontSize: "0.72rem", marginTop: "0.4rem" }}>
              Nenhum campo de localização é obrigatório além da cidade. Quando houver latitude/longitude, elas têm prioridade sobre o endereço.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLocationPreview((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.1rem", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "6px", color: "#D4AF37", cursor: "pointer", fontSize: "0.82rem" }}
          >
            {showLocationPreview ? <EyeOff size={14} /> : <MapPin size={14} />}
            {showLocationPreview ? "Ocultar pré-visualização" : "Pré-visualizar localização"}
          </button>

          {showLocationPreview && (
            <div style={{ marginTop: "1rem", maxWidth: "560px" }}>
              <PropertyLocationSection property={draft} />
            </div>
          )}
        </Section>

        <Section title="Conteúdo">
          <TextField
            label={`Descrição * (${draft.description.length}/600 caracteres)`}
            value={draft.description}
            onChange={(v) => setBase("description", v.slice(0, 600))}
            placeholder="Descreva o imóvel..."
            multiline
          />
        </Section>

        <Section title="Imagens">
          <div style={{ marginBottom: "1.5rem" }}>
            <ImageSlotField
              passcode={passcode}
              value={draft.coverImage}
              onChange={(path) => setBase("coverImage", path)}
              recommendation={IMAGE_RECOMMENDATIONS.heroDesktop}
              helperNote="Usada como capa nos cards da home e como imagem principal do Hero em tablet/desktop."
              positionValue={draft.coverImagePosition || "50% 50%"}
              onPositionChange={(pos) => setBase("coverImagePosition", pos)}
            />
          </div>

          {draft.category === "loteamento" && (
            <div style={{ marginBottom: "1.5rem" }}>
              <ImageSlotField
                passcode={passcode}
                value={draft.heroImageMobile || ""}
                onChange={(path) => setBase("heroImageMobile", path)}
                recommendation={IMAGE_RECOMMENDATIONS.heroMobile}
                optional
                helperNote={
                  draft.heroImageMobile
                    ? undefined
                    : "Recomendação: adicionar uma imagem vertical melhora o resultado no celular. Sem ela, a capa é usada com recorte inteligente."
                }
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>
              Galeria ({draft.images.length}/10) — Recomendado: {IMAGE_RECOMMENDATIONS.gallery.width}×{IMAGE_RECOMMENDATIONS.gallery.height}px (
              {IMAGE_RECOMMENDATIONS.gallery.ratioLabel})
            </label>
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "8px" }}>
              {draft.images.length > 0 && (
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {draft.images.map((img, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={() => (dragImgIdx.current = idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => reorderGalleryImg(idx)}
                      style={{ position: "relative", width: "110px", height: "78px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", cursor: "grab" }}
                    >
                      <Image src={img} alt={`foto ${idx + 1}`} fill style={{ objectFit: "cover" }} />
                      <div style={{ position: "absolute", top: "3px", left: "3px", background: "rgba(0,0,0,0.55)", borderRadius: "4px", padding: "1px 3px", display: "flex", alignItems: "center" }}>
                        <GripVertical size={11} style={{ color: "#ccc" }} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setGalleryImageAsCover(idx)}
                        title="Usar como capa"
                        style={{ position: "absolute", bottom: "3px", left: "3px", background: "rgba(212,175,55,0.9)", border: "none", borderRadius: "4px", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}
                      >
                        <Star size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGalleryImg(idx)}
                        title="Remover"
                        style={{ position: "absolute", top: "3px", right: "3px", background: "rgba(239,68,68,0.9)", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {draft.images.length > 1 && <p style={{ color: "#555", fontSize: "0.68rem", marginBottom: "0.75rem" }}>Arraste para reordenar. ★ define a foto como nova capa.</p>}
              {draft.images.length < 10 ? (
                <ImageUploadBtn passcode={passcode} onUploaded={addGalleryImg} label={`Adicionar foto (${10 - draft.images.length} restantes)`} />
              ) : (
                <p style={{ color: "#888", fontSize: "0.8rem" }}>Limite de 10 imagens atingido.</p>
              )}
            </div>
          </div>
        </Section>

        {draft.category === "loteamento" && <LotForm data={draft.data} onChange={(data) => setDraft({ ...draft, data })} />}
        {draft.category === "casa" && <HouseForm data={draft.data} onChange={(data) => setDraft({ ...draft, data })} />}
        {draft.category === "chacara" && <FarmForm data={draft.data} onChange={(data) => setDraft({ ...draft, data })} />}
        {draft.category === "apartamento" && <ApartmentForm data={draft.data} onChange={(data) => setDraft({ ...draft, data })} />}

        <Section title="Atendimento">
          <FieldGrid columns={2}>
            <SelectField
              label="Corretor Responsável"
              value={draft.whatsappAgentId}
              onChange={(v) => setBase("whatsappAgentId", v)}
              options={agents.map((a) => ({ value: a.whatsapp, label: `${a.name} — ${a.phone}` }))}
            />
            <NumberField label="Ordem de exibição" value={draft.order} onChange={(v) => setBase("order", v ?? count + 1)} placeholder={String(count + 1)} />
          </FieldGrid>
        </Section>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
          <button type="button" onClick={onCancel} style={{ padding: "0.8rem 1.8rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "#ccc", cursor: "pointer", fontSize: "0.9rem" }}>
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canPreview}
            onClick={() => setShowPreview(true)}
            title={canPreview ? "" : "Preencha título e imagem de capa para pré-visualizar"}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.6rem", background: "transparent", border: "1px solid rgba(212,175,55,0.4)", borderRadius: "6px", color: "#D4AF37", cursor: canPreview ? "pointer" : "not-allowed", opacity: canPreview ? 1 : 0.5, fontSize: "0.9rem" }}
          >
            <Eye size={16} /> Pré-visualizar
          </button>
          <button type="submit" style={{ padding: "0.8rem 2rem", background: "#D4AF37", border: "none", borderRadius: "6px", color: "#000", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
            {isNew ? "Criar Cadastro" : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </>
  );
}
