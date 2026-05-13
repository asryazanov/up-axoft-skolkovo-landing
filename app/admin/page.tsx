"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteContent } from "@/data/site";
import { STORAGE_KEY } from "@/lib/useEditableContent";

export default function AdminPage() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Локальная админка: изменения сохраняются в этом браузере.");

  useEffect(() => {
    setValue(window.localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(siteContent, null, 2));
  }, []);

  function save() {
    try {
      JSON.parse(value);
      window.localStorage.setItem(STORAGE_KEY, value);
      setMessage("Сохранено. Вернитесь на лендинг и обновите страницу.");
    } catch {
      setMessage("JSON не сохранён: проверьте синтаксис.");
    }
  }

  function reset() {
    const nextValue = JSON.stringify(siteContent, null, 2);
    window.localStorage.removeItem(STORAGE_KEY);
    setValue(nextValue);
    setMessage("Контент сброшен к версии из кода.");
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-top">
          <div>
            <p className="eyebrow">Простая админка</p>
            <h1>Редактирование JSON-контента</h1>
          </div>
          <Link className="secondary-link" href="/">На лендинг</Link>
        </div>
        <p>{message}</p>
        <textarea value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} />
        <div className="admin-actions">
          <button className="primary-link" onClick={save}>Сохранить</button>
          <button className="secondary-link" onClick={reset}>Сбросить</button>
        </div>
      </section>
    </main>
  );
}
