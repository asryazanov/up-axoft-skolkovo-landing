"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  industries: string[];
  onSuccess?: () => void;
};

type FormState = {
  company: string;
  email: string;
  productLink: string;
  industry: string;
  resident: "Да" | "Нет" | "В процессе оформления";
  consent: boolean;
};

const initialState: FormState = {
  company: "",
  email: "",
  productLink: "",
  industry: "",
  resident: "Нет",
  consent: false
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function ApplyForm({ industries, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errors, setErrors] = useState<FormErrors>({});
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
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate(currentForm: FormState) {
    const nextErrors: FormErrors = {};

    if (!currentForm.company.trim()) {
      nextErrors.company = "Укажите название компании.";
    }

    if (!currentForm.email.trim()) {
      nextErrors.email = "Укажите рабочий email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email.trim())) {
      nextErrors.email = "Проверьте формат email.";
    }

    const normalizedProductLink = normalizeUrl(currentForm.productLink);
    if (!normalizedProductLink) {
      nextErrors.productLink = "Добавьте ссылку на сайт, продукт или pitch deck.";
    } else {
      try {
        const url = new URL(normalizedProductLink);
        if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
          nextErrors.productLink = "Проверьте формат ссылки.";
        }
      } catch {
        nextErrors.productLink = "Проверьте формат ссылки.";
      }
    }

    if (!currentForm.industry) {
      nextErrors.industry = "Выберите отрасль.";
    }

    if (!currentForm.consent) {
      nextErrors.consent = "Нужно согласие с политикой обработки персональных данных.";
    }

    return nextErrors;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedForm = { ...form, productLink: normalizeUrl(form.productLink) };
    const validationErrors = validate(normalizedForm);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setStatus("error");
      return;
    }

    setStatus("submitting");

    window.sessionStorage.setItem("up-landing-last-application", JSON.stringify({ ...normalizedForm, utm }));

    setForm(initialState);
    setErrors({});
    setStatus("idle");
    onSuccess?.();
  }

  return (
    <form className="apply-form" onSubmit={submit} noValidate>
      <p className="required-note">Все поля обязательны для заполнения.</p>
      <label>
        <span>Название компании <em aria-hidden="true">*</em></span>
        <input
          name="company"
          required
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "company-error" : undefined}
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
        {errors.company && <small className="field-error" id="company-error">{errors.company}</small>}
      </label>

      <label>
        <span>Рабочий email <em aria-hidden="true">*</em></span>
        <input
          required
          name="email"
          type="email"
          inputMode="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        {errors.email && <small className="field-error" id="email-error">{errors.email}</small>}
      </label>

      <label>
        <span>Ссылка на сайт, продуктовую страницу или заполненный pitch deck <em aria-hidden="true">*</em></span>
        <input
          required
          name="productLink"
          type="text"
          inputMode="url"
          placeholder="https://"
          aria-invalid={Boolean(errors.productLink)}
          aria-describedby={errors.productLink ? "product-link-error" : "product-link-hint"}
          value={form.productLink}
          onChange={(e) => update("productLink", e.target.value)}
          onBlur={() => update("productLink", normalizeUrl(form.productLink))}
        />
        <small className="field-hint" id="product-link-hint">Можно вставить адрес без https:// — мы добавим его автоматически.</small>
        {errors.productLink && <small className="field-error" id="product-link-error">{errors.productLink}</small>}
      </label>

      <label>
        <span>Отрасль <em aria-hidden="true">*</em></span>
        <select
          name="industry"
          required
          aria-invalid={Boolean(errors.industry)}
          aria-describedby={errors.industry ? "industry-error" : undefined}
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
        {errors.industry && <small className="field-error" id="industry-error">{errors.industry}</small>}
      </label>

      <label>
        <span>Резидент «Сколково» <em aria-hidden="true">*</em></span>
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
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
        />
        <span>
          Согласен с{" "}
          <a href={`${basePath}/privacy/`} target="_blank" rel="noreferrer">
            политикой обработки персональных данных
          </a>
        </span>
        {errors.consent && <small className="field-error" id="consent-error">{errors.consent}</small>}
      </label>

      <button className="submit-button" type="submit" disabled={status === "submitting"}>
        <Send size={18} />
        {status === "submitting" ? "Отправляем…" : "Подать заявку"}
      </button>
      <p className="form-hint">Рассматриваем заявки в течение 5 рабочих дней. Результат — на email.</p>

      {status === "error" && !Object.keys(errors).length && (
        <p className="form-error">Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.</p>
      )}
    </form>
  );
}
