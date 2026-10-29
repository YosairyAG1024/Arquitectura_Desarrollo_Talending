import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {api} from '../api.js';

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = useMutation({
        mutationFn:(datos)=>api('/auth/login', {method:'POST', body:datos}), 
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            navigate('/');
        }
    });

    function enviar(e) {
        e.preventDefault();

        console.log('Datos del login:', { correo: email, password: '***' });

        login.mutate({
    correo: email,
    password: password,
});
    }

        return (
            <form onSubmit={enviar}>
                <h1>Iniciar Sesión</h1>
                <input type="email" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
                <input type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
                <button disabled={login.isLoading} type="submit">Continuar</button>
                {login.isError && <p>{login.error.message}</p>}
            </form> 
    )};