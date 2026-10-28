import './DashboardPage.scss';

export default function DashboardPage() {
  return (
    <section>
      <h1>Главная</h1>
      <div className="cards-grid">
        <article className="info-card"><span>Оборудование</span><strong>—</strong></article>
        <article className="info-card"><span>Активные заявки</span><strong>—</strong></article>
        <article className="info-card"><span>Аварии</span><strong>—</strong></article>
      </div>
    </section>
  );
}
