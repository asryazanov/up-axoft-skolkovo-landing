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

const draftStorageKey = "up-landing-application-draft";
const lastApplicationStorageKey = "up-landing-last-application";

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
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [utm, setUtm] = useState({
    utm_source: null as string | null,
    utm_medium: null as string | null,
    utm_campaign: null as string | null
  });

  useEffect(() => {
    const savedDraft = window.sessionStorage.getItem(draftStorageKey);
    if (savedDraft) {
      try {
        setForm({ ...initialState, ...JSON.parse(savedDraft) });
      } catch {
        window.sessionStorage.removeItem(draftStorageKey);
      }
    }

    const params = new URLSearchParams(window.location.search);
    setUtm({
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign")
    });
  }, []);

  useEffect(() => {
    const hasDraft = Object.entries(form).some(([key, value]) => value !== initialState[key as keyof FormState]);

    if (hasDraft) {
      window.sessionStorage.setItem(draftStorageKey, JSON.stringify(form));
    } else {
      window.sessionStorage.removeItem(draftStorageKey);
    }
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => {
      const nextForm = { ...current, [key]: value };
      if (touched[key] || hasSubmitted) {
        const fieldError = validate(nextForm)[key];
        setErrors((currentErrors) => {
          const nextErrors = { ...currentErrors };
          if (fieldError) {
            nextErrors[key] = fieldError;
          } else {
            delete nextErrors[key];
          }
          return nextErrors;
        });
      }
      return nextForm;
    });
  }

  function markTouched<K extends keyof FormState>(key: K, value?: FormState[K]) {
    const nextForm = value === undefined ? form : { ...form, [key]: value };
    const fieldError = validate(nextForm)[key];

    setTouched((current) => ({ ...current, [key]: true }));
    setErrors((current) => {
      const next = { ...current };
      if (fieldError) {
        next[key] = fieldError;
      } else {
        delete next[key];
      }
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
    setHasSubmitted(true);
    setTouched({
      company: true,
      email: true,
      productLink: true,
      industry: true,
      resident: true,
      consent: true
    });

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setStatus("error");
      return;
    }

    setStatus("submitting");

    window.sessionStorage.setItem(lastApplicationStorageKey, JSON.stringify({ ...normalizedForm, utm }));
    window.sessionStorage.removeItem(draftStorageKey);

    setForm(initialState);
    setErrors({});
    setTouched({});
    setHasSubmitted(false);
    setStatus("idle");
    onSuccess?.();
  }

  return (
    <form className="apply-form" onSubmit={submit} noValidate>
      <div className="form-progress" aria-label="Прогресс заполнения формы">
        <span>Шаг 1 из 1</span>
        <strong>6 полей</strong>
      </div>
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
          onBlur={() => markTouched("company")}
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
          onBlur={() => markTouched("email")}
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
          onBlur={() => {
            const normalized = normalizeUrl(form.productLink);
            update("productLink", normalized);
            markTouched("productLink", normalized);
          }}
        />
        <small className="field-hint" id="product-link-hint">
          Можно вставить сайт, презентацию или карточку продукта без https:// — мы добавим его автоматически.
        </small>
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
          onBlur={() => markTouched("industry")}
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
          onBlur={() => markTouched("resident")}
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
          onChange={(e) => {
            update("consent", e.target.checked);
            markTouched("consent", e.target.checked);
          }}
        />
        <span>
          Согласен с{" "}
          <a href={`${basePath}/privacy/`} target="_blank" rel="noreferrer">
            политикой обработки персональных данных
          </a>
        </span>
        {errors.consent && <small className="field-error" id="consent-error">{errors.consent}</small>}
      </label>

      <div className="form-submit-bar">
        <button className="submit-button" type="submit" disabled={status === "submitting"}>
          <Send size={18} />
          {status === "submitting" ? "Отправляем…" : "Подать заявку"}
        </button>
        <p className="form-hint">Рассматриваем заявки в течение 5 рабочих дней. Результат — на email.</p>

        {status === "error" && !Object.keys(errors).length && (
          <p className="form-error">Не удалось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.</p>
        )}
      </div>
    </form>
  );
}
