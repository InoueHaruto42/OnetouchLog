// index.js

window.addEventListener("DOMContentLoaded", () => {
  // サイドバー読み込み
  fetch("common/sidebar.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("sidebar-container").innerHTML = html;
    })
    .catch(err => console.error("サイドバー読み込み失敗:", err));

  const startBtn = document.getElementById("start-btn");

  if (!startBtn) {
    console.warn("start-btn が見つかりませんでした");
    return;
  }

  startBtn.addEventListener("click", async () => {
    // 前回の一部データをクリア
    localStorage.removeItem("startTime");
    localStorage.removeItem("totalMs");
    localStorage.removeItem("memo");

    try {
      const response = await fetch("/record/start", {
        method: "POST"
      });

      if (!response.ok) {
        const msg = await response.text();

        if (msg.includes("すでに作業中です")) {
          alert("すでに作業中の記録があります。続きから開始します。");
          window.location.href = "record/record.html";
          return;
        }

        throw new Error(msg);
      }

      const data = await response.json();
      console.log("サーバーから受け取ったレスポンス:", data);

      if (!data.startTime) {
        throw new Error("サーバーから開始時刻が受け取れませんでした。");
      }

      // 必要な情報を保存
      localStorage.setItem("recordId", data.id);
      localStorage.setItem("startTime", data.startTime);  // ISO形式そのまま

      // 作業中画面へ遷移
      window.location.href = "record/record.html";
    } catch (err) {
      alert("作業開始に失敗しました: " + err.message);
      console.error("作業開始失敗:", err);
    }
  });
});
