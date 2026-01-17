import translate from "google-translate-api-x";

export default async function translateToVi(text) {
  const res = await translate(text, { to: "vi" });
  return res.text;
}
