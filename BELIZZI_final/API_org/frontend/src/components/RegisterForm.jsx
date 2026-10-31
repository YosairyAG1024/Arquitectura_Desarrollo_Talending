
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function RegisterForm() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 2) {
      return setError('Escribe tu nombre.');
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError('Escribe un correo válido.');
    }

    if (form.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.');
    }

    if (form.password !== form.confirm) {
      return setError('Las contraseñas no coinciden.');
    }

    try {
      setLoading(true);

      const data = await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      if (data?.token) {
        navigate('/perfil', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }

    } catch (err) {
      console.error('Error al registrarse:', err);

      setError(
        err.message || 'No se pudo completar el registro.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <h1>Crea tu cuenta</h1>

      <label>
        Nombre
        <input
          value={form.name}
          onChange={set('name')}
          autoComplete="name"
        />
      </label>

      <label>
        Correo
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          autoComplete="email"
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={form.password}
          onChange={set('password')}
          autoComplete="new-password"
        />
      </label>

      <label>
        Repite la contraseña
        <input
          type="password"
          value={form.confirm}
          onChange={set('confirm')}
          autoComplete="new-password"
        />
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button
        className="btn btn-block"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="muted">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}
