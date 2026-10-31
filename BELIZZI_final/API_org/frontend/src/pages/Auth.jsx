import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import { useShop } from '../context/ShopContext.jsx';

function Layout({ children }) {
  const { user } = useShop();
  if (user) return <Navigate to="/perfil" replace />;
  return (
    <div className="auth">
      <div className="auth-art" aria-hidden="true">
        <div className="arch a2"><Garment kind="jacket" color="var(--accent)" /></div>
      </div>
      {children}
    </div>
  );
}

export const LoginPage = () => <Layout><LoginForm /></Layout>;
export const RegisterPage = () => <Layout><RegisterForm /></Layout>;
