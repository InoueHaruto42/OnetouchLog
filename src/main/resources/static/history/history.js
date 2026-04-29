function formatTimeToMinute(time) {
  if (!time) return "";
  return time.slice(0, 5);
}

function formatSeconds(seconds) {
  if (seconds == null) return "";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}時間${m}分${s}秒`;
  } else if (m > 0) {
    return `${m}分${s}秒`;
  }
  return `${s}秒`;
}
window.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("record-list");

  try {
    const response = await fetch("/record/records");
    const records = await response.json();

    records.forEach(record => {
      const tr = document.createElement("tr");

      const taskName = record.task ? record.task.name : "未設定";

      tr.innerHTML = `
        <td><button class="delete-button" data-id="${record.id}">削除</button></td>
        <td>${record.date ?? ""}</td>
        <td>${taskName}</td>
        <td>${formatTimeToMinute(record.startTime)}</td>
        <td>${formatTimeToMinute(record.endTime)}</td>
        <td>${formatSeconds(record.duration)}</td>
        <td>${formatSeconds(record.breakDuration ?? 0)}</td>
        <td>${record.memo ?? ""}</td>
        <td>${record.evaluation ?? ""}</td>
      `;

      tbody.appendChild(tr);
    });

    document.querySelectorAll(".delete-button").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;

        if (!confirm("この記録を削除しますか？")) {
          return;
        }

        try {
          const response = await fetch(`/record/records/${id}`, {
            method: "DELETE"
          });

          if (!response.ok) {
            throw new Error("削除に失敗しました");
          }

          button.closest("tr").remove();

        } catch (error) {
          console.error("削除エラー:", error);
          alert("削除に失敗しました");
        }
      });
    });

  } catch (error) {
    console.error("作業記録の取得に失敗しました", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7">作業記録の取得に失敗しました</td>
      </tr>
    `;
  }
});