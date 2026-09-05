/**
 * JSON.stringify não escapa "</script>" — se um título/descrição cadastrado
 * contivesse esse literal, ele fecharia a tag <script> e injetaria HTML.
 * Escapar "<" para "<" neutraliza isso sem quebrar o JSON-LD.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
