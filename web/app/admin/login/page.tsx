import { login } from "../actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <div className="admin-login">
      <h1>Admin SACRED</h1>
      <form action={login}>
        <input type="password" name="password" placeholder="Contraseña" required autoFocus />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="admin-error">Contraseña incorrecta.</p>}
    </div>
  );
}
