"use client";

import Image from "next/image";
import { ArrowRight, BarChart3, CalendarClock, CheckCircle2, ExternalLink, Gauge, ShieldCheck, Sparkles, Users } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { useEditableContent } from "@/lib/useEditableContent";

const experts = ["Эксперт Axoft", "Эксперт «Сколково»", "Отраслевой ментор"];
const team = ["Менеджер программы", "Куратор заявок", "Технический координатор"];

export function LandingPage() {
  const content = useEditableContent();

  return (
    <main>
      <header className="site-header">
        <a className="brand-pair" href="#top" aria-label="UP Axoft Сколково">
          <Image src="/logos/skolkovo.png" alt="Сколково" width={146} height={41} priority />
          <span className="brand-divider" />
          <Image src="/logos/axoft.png" alt="Axoft" width={125} height={40} priority />
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
          <h1>
            <span>UP</span> {content.hero.title.replace("UP ", "")}
          </h1>
          <p>{content.hero.lead}</p>
          <div className="hero-actions">
            <a className="primary-link" href="#form" data-goal="hero_startup">
              Я стартап <ArrowRight size={18} />
            </a>
            <a className="secondary-link" href="#form" data-goal="hero_vendor">
              Я вендор <ArrowRight size={18} />
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
          <h2>Скаутинг, экспертиза и подготовка к партнёрскому каналу</h2>
        </div>
        <p>
          Программа соединяет экспертизу Фонда «Сколково» и дистрибьюторскую практику Axoft. Лендинг помогает
          собрать поток заявок, маршрутизировать компании по трекам и подготовить данные для CRM.
        </p>
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
          <h2>Первый фокус — промышленность, рядом зрелые ИТ-категории</h2>
        </div>
        <div className="direction-grid">
          {content.directions.map((direction) => (
            <article key={direction.name}>
              <Sparkles size={21} />
              <h3>{direction.name}</h3>
              <p>{direction.detail}</p>
              {direction.count ? <span>{direction.count}</span> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section process">
        <div className="section-heading">
          <p className="eyebrow">Структура программы</p>
          <h2>От заявки до Demo Day</h2>
        </div>
        {[
          ["Заявка", "Компания выбирает тип участника и отправляет данные через форму."],
          ["Заочная оценка", "Команда проверяет релевантность, отрасль, зрелость продукта и потенциал канала."],
          ["Open Day", "Участники получают вводную встречу, критерии и маршрут программы."],
          ["Demo Day", "Финалисты презентуют решения профильным заказчикам и партнёрам."]
        ].map(([title, text], index) => (
          <article key={title}>
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
          <h2>Навигация к возможностям экосистемы</h2>
        </div>
        {content.services.map((service) => (
          <a key={service.name} href={service.href} target="_blank" rel="noreferrer">
            <ExternalLink size={20} />
            <strong>{service.name}</strong>
            <span>{service.description}</span>
          </a>
        ))}
      </section>

      <section className="section registry">
        <div>
          <p className="eyebrow">Реестр продуктов</p>
          <h2>Категории для отбора и коммуникации</h2>
        </div>
        <div className="registry-list">
          {content.registryDirections.map((item) => (
            <div key={item.name}>
              <span>{item.count === null ? "TBD" : item.count}</span>
              <p>{item.name}</p>
              <small>{item.note}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="section people">
        <div className="section-heading">
          <p className="eyebrow">Эксперты и команда</p>
          <h2>Плейсхолдеры до получения фото и биографий</h2>
        </div>
        <div className="people-grid">
          {[...experts, ...team].map((person, index) => (
            <article key={person}>
              <div className="avatar">{index < 3 ? <ShieldCheck /> : <Users />}</div>
              <h3>{person}</h3>
              <p>{index < 3 ? "Экспертиза программы" : "Операционное сопровождение"}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="form-section" id="form">
        <div className="form-copy">
          <p className="eyebrow">Форма заявки</p>
          <h2>Расскажите о компании и продукте</h2>
          <p>
            Сейчас форма работает в демо-режиме. После получения параметров Bitrix24 она будет создавать лид,
            прокидывать UTM и разделять поток по типу участника.
          </p>
          <div className="form-badges">
            <span><BarChart3 size={16} /> Метрика: заглушка</span>
            <span><Gauge size={16} /> B24: mock API</span>
            <span><CalendarClock size={16} /> Сроки: TBD</span>
          </div>
        </div>
        <ApplyForm industries={content.industries} />
      </section>

      <footer>
        <div className="brand-pair">
          <Image src="/logos/skolkovo.png" alt="Сколково" width={126} height={36} />
          <span className="brand-divider" />
          <Image src="/logos/axoft.png" alt="Axoft" width={112} height={36} />
        </div>
        <p>© 2026 UP: Axoft & Фонд «Сколково». Локальный прототип.</p>
        <a href="/admin">Админка</a>
      </footer>
    </main>
  );
}
