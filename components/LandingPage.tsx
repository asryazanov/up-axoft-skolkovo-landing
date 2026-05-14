"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, FileText, Sparkles, X } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { useEditableContent } from "@/lib/useEditableContent";
import { siteContent } from "@/data/site";

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const evaluators = [
  {
    role: "Экспертная комиссия Axoft",
    description: "Оценивает рыночный потенциал продукта и готовность к дистрибуции через партнёрский канал."
  },
  {
    role: "Технологические эксперты «Сколково»",
    description: "Оценивают зрелость продукта, инновационность решения и соответствие технологическим трендам."
  },
  {
    role: "Отраслевые менторы",
    description: "Практики с опытом внедрения и продаж в целевых отраслях — промышленность, финансы, ИТ."
  }
];

const steps = [
  ["Заявка", "Короткая форма фиксирует направление, статус резидентства и базовую информацию о компании."],
  ["Формальный отбор", "Проверяем полноту заявки, соответствие направлениям программы и права на разработку."],
  ["Экспертная оценка", "Смотрим зрелость продукта, B2B-потенциал и готовность к работе с партнёрским каналом."],
  ["Сопровождение по треку", "Экспертиза продукта, упаковка решения, подготовка партнёрских и маркетинговых материалов."],
  ["Demo Day", "Финалисты представляют решения индустриальным заказчикам и партнёрам Axoft в формате живых презентаций."]
];

const programResults = [
  ["Деньги", "Маршрут к грантам, пилотам и коммерческим возможностям там, где продукт уже готов к рынку."],
  ["Экспертиза", "Разбор продукта, позиционирования, зрелости и готовности к корпоративным внедрениям."],
  ["Партнёры", "Понимание, как продукт может попасть в канал продаж и стать понятным партнёрам Axoft."],
  ["Скорость", "Фокус на действиях после отбора: быстрее проверить гипотезы, упаковку и путь к заказчикам."]
];

export function LandingPage() {
  const content = useEditableContent();
  const axoft = content.axoft ?? siteContent.axoft;
  const criteria = content.criteria ?? siteContent.criteria;
  const documents = content.documents ?? siteContent.documents;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function openForm() {
    setIsFormOpen(true);
    setShowSuccess(false);
  }

  function completeForm() {
    setIsFormOpen(false);
    setShowSuccess(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand-pair" href="#top" aria-label="UP Axoft Сколково">
          <Image src={`${assetBasePath}/logos/skolkovo.png`} alt="Сколково" width={146} height={41} priority />
          <span className="brand-divider" />
          <Image src={`${assetBasePath}/logos/axoft.png`} alt="Axoft" width={125} height={40} priority />
        </a>
        <nav>
          <a href="#program">Программа</a>
          <a href="#directions">Направления</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button className="header-cta" type="button" onClick={openForm}>Подать заявку</button>
      </header>

      {showSuccess && (
        <div className="toast" role="status">
          Заявка сохранена. Мы свяжемся с вами после первичной проверки.
        </div>
      )}

      <section className="first-screen" id="top">
        <div className="program-panel" id="program">
          <p className="eyebrow">О программе</p>
          <p className="hero-notice">Первый цикл — II квартал 2026 г.</p>
          <h1>UP помогает технологическим продуктам быстрее выйти к корпоративному рынку</h1>
          <p>
            Это программа для команд, которым важно не просто выступить на питче, а получить понятный путь к деньгам,
            экспертизе, партнёрам и первым рыночным проверкам вместе с Axoft и экосистемой «Сколково».
          </p>
          <div className="result-grid">
            {programResults.map(([title, text]) => (
              <article key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
          <button className="primary-link" type="button" onClick={openForm}>
            Подать заявку <ArrowRight size={18} />
          </button>
        </div>

        <aside className="partner-panel" aria-label="Партнёр Axoft">
          <p className="eyebrow">{axoft.kicker}</p>
          <h2>{axoft.title}</h2>
          <p>{axoft.lead}</p>
          <div className="partner-stats">
            {axoft.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="selection-screen" id="directions">
        <div className="section-heading">
          <p className="eyebrow">Отбор</p>
          <h2>Направления отбора и базовые критерии</h2>
        </div>

        <div className="direction-grid expanded">
          {content.directions.map((direction) => (
            <article key={direction.name}>
              <Sparkles size={21} />
              <h3>{direction.name}</h3>
              <p>{direction.detail}</p>
              {direction.examples?.length ? (
                <div className="example-tags">
                  {direction.examples.map((example) => (
                    <span key={example}>{example}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div className="criteria-panel">
          <div>
            <p className="eyebrow">Критерии отбора</p>
            <h3>Обязательные</h3>
            <ul>
              {criteria.required.map((item) => (
                <li key={item}><CheckCircle2 size={18} />{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Желательные</p>
            <h3>Повышают релевантность заявки</h3>
            <ul>
              {criteria.preferred.map((item) => (
                <li key={item}><CheckCircle2 size={18} />{item}</li>
              ))}
            </ul>
          </div>
          <p>{criteria.note}</p>
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <p className="eyebrow">Структура и сроки</p>
          <h2>От заявки до Demo Day — пять этапов</h2>
          <p>Точный календарь будет опубликован позднее. Первый цикл программы запланирован на II квартал 2026 года.</p>
        </div>
        {steps.map(([title, text], index) => (
          <article className={index === steps.length - 1 ? "process-final" : undefined} key={title}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section people">
        <div className="section-heading">
          <p className="eyebrow">Оценка заявок</p>
          <h2>Кто смотрит проекты</h2>
          <p>
            Заявки проходят формальный отбор и экспертную оценку. Решения смотрят специалисты Axoft,
            технологические эксперты «Сколково» и отраслевые менторы.
          </p>
        </div>
        <div className="people-grid compact">
          {evaluators.map((evaluator) => (
            <article key={evaluator.role}>
              <h3>{evaluator.role}</h3>
              <p>{evaluator.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ и документы</p>
          <h2>Ответы на частые вопросы</h2>
        </div>
        <div className="faq-layout">
          <div className="faq-list">
            {content.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          {documents.length ? (
            <div className="document-list">
              <h3>Документы</h3>
              {documents.map((document) => {
                const href = document.href.startsWith("/") ? `${assetBasePath}${document.href}` : document.href;
                return (
                  <a key={document.name} href={href}>
                    <FileText size={18} />
                    {document.name}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <button className="primary-link" type="button" onClick={openForm}>
          Подать заявку <ArrowRight size={18} />
        </button>
      </section>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsFormOpen(false)}>
          <div
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setIsFormOpen(false)} aria-label="Закрыть форму">
              <X size={20} />
            </button>
            <div className="modal-copy">
              <p className="eyebrow">Форма заявки</p>
              <h2 id="application-title">Подайте заявку — это займёт 3 минуты</h2>
              <p>Мы проверим соответствие критериям программы и свяжемся с вами после первичной оценки.</p>
            </div>
            <ApplyForm industries={content.industries} onSuccess={completeForm} />
          </div>
        </div>
      )}

      <footer>
        <div className="brand-pair">
          <Image src={`${assetBasePath}/logos/skolkovo.png`} alt="Сколково" width={126} height={36} />
          <span className="brand-divider" />
          <Image src={`${assetBasePath}/logos/axoft.png`} alt="Axoft" width={112} height={36} />
        </div>
        <p>© 2026 UP: Axoft & Фонд «Сколково»</p>
      </footer>
    </main>
  );
}
