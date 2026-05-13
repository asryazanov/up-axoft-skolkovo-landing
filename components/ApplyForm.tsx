"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  industries: string[];
};

type FormState = {
  company: string;
  email: string;
  industry: string;
  resident: "Да" | "Нет" | "В процессе оформления";
  consent: boolean;
};

const initialState: FormState = {
  company: "",
  email: "",
  industry: "",
  resident: "Нет",
  consent: false
};

export function ApplyForm({ industries }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [utm, setUtm] = useState({
    utm_source: null as string | null,
    utm_medium: null as string | null,
    utm_campaign: null as string | null
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign")
    });
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    window.sessionStorage.setItem("up-landing-last-application", JSON.stringify({ ...form, utm }));

    router.push("/thanks");
  }

  return (
    <form className="apply-form" onSubmit={submit}>
      <label>
        <span>Название компании</span>
        <input
          name="company"
          required
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </label>

      <label>
        <span>Рабочий email</span>
        <input
          required
          name="email"
          type="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </label>

      <label>
        <span>Отрасль</span>
        <select
          name="industry"
          required
          value={form.industry}
          onChange={(e) => update("industry", e.target.value)}
        >
          <option value="">Выберите отрасль</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Резидент «Сколково»</span>
        <select
          name="resident"
          value={form.resident}
          onChange={(e) => update("resident", e.target.value as FormState["resident"])}
        >
          <option>Да</option>
          <option>Нет</option>
          <option>В процессе оформления</option>
        </select>
      </label>

      <label className="checkbox">
        <input
          required
          name="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
        />
        <span>
          Согласен с{" "}
          <a href={`${basePath}/privacy/`} target="_blank" rel="noreferrer">
            политикой обработки персональных данных
          </a>
        </span>
      </label>

      <button className="submit-button" type="submit" disabled={status === "submitting"}>
        <Send size={18} />
        {status === "submitting" ? "Отправляем…" : "Подать заявку"}
      </button>
      <p className="form-hint">Рассматриваем заявки в течение 5 рабочих дней. Результат — на email.</p>

      {status === "error" && (
        <p className="form-error">Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.</p>
      )}
    </form>
  );
}
