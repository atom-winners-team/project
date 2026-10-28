import './LoginPage.scss';

export default function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('accessToken', 'demo-token');
    window.location.assign('/');
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Rosatom</h1>
        <p>Система управления ветроэнергетическим оборудованием</p>
        <label>
          Логин
          <input name="login" required />
        </label>
        <label>
          Пароль
          <input name="password" type="password" required />
        </label>
        <button type="submit">Войти</button>
      </form>
    </main>
  );
}
