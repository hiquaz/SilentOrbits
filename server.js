import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import normalizePollinationsText from "./helper.js";
import translateToVi from "./translateToVNese.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// API chat
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body?.messages?.find(
      (m) => m.role === "user"
    )?.content;

    if (!userMessage) {
      return res.json({
        choices: [
          {
            message: {
              content: "⚠️ Không nhận được câu hỏi.",
            },
          },
        ],
      });
    }

    // Gọi Pollinations anonymous
    const url = `https://text.pollinations.ai/${encodeURIComponent(
      userMessage
    )}`;

    const response = await fetch(url);
    const rawText = await response.text();
    const clearContent = normalizePollinationsText(rawText);

    // Chuẩn hoá response giống OpenAI
    res.json({
      choices: [
        {
          message: {
            content: clearContent,
          },
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res.json({
      choices: [
        {
          message: {
            content: "❌ AI hiện không phản hồi, vui lòng thử lại.",
          },
        },
      ],
    });
  }
});

// Test server
app.get("/", (req, res) => {
  res.send("🚀 Express AI server is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// detect English
function isEnglish(text) {
  // nếu có nhiều ký tự a-z và ít dấu tiếng Việt
  const viChars = /[àáạảãâăèéẹẻẽêìíịỉĩòóọỏõôơùúụủũưỳýỵỷỹđ]/i;
  return !viChars.test(text);
}
