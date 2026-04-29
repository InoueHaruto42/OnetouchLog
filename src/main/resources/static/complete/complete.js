// complete.js
import { completeWorkRecord } from "../common/api.js";
import { formatElapsedTime } from "../common/utils.js";

window.addEventListener("DOMContentLoaded", () => {
  // サイドバー読み込み
  fetch("/common/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
    })
    .catch(err => console.error("サイドバー読み込み失敗:", err));

  // タスク一覧取得と name→id マップ作成
  const nameToIdMap = new Map();
  fetch("http://localhost:8080/record/tasks")
    .then(res => res.json())
    .then(taskList => {
      const datalist = document.getElementById("taskOptions");
      taskList.forEach(task => {
        if (task.name === "未設定") return;

        const option = document.createElement("option");
        option.value = task.name;
        datalist.appendChild(option);
        nameToIdMap.set(task.name, task.id);
      });
    })
    .catch(err => {
      console.error("タスクリストの取得に失敗:", err);
    });

  // 開始・終了時刻の表示
  const startTimeStr = localStorage.getItem("startTime");
  const totalMs = localStorage.getItem("totalMs");
  const start = startTimeStr ? new Date(startTimeStr) : null;
  const end = new Date();

  if (start) {
    document.getElementById("start-time").textContent = start.toTimeString().slice(0, 5);
  }
  document.getElementById("end-time").textContent = end.toTimeString().slice(0, 5);

  if (totalMs) {
    document.getElementById("duration").textContent = formatElapsedTime(Number(totalMs));
  }

  // 保存済みメモがあれば復元
  const savedMemo = localStorage.getItem("memo");
  if (savedMemo) {
    document.getElementById("memo").value = savedMemo;
  }

  // フォーム送信処理
  const form = document.getElementById("complete-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recordId = Number(localStorage.getItem("recordId"));
    if (!recordId) {
      alert("開始記録が見つかりません。");
      return;
    }

    const taskNameValue = document.getElementById("taskName").value.trim();
    const resolvedTaskName = taskNameValue === "" ? "未設定" : taskNameValue;

    const memoValue = document.getElementById("memo").value.trim();
    const evaluationRaw = document.getElementById("evaluation").value;

    const payload = {
      id: recordId,
      endTime: end.toISOString(),
      duration: Math.floor(Number(localStorage.getItem("totalMs")) / 1000),
      breakDuration: Math.floor(Number(localStorage.getItem("breakMs")) / 1000),
      memo: memoValue,
      taskName: resolvedTaskName
    };

    // 評価（空でなければNumber型で追加）
    if (evaluationRaw !== "") {
      payload.evaluation = Number(evaluationRaw);
    }

    // taskId または taskName をセット
    if (nameToIdMap.has(resolvedTaskName)) {
      payload.taskId = nameToIdMap.get(resolvedTaskName);
    } else {
      payload.taskName = resolvedTaskName;
    }

    console.log("送信ペイロード:", payload);

    try {
      await completeWorkRecord(payload);
      alert("作業記録を保存しました！");
      localStorage.clear();
      window.location.href = "/index.html";
    } catch (err) {
      console.error("保存エラー:", err);
      alert("保存に失敗しました：" + err.message);
    }
  });
});
