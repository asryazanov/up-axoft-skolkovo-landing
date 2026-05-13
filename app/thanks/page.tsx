import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="thanks-page">
      <section className="thanks-card">
        <p className="eyebrow">Заявка отправлена</p>
        <h1>Спасибо — мы получили вашу заявку</h1>
        <p>
          Мы рассмотрим её в течение 5 рабочих дней и свяжемся с вами на указанный email
          с результатом и следующими шагами.
        </p>
        <Link className="primary-link" href="/">
          Вернуться на лендинг
        </Link>
      </section>
    </main>
  );
}
