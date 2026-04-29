//日付文字列を YYYY-MM-DD 形式に変換
export function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

//曜日を日本語で返す（例: 月, 火, 水...）
export function getJapaneseDayOfWeek(date = new Date()) {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
}

//ミリ秒から「hh:mm:ss」に変換
export function formatElapsedTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

//評価値（数値）からラベルを返す（例: 3 → 普通）
export function getEvaluationLabel(value) {
  switch (Number(value)) {
    case 1: return "悪い";
    case 2: return "やや悪い";
    case 3: return "普通";
    case 4: return "やや良い";
    case 5: return "良い";
    default: return "未評価";
  }
}
