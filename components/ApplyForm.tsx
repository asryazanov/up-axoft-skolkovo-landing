"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  directions: string[];
  onSuccess?: () => void;
};

type FormState = {
  company: string;
  inn: string;
  email: string;
  direction: string;
  productName: string;
  productLink: string;
  presentationName: string;
  consent: boolean;
  rulesConsent: boolean;
};

const initialState: FormState = {
  company: "",
  inn: "",
  email: "",
  direction: "",
  productName: "",
  productLink: "",
  presentationName: "",
  consent: false,
  rulesConsent: false
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

export function ApplyForm({ directions, onSuccess }: Props) {
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

    const innDigits = currentForm.inn.replace(/\D/g, "");
    if (!innDigits) {
      nextErrors.inn = "Укажите ИНН.";
    } else if (!/^\d{10}(\d{2})?$/.test(innDigits)) {
      nextErrors.inn = "ИНН должен содержать 10 или 12 цифр.";
    }

    if (!currentForm.email.trim()) {
      nextErrors.email = "Укажите рабочий email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentForm.email.trim())) {
      nextErrors.email = "Проверьте формат email.";
    }

    if (!currentForm.direction) {
      nextErrors.direction = "Выберите направление отбора.";
    }

    if (!currentForm.productName.trim()) {
      nextErrors.productName = "Укажите название продукта.";
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

    if (!currentForm.presentationName.trim()) {
      nextErrors.presentationName = "Добавьте презентацию продукта.";
    }

    if (!currentForm.consent) {
      nextErrors.consent = "Нужно согласие с политикой обработки персональных данных.";
    }

    if (!currentForm.rulesConsent) {
      nextErrors.rulesConsent = "Нужно согласие с правилами программы.";
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
      inn: true,
      email: true,
      direction: true,
      productName: true,
      productLink: true,
      presentationName: true,
      consent: true,
      rulesConsent: true
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
        <strong>9 полей</strong>
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
        <span>ИНН <em aria-hidden="true">*</em></span>
        <input
          name="inn"
          required
          inputMode="numeric"
          placeholder="10 или 12 цифр"
          aria-invalid={Boolean(errors.inn)}
          aria-describedby={errors.inn ? "inn-error" : "inn-hint"}
          value={form.inn}
          onChange={(e) => update("inn", e.target.value.replace(/\D/g, ""))}
          onBlur={() => markTouched("inn")}
        />
        <small className="field-hint" id="inn-hint">
          Автозаполнение по данным ЕГРЮЛ будет подключено позже.
        </small>
        {errors.inn && <small className="field-error" id="inn-error">{errors.inn}</small>}
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
        <span>Направление отбора <em aria-hidden="true">*</em></span>
        <select
          name="direction"
          required
          aria-invalid={Boolean(errors.direction)}
          aria-describedby={errors.direction ? "direction-error" : undefined}
          value={form.direction}
          onChange={(e) => update("direction", e.target.value)}
          onBlur={() => markTouched("direction")}
        >
          <option value="">Выберите направление</option>
          {directions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
        {errors.direction && <small className="field-error" id="direction-error">{errors.direction}</small>}
      </label>

      <label>
        <span>Название продукта <em aria-hidden="true">*</em></span>
        <input
          name="productName"
          required
          aria-invalid={Boolean(errors.productName)}
          aria-describedby={errors.productName ? "product-name-error" : undefined}
          value={form.productName}
          onChange={(e) => update("productName", e.target.value)}
          onBlur={() => markTouched("productName")}
        />
        {errors.productName && <small className="field-error" id="product-name-error">{errors.productName}</small>}
      </label>

      <label>
        <span>Ссылка на сайт или продуктовую страницу <em aria-hidden="true">*</em></span>
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
          Можно вставить ссылку без https:// — мы добавим его автоматически.
        </small>
        {errors.productLink && <small className="field-error" id="product-link-error">{errors.productLink}</small>}
      </label>

      <label>
        <span>Презентация продукта <em aria-hidden="true">*</em></span>
        <input
          name="presentation"
          type="file"
          required
          accept=".pdf,.ppt,.pptx"
          aria-invalid={Boolean(errors.presentationName)}
          aria-describedby={errors.presentationName ? "presentation-error" : "presentation-hint"}
          onChange={(e) => {
            const fileName = e.target.files?.[0]?.name ?? "";
            update("presentationName", fileName);
            markTouched("presentationName", fileName);
          }}
        />
        <small className="field-hint" id="presentation-hint">
          Пока файл сохраняется только в демо-форме. Реальная загрузка подключается вместе с backend или form-сервисом.
          {form.presentationName ? ` Выбран файл: ${form.presentationName}` : ""}
        </small>
        {errors.presentationName && (
          <small className="field-error" id="presentation-error">{errors.presentationName}</small>
        )}
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

      <label className="checkbox">
        <input
          required
          name="rulesConsent"
          type="checkbox"
          aria-invalid={Boolean(errors.rulesConsent)}
          aria-describedby={errors.rulesConsent ? "rules-consent-error" : undefined}
          checked={form.rulesConsent}
          onChange={(e) => {
            update("rulesConsent", e.target.checked);
            markTouched("rulesConsent", e.target.checked);
          }}
        />
        <span>Согласен с правилами программы из положения об акселерационной программе</span>
        {errors.rulesConsent && (
          <small className="field-error" id="rules-consent-error">{errors.rulesConsent}</small>
        )}
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
