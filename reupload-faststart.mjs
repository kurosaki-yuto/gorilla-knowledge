import { readFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";
import https from "https";

const SB_URL = "https://tkdwqsoyheousodvtmuj.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHdxc295aGVvdXNvZHZ0bXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzkyMDgxNiwiZXhwIjoyMDg5NDk2ODE2fQ.wZH-PrN_-pyjUOhn0s2Q5eUFoeSMhYrTnJlMo6niwdI";
const BUCKET = "course-videos";
const BASE = "/tmp/faststart";

const STAGE_MAP = {
  "01_Stage1_AIを知る": "stage1",
  "02_Stage2_安全に使う": "stage2",
  "03_Stage3_プロンプト": "stage3",
  "04_Stage4_ChatGPT": "stage4-chatgpt",
  "05_Stage4_Claude": "stage4-claude",
  "06_Stage4_Gemini": "stage4-gemini",
  "07_Stage4_Perplexity": "stage4-perplexity",
  "08_Stage5_AI資料作成": "stage5-slides",
  "09_Stage5_AI動画生成": "stage5-video",
  "10_Stage6_戦略・導入": "stage6",
};

function upload(filePath, storageKey) {
  return new Promise((resolve, reject) => {
    const data = readFileSync(filePath);
    const url = new URL(`${SB_URL}/storage/v1/object/${BUCKET}/${storageKey}`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Content-Type": "video/mp4",
        "x-upsert": "true",
        "Content-Length": data.length,
      },
    }, (res) => {
      let body = "";
      res.on("data", (c) => body += c);
      res.on("end", () => resolve(res.statusCode));
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  let ok = 0, fail = 0;
  const dirs = readdirSync(BASE).filter(d => statSync(join(BASE, d)).isDirectory()).sort();

  for (const dir of dirs) {
    const eng = STAGE_MAP[dir] || dir.split("_")[0];
    console.log(`\n=== ${dir} → ${eng}/ ===`);
    const files = readdirSync(join(BASE, dir)).filter(f => f.endsWith(".mp4")).sort();

    for (const fn of files) {
      const fp = join(BASE, dir, fn);
      const num = fn.split("_")[0];
      const key = `${eng}/${num}.mp4`;
      const sz = (statSync(fp).size / 1048576).toFixed(1);
      process.stdout.write(`  ${fn} (${sz}MB) → ${key}... `);
      try {
        const code = await upload(fp, key);
        if (code === 200) { console.log("OK"); ok++; }
        else { console.log(`FAIL(${code})`); fail++; }
      } catch (e) { console.log(`ERR: ${e.message}`); fail++; }
    }
  }
  console.log(`\nDone: ${ok} OK, ${fail} FAIL`);
}

main();
