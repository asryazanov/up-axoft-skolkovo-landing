import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="thanks-page">
      <section className="thanks-card">
        <p className="eyebrow">Заявка отправлена</p>
        <h1>Спасибо, мы получили данные в демо-режиме</h1>
        <p>
          Сейчас форма работает как локальная заглушка. После подключения Bitrix24 заявка будет создавать лид
          с источником «Лендинг UP» и UTM-метками.
        </p>
        <Link className="primary-link" href="/">
          Вернуться на лендинг
        </Link>
      </section>
    </main>
  );
}
