export default function normalizePollinationsText(rawText) {
  // 1. Thử parse JSON
  try {
    const parsed = JSON.parse(rawText);

    // Nếu có content kiểu OpenAI
    if (parsed?.content) {
      return parsed.content;
    }

    // Nếu có message.content
    if (parsed?.message?.content) {
      return parsed.message.content;
    }

    if (parsed?.reasoning_content) return parsed.reasoning_content;
  } catch (e) {
    // Không phải JSON → bỏ qua
  }

   if (!rawText) return "";

  return rawText
    // bỏ mấy dòng hệ thống
    .replace(/^I ready\.\s*/i, "")
    .replace(/^AI:\s*thinking\.\.\.\s*/i, "")
    .trim();
}
