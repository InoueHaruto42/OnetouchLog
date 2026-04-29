//作業記録の開始
export async function startWorkRecord() {
  const res = await fetch("/record/start", {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error("作業記録の開始に失敗しました");
  }

  return await res.json();
}

//作業記録の完了
export async function completeWorkRecord(data) {
  const res = await fetch("/record/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error("作業記録の完了に失敗しました");
  }

  return await res.text();
}