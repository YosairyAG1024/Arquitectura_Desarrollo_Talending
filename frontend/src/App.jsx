import { Routes, Route } from 'react-router-dom';
import Login from './pages/login.jsx';
import Productos from './pages/productos.jsx';
import RutaProtegida from './RutaProtegida.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <RutaProtegida> 
                    <Productos />
                </RutaProtegida>
            }/>
        </Routes>
  );
}