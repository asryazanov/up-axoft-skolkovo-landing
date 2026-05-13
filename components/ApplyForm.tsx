"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type Props = {
  industries: string[];
};

type FormState = {
  type: "startup" | "vendor";
  company: string;
  name: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  resident: "Да" | "Нет" | "В процессе оформления";
  consent: boolean;
};

const initialState: FormState = {
  type: "startup",
  company: "",
  name: "",
  email: "",
  phone: "",
  industry: "",
  description: "",
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

    window.sessionStorage.setItem(
      "up-landing-last-application",
      JSON.stringify({ ...form, utm, captchaProvider: "Yandex SmartCaptcha placeholder" })
    );

    router.push("/thanks");
  }

  return (
    <form className="apply-form" onSubmit={submit}>
      <div className="segmented" aria-label="Тип участника">
        <button
          type="button"
          className={form.type === "startup" ? "active" : ""}
          onClick={() => update("type", "startup")}
        >
          Стартап
        </button>
        <button
          type="button"
          className={form.type === "vendor" ? "active" : ""}
          onClick={() => update("type", "vendor")}
        >
          Вендор
        </button>
      </div>

      <label>
        <span>Название компании</span>
        <input name="company" required value={form.company} onChange={(event) => update("company", event.target.value)} />
      </label>

      <label>
        <span>Контактное лицо</span>
        <input name="contactName" required value={form.name} onChange={(event) => update("name", event.target.value)} />
      </label>

      <div className="form-grid">
        <label>
          <span>Email</span>
          <input
            required
            name="email"
            type="text"
            inputMode="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </label>
        <label>
          <span>Телефон</span>
          <input
            required
            name="phone"
            type="text"
            inputMode="tel"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </label>
      </div>

      <label>
        <span>Отрасль</span>
        <select name="industry" required value={form.industry} onChange={(event) => update("industry", event.target.value)}>
          <option value="">Выберите отрасль</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Краткое описание продукта / решения</span>
        <textarea
          name="description"
          required
          maxLength={500}
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>

      <label>
        <span>Резидент «Сколково»</span>
        <select name="resident" value={form.resident} onChange={(event) => update("resident", event.target.value as FormState["resident"])}>
          <option>Да</option>
          <option>Нет</option>
          <option>В процессе оформления</option>
        </select>
      </label>

      <div className="captcha-placeholder">
        Yandex SmartCaptcha будет подключена через sitekey и server key перед запуском.
      </div>

      <label className="checkbox">
        <input
          required
          name="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
        />
        <span>Согласен с политикой обработки персональных данных</span>
      </label>

      <button className="submit-button" type="submit" disabled={status === "submitting"}>
        <Send size={18} />
        {status === "submitting" ? "Отправляем" : "Подать заявку"}
      </button>

      {status === "error" ? <p className="form-error">Не удалось отправить заявку. Проверьте локальный сервер.</p> : null}
    </form>
  );
}
