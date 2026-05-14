"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Factory,
  FileText,
  Gauge,
  Handshake,
  Menu,
  MessageSquare,
  Microscope,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  WalletCards,
  X
} from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { useEditableContent } from "@/lib/useEditableContent";
import { siteContent } from "@/data/site";

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pitchDeckTemplateHref = `${assetBasePath}/documents/up-pitch-deck-template.pptx`;

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

const stepIcons = [ClipboardCheck, Target, Microscope, Route, Trophy];

const programResults = [
  {
    title: "Деньги",
    text: "Маршрут к грантам, пилотам и коммерческим возможностям там, где продукт уже готов к рынку.",
    Icon: WalletCards
  },
  {
    title: "Экспертиза",
    text: "Разбор продукта, позиционирования, зрелости и готовности к корпоративным внедрениям.",
    Icon: Microscope
  },
  {
    title: "Партнёры",
    text: "Понимание, как продукт может попасть в канал продаж и стать понятным партнёрам Axoft.",
    Icon: Handshake
  },
  {
    title: "Скорость",
    text: "Фокус на действиях после отбора: быстрее проверить гипотезы, упаковку и путь к заказчикам.",
    Icon: Gauge
  }
];

const directionIcons = [BrainCircuit, Factory, MessageSquare, ShieldCheck, Bot, Radar];

const navigationItems = [
  ["program", "Программа"],
  ["axoft", "Axoft"],
  ["directions", "Направления"],
  ["faq", "FAQ"]
];

