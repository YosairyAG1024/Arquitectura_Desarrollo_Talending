import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';

export default function LoginForm() {
  const { login } = useShop();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/perfil';

  const submit = (e) => {
    e.preventDefault();
    const err = login(form);
    if (err) setError(err);
    else navigate(from, { replace: true });
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <h1>Inicia sesión</h1>
      <label>
        Correo
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
      </label>
      <label>
        Contraseña
        <span className="pw">
          <input type={show ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
          <button type="button" onClick={() => setShow((s) => !s)}>{show ? 'Ocultar' : 'Mostrar'}</button>
        </span>
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn btn-block">Entrar</button>
      <p className="muted">¿Aún no tienes cuenta? <Link to="/registro">Crea una</Link></p>
    </form>
  );
}
