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
  Handshake,
  Menu,
  MessageSquare,
  Microscope,
  Radar,
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

const steps = [
  ["Сбор заявок", "Компании подают заявку, указывают направление отбора, продукт и материалы для первичной оценки."],
  ["Оценка заявок", "Команда программы проверяет соответствие базовым критериям и передаёт релевантные проекты экспертам."],
  ["Работа с экспертами", "Участники получают разбор продукта, упаковки, партнёрской модели и готовности к B2B-продажам."],
  ["Demo-day", "Финалисты представляют решения экспертам, партнёрам и команде Axoft."]
];

const stepIcons = [ClipboardCheck, Target, Microscope, Trophy];

const programResults = [
  {
    title: "Гранты",
    text: "Возможность для финалистов дорастить решения до уровня корпоративного внедрения или провести пилот.",
    Icon: WalletCards
  },
  {
    title: "Контракты",
    text: "Для победителей — дистрибьюторский контракт, по которому Axoft инвестирует 5 млн руб. в продвижение решения.",
    Icon: FileText
  },
  {
    title: "Экспертиза",
    text: "Понимание специфики партнёрского канала, как в него попасть и сделать продукт понятным партнёрам.",
    Icon: Microscope
  },
  {
    title: "Доступ к рынкам",
    text: "Вне зависимости от результата акселератора компания может остаться в пуле Axoft и выйти на рынок, когда будет готова.",
    Icon: Handshake
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
  const [isApplicationComplete, setIsApplicationComplete] = useState(false);
  const [activeSection, setActiveSection] = useState("program");
  const [showSuccess, setShowSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openForm() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsFormOpen(true);
    setIsMobileNavOpen(false);
    setIsApplicationComplete(false);
    setShowSuccess(false);
  }

  function closeForm() {
    setIsFormOpen(false);
  }

  function completeForm() {
    setIsApplicationComplete(true);
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

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
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
      <a className="skip-link" href="#program">Перейти к содержанию</a>
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
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>

      {showSuccess && (
        <div className="toast" role="status" aria-live="polite" tabIndex={-1} ref={toastRef}>
          <strong>Заявка сохранена</strong>
          <span>Мы свяжемся с вами после первичной проверки.</span>
        </div>
      )}

      <section className="first-screen" id="top">
        <div className="program-panel" id="program">
          <p className="eyebrow">Акселератор UP</p>
          <p className="hero-notice">Первый цикл — II квартал 2026 г.</p>
          <h1>Начните корпоративные продажи через канал Axoft</h1>
          <p>
            Программа для команд, которые хотят получить новый канал продаж своих решений, доработать свои продукты
            и сформировать план развития бизнеса при помощи экспертов Axoft и «Сколково».
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
          <div className="criteria-panel-main">
            <p className="eyebrow">Критерии отбора</p>
            <h3>Обязательные</h3>
            <ul>
              {criteria.required.map((item) => (
                <li key={item}><CheckCircle2 size={18} />{item}</li>
              ))}
            </ul>
          </div>
          <p className="criteria-note">{criteria.note}</p>
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <p className="eyebrow">График программы</p>
          <h2>График проведения программы</h2>
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
                Период
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
          );
        })}
      </section>

      <section className="section faq" id="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ и документы</p>
          <h2>Ответы на частые вопросы</h2>
        </div>
        <div className="faq-layout">
          <div className="faq-list">
            {content.faq.map((item, index) => (
              <details key={item.question} open={openFaqIndex === index}>
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenFaqIndex((current) => (current === index ? null : index));
                  }}
                >
                  {item.question}
                </summary>
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
            {isApplicationComplete ? (
              <div className="application-success">
                <CheckCircle2 size={46} />
                <p className="eyebrow">Заявка сохранена</p>
                <h2 id="application-title">Спасибо, заявка принята</h2>
                <p>Мы сохранили данные локально в демо-версии и свяжемся с вами после первичной проверки.</p>
                <button className="primary-link" type="button" onClick={closeForm}>
                  Вернуться на лендинг
                </button>
              </div>
            ) : (
              <>
                <div className="modal-copy">
                  <p className="eyebrow">Форма заявки</p>
                  <h2 id="application-title">Подайте заявку — это займёт 3 минуты</h2>
                  <p>Мы проверим соответствие критериям программы и свяжемся с вами после первичной оценки.</p>
                  <a className="template-download" href={pitchDeckTemplateHref} download>
                    <FileText size={18} />
                    Скачать шаблон презентации
                  </a>
                </div>
                <ApplyForm directions={content.directions.map((direction) => direction.name)} onSuccess={completeForm} />
              </>
            )}
          </div>
        </div>
      )}

      <div className="mobile-sticky-cta" aria-label="Быстрые действия">
        <button type="button" onClick={openForm}>
          Подать заявку
          <ArrowRight size={18} />
        </button>
        <a href={pitchDeckTemplateHref} download aria-label="Скачать шаблон презентации">
          <Download size={18} />
        </a>
      </div>

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
