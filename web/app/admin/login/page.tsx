import { login } from "../actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="admin-login-page">
      <div className="admin-login-aside">
        <div className="admin-login-mark">
          <svg viewBox="0 0 24 30" fill="none" aria-hidden="true">
            <path d="M12 1c3.4 4.6 6.6 7.4 6.6 12.2 0 3.9-2.9 6.9-6.6 6.9s-6.6-3-6.6-6.9C5.4 8.4 8.6 5.6 12 1z" stroke="#B07E1E" strokeWidth="1.2" />
            <path d="M4 23h16M8.5 26.5h7M11 29.5h2" stroke="#B07E1E" strokeWidth="1.2" strokeLinecap="square" />
          </svg>
        </div>
        <p className="admin-login-wordmark">Sacred</p>
        <p className="admin-login-copy">
          El taller donde se prepara cada ritual antes de llegar a la puerta de alguien.
        </p>
      </div>

      <div className="admin-login-main">
        <form action={login} className="admin-login-form">
          <h1>Ingresar</h1>
          <p className="admin-login-hint">Acceso exclusivo para el equipo SACRED.</p>

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" name="password" required autoFocus />

          <button type="submit">Entrar</button>

          {error && <p className="admin-error">Contraseña incorrecta.</p>}
        </form>
      </div>
    </div>
  );
}
