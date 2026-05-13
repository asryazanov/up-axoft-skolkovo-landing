"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
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
  ["Заявка", "Заполните форму — в течение 2 рабочих дней придёт подтверждение о получении."],
  ["Первичная оценка", "Эксперты программы проверяют релевантность направления, зрелость продукта и потенциал для канала."],
  ["Open Day", "Прошедшие отбор получают приглашение: знакомство с командой программы, критериями и маршрутом."],
  ["Сопровождение по треку", "Экспертиза продукта, упаковка решения, подготовка партнёрских и маркетинговых материалов."],
  ["Demo Day", "Финалисты представляют решения индустриальным заказчикам и партнёрам Axoft в формате живых презентаций."]
];

export function LandingPage() {
  const content = useEditableContent();
  const axoft = content.axoft ?? siteContent.axoft;

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
          <a href="#form">Заявка</a>
        </nav>
        <a className="header-cta" href="#form">Подать заявку</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.label}</p>
          {content.hero.notice && (
            <p className="hero-notice">{content.hero.notice}</p>
          )}
          <h1>
            <span>UP</span>: {content.hero.title.replace("UP: ", "")}
          </h1>
          <p>{content.hero.lead}</p>
          <div className="hero-actions">
            <a className="primary-link" href="#form">
              Подать заявку <ArrowRight size={18} />
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Ключевые показатели">
          {content.hero.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section intro" id="program">
        <div>
          <p className="eyebrow">О программе</p>
          <h2>Чем UP отличается от обычного акселератора</h2>
        </div>
        <div className="intro-copy">
          <p>
            Большинство акселераторов заканчиваются питчем и сертификатом. Вы три месяца готовите презентацию,
            выходите на сцену, получаете аплодисменты — и возвращаетесь к тому, с чего начали: без контрактов,
            без понимания, как именно ваш продукт попадёт к корпоративным заказчикам.
          </p>
          <p>UP устроен иначе. Это не про питч. Это про то, что будет после.</p>
        </div>
      </section>

      <section className="section axoft-proof">
        <div className="axoft-proof-main">
          <p className="eyebrow">{axoft.kicker}</p>
          <h2>{axoft.title}</h2>
          <p>{axoft.lead}</p>
          <a className="primary-link" href="#form">
            Подать заявку <ArrowRight size={18} />
          </a>
        </div>
        <div className="axoft-stats" aria-label="Ключевые показатели Axoft">
          {axoft.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="axoft-points" aria-label="Как Axoft помогает участникам UP">
          {axoft.points.map((point) => (
            <article key={point.title}>
              <Sparkles size={18} />
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section tracks">
        {content.tracks.map((track) => (
          <article className="track-card" key={track.name}>
            <span>{track.audience}</span>
            <h3>{track.name}</h3>
            <p>{track.description}</p>
            <ul>
              {track.points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={17} />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="section directions" id="directions">
        <div className="section-heading">
          <p className="eyebrow">Приоритетные направления</p>
          <h2>Ключевой фокус — промышленность и зрелые ИТ-категории</h2>
        </div>
        <div className="direction-grid">
          {content.directions.map((direction) => (
            <article key={direction.name}>
              <Sparkles size={21} />
              <h3>{direction.name}</h3>
              <p>{direction.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <p className="eyebrow">Структура программы</p>
          <h2>От заявки до Demo Day — пять шагов</h2>
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

      <section className="section services">
        <div className="section-heading">
          <p className="eyebrow">Сервисы «Сколково»</p>
          <h2>Возможности экосистемы для участников</h2>
        </div>
        {content.services.map((service) => (
          <a key={service.name} href={service.href} target="_blank" rel="noreferrer">
            <ExternalLink size={20} />
            <strong>{service.name}</strong>
            <span>{service.description}</span>
          </a>
        ))}
      </section>

      <section className="section people">
        <div className="section-heading">
          <p className="eyebrow">Оценка заявок</p>
          <h2>Кто принимает решение</h2>
        </div>
        <div className="people-grid">
          {evaluators.map((evaluator) => (
            <article key={evaluator.role}>
              <h3>{evaluator.role}</h3>
              <p>{evaluator.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="form-section" id="form">
        <div className="form-copy">
          <p className="eyebrow">Форма заявки</p>
          <h2>Подайте заявку — это займёт 3 минуты</h2>
          <p>
            Заполните форму — мы проверим соответствие критериям программы
            и свяжемся с вами в течение 2 рабочих дней.
          </p>
        </div>
        <ApplyForm industries={content.industries} />
      </section>

      <section className="section faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Ответы на частые вопросы</h2>
        </div>
        <div className="faq-list">
          {content.faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

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
