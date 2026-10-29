import {Routes, Route} from 'react-router-dom';
import Login from './pages/Login.jsx';
import Productos from './pages/Productos.jsx';
import RutaProtegida from '../src/RutaProtegida.jsx';

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