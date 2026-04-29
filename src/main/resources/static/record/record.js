import { formatElapsedTime } from "../common/utils.js";

let timerInterval;
let startTime, breakStartTime;
let totalBreakTime = 0;
let isOnBreak = false;
let workRecordId = null;

window.addEventListener("DOMContentLoaded", async () => {
  // サイドバー読み込み
  fetch("/common/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
    });

  try {
    workRecordId = localStorage.getItem("recordId");
    const startTimeStr = localStorage.getItem("startTime");

    if (!workRecordId || !startTimeStr) {
      throw new Error("作業記録が見つかりません。最初からやり直してください。");
    }

    //ISO形式の文字列をDateに変換
    startTime = new Date(startTimeStr);

    if (isNaN(startTime.getTime())) {
      throw new Error("開始時刻の形式が不正です。");
    }

    console.log("取得された startTimeStr:", startTimeStr);
    console.log("Date変換結果:", startTime);

    timerInterval = setInterval(updateElapsedTime, 1000);
  } catch (error) {
    alert("記録開始に失敗しました: " + error.message);
    window.location.href = "/index.html";
  }

  document.getElementById("break-button").addEventListener("click", toggleBreak);
  document.getElementById("end-button").addEventListener("click", endSession);
});

function updateElapsedTime() {
  if (isOnBreak) return;
  const now = new Date();
  const elapsedMs = now - startTime - totalBreakTime;
  document.getElementById("elapsed-time").textContent = formatElapsedTime(elapsedMs);
}

function toggleBreak() {
  const button = document.getElementById("break-button");
  const now = new Date();

  if (!isOnBreak) {
    isOnBreak = true;
    breakStartTime = now;
    button.textContent = "再開";
  } else {
    isOnBreak = false;
    totalBreakTime += now - breakStartTime;
    breakStartTime = null;
    button.textContent = "休憩";
  }
}

async function endSession() {
  const now = new Date();
  const memo = document.getElementById("memo").value;

  if (isOnBreak && breakStartTime) {
    totalBreakTime += now - breakStartTime;
    isOnBreak = false;
    breakStartTime = null;
  }

  // 休憩時間を除いた作業時間
  const totalMs = now - startTime - totalBreakTime;

  localStorage.setItem("memo", memo);
  localStorage.setItem("totalMs", totalMs.toString());
  localStorage.setItem("breakMs", totalBreakTime.toString());

  await new Promise(resolve => setTimeout(resolve, 50));
  window.location.href = "/complete/complete.html";
}