export function LandingPage() {
  const content = useEditableContent();
  const axoft = content.axoft ?? siteContent.axoft;
  const criteria = content.criteria ?? siteContent.criteria;
  const documents = content.documents ?? siteContent.documents;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("program");
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openForm() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsFormOpen(true);
    setIsMobileNavOpen(false);
    setShowSuccess(false);
  }

  function closeForm() {
    setIsFormOpen(false);
  }

  function completeForm() {
    setIsFormOpen(false);
    setShowSuccess(true);
  }

  useEffect(() => {
    function updateActiveSection() {
      const headerOffset = 120;
      const currentPosition = window.scrollY + headerOffset;
      const sections = navigationItems
        .map(([id]) => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));

      let currentSection = sections[0]?.id ?? "program";

      for (const section of sections) {
        if (section.offsetTop <= currentPosition) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      previousFocusRef.current?.focus();
      return;
    }

    const modal = modalRef.current;
    if (!modal) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusable = Array.from(modal.querySelectorAll<HTMLElement>(focusableSelector));
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    const firstField = modal.querySelector<HTMLElement>('input[name="company"]');

    (firstField ?? firstFocusable)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeForm();
      }

      if (event.key !== "Tab" || !firstFocusable || !lastFocusable) return;

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFormOpen]);

  useEffect(() => {
    if (!showSuccess) return;
    toastRef.current?.focus();
  }, [showSuccess]);

  const primaryAxoftStats = axoft.stats.slice(0, 4);
  const secondaryAxoftStats = axoft.stats.slice(4);

  function renderNavLinks() {
    return navigationItems.map(([id, label]) => (
      <a
        key={id}
        href={`#${id}`}
        className={activeSection === id ? "is-active" : undefined}
        aria-current={activeSection === id ? "location" : undefined}
        onClick={() => {
          setActiveSection(id);
          setIsMobileNavOpen(false);
        }}
      >
        {label}
      </a>
    ));
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand-pair" href="#top" aria-label="UP Axoft Сколково">
          <Image src={`${assetBasePath}/logos/skolkovo.png`} alt="Сколково" width={146} height={41} priority />
          <span className="brand-divider" />
          <Image src={`${assetBasePath}/logos/axoft.png`} alt="Axoft" width={125} height={40} priority />
        </a>
        <nav aria-label="Основная навигация">
          {renderNavLinks()}
        </nav>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={isMobileNavOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileNavOpen((current) => !current)}
        >
          {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button className="header-cta" type="button" onClick={openForm}>Подать заявку</button>
        <nav
          className={isMobileNavOpen ? "mobile-navigation is-open" : "mobile-navigation"}
          id="mobile-navigation"
          aria-label="Навигация по разделам"
        >
          {renderNavLinks()}
        </nav>
      </header>

      {showSuccess && (
        <div className="toast" role="status" aria-live="polite" tabIndex={-1} ref={toastRef}>
          <strong>Заявка сохранена</strong>
          <span>Мы свяжемся с вами после первичной проверки.</span>
        </div>
      )}

      <section className="first-screen" id="top">
        <div className="program-panel" id="program">
          <p className="eyebrow">О программе</p>
          <p className="hero-notice">Первый цикл — II квартал 2026 г.</p>
          <h1>Подготовьте продукт к корпоративным продажам через канал Axoft</h1>
          <p>
            Это программа для команд, которым важно не просто выступить на питче, а получить понятный путь к деньгам,
            экспертизе, партнёрам и первым рыночным проверкам вместе с Axoft и экосистемой «Сколково».
          </p>
          <div className="result-grid">
            {programResults.map(({ title, text, Icon }) => (
              <article key={title}>
                <span className="result-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <strong>{title}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
          <div className="hero-actions-row">
            <button className="primary-link" type="button" onClick={openForm}>
              Подать заявку <ArrowRight size={18} />
            </button>
            <a className="template-download hero-template-link" href={pitchDeckTemplateHref} download>
              <Download size={18} />
              Скачать шаблон презентации
            </a>
          </div>
        </div>
      </section>

      <section className="partner-screen" id="axoft" aria-label="Партнёр Axoft">
        <div className="partner-panel">
          <p className="eyebrow">{axoft.kicker}</p>
          <h2>{axoft.title}</h2>
          <p>{axoft.lead}</p>
          <p className="partner-benefit">
            Для участников UP это доступ к пониманию спроса, партнёрской модели и требованиям корпоративных заказчиков.
          </p>
          <div className="partner-points" aria-label="Что Axoft даёт участнику">
            {axoft.points.map((point) => (
              <article key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
          <button className="secondary-link partner-cta" type="button" onClick={openForm}>
            Подать заявку <ArrowRight size={18} />
          </button>
        </div>
        <div className="partner-proof">
          <div className="partner-stats">
            {primaryAxoftStats.map((stat) => (
              <div className={stat.value === "3 300+" ? "is-featured" : undefined} key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="partner-secondary-stats">
            {secondaryAxoftStats.map((stat) => (
              <span key={stat.label}>
                <strong>{stat.value}</strong>
                {stat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="selection-screen" id="directions">
        <div className="section-heading">
          <p className="eyebrow">Отбор</p>
          <h2>Направления отбора и базовые критерии</h2>
        </div>

        <div className="direction-grid expanded">
          {content.directions.map((direction, index) => {
            const DirectionIcon = directionIcons[index] ?? Sparkles;
            return (
            <article key={direction.name}>
              <span className="direction-icon" aria-hidden="true">
                <DirectionIcon size={22} />
              </span>
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
            );
          })}
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
          <p className="criteria-note">{criteria.note}</p>
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <p className="eyebrow">Структура и сроки</p>
          <h2>От заявки до Demo Day — пять этапов</h2>
          <p>Точный календарь будет опубликован позднее. Первый цикл программы запланирован на II квартал 2026 года.</p>
        </div>
        {steps.map(([title, text], index) => {
          const StepIcon = stepIcons[index] ?? CheckCircle2;
          return (
          <article className={index === steps.length - 1 ? "process-final" : undefined} key={title}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <div>
              <span className="process-label">
                <StepIcon size={16} />
                Этап
              </span>
              <h3>{title}</h3>
              <span className="process-result">Результат</span>
              <p>{text}</p>
            </div>
          </article>
          );
        })}
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
                if (document.status) {
                  return (
                    <span className="document-soon" key={document.name}>
                      <FileText size={18} />
                      {document.name}
                      <small>{document.status}</small>
                    </span>
                  );
                }
                return (
                  <a
                    className={href.endsWith(".pptx") ? "document-featured" : undefined}
                    key={document.name}
                    href={href}
                    download={href.endsWith(".pptx") ? true : undefined}
                  >
                    <FileText size={18} />
                    {document.name}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
        <p className="faq-cta-note">Первичная заявка занимает 3 минуты.</p>
        <button className="primary-link" type="button" onClick={openForm}>
          Подать заявку <ArrowRight size={18} />
        </button>
      </section>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            ref={modalRef}
          >
            <button className="modal-close" type="button" onClick={closeForm} aria-label="Закрыть форму">
              <X size={20} />
            </button>
            <div className="modal-copy">
              <p className="eyebrow">Форма заявки</p>
              <h2 id="application-title">Подайте заявку — это займёт 3 минуты</h2>
              <p>Мы проверим соответствие критериям программы и свяжемся с вами после первичной оценки.</p>
              <a className="template-download" href={pitchDeckTemplateHref} download>
                <FileText size={18} />
                Скачать шаблон презентации
              </a>
            </div>
            <ApplyForm industries={content.industries} onSuccess={completeForm} />
          </div>
        </div>
      )}

      <footer>
        <div className="brand-pair">
          <Image src={`${assetBasePath}/logos/skolkovo.png`} alt="Сколково" width={126} height={36} />
          <span className="brand-divider" />
          <Image
            className="footer-axoft-logo"
            src={`${assetBasePath}/logos/axoft-footer-white.png`}
            alt="Axoft — центр экспертизы и дистрибуции цифровых технологий"
            width={253}
            height={40}
          />
        </div>
        <p>© 2026 UP: Axoft & Фонд «Сколково»</p>
      </footer>
    </main>
  );
}
