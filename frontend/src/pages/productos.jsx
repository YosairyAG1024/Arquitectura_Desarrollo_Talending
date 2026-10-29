import {useState} from 'react';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../api.js';

export default function Productos() {   
    const queryClient = useQueryClient();
    const[nombre, setNombre] = useState('');
    const[precio, setPrecio] = useState('');
    const[stock, setStock] = useState('');

//leer (GET) con cahe
const {data,isPending, isError, error} = useQuery({
    queryKey : ['productos'], 
    queryFn : () => api('/productos'),

});

// crear (POST)
const crear = useMutation({
    mutationFn:(datos) =>api('/productos', {method:'POST', body:datos}),
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey:['productos']});
        setNombre('');
        setPrecio('');
        setStock('');
    },
});

function agregar(e) {
    e.preventDefault();
    crear.mutate({nombre, precio:parseFloat(precio),stock:parseInt(stock)});
}

function salir() {
    localStorage.removeItem('token');
    location.href = '/login';
}

if(isPending) return <p>Cargando...</p>
if(isError) return <p>{error.message}</p>

    return (
        <main>
            <h1>Productos</h1>
            <button onClick={salir}>Salir</button>
            <form onSubmit={agregar}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
                <input type="number" placeholder="Precio" value={precio} onChange={e=>setPrecio(e.target.value)} />
                <input type="number" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
                <button disabled={crear.isPending} type="submit">
                    Agregar
                </button>
                {crear.isError && <p>{crear.error.message}</p>}
            </form>
            {crear.isPending && <p>Agregando producto...</p>}
            
            <ul>
                {data.map(producto => 
                    <li key={producto.id}>{producto.nombre} - ${producto.precio} - Stock: {producto.stock}</li>
                )}
            </ul>
        </main>
    );

}
