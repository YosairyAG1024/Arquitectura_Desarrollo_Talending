
const API = 'http://localhost:3000/api';

export async function api(ruta, opciones = {}) {
    const token = localStorage.getItem('token');

    // Preparamos los encabezados de la petición.
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Enviamos el cuerpo únicamente si hay datos.
    const configuracion = {
        method: opciones.method || 'GET',
        headers,
        ...(opciones.body !== undefined
            ? { body: JSON.stringify(opciones.body) }
            : {}),
    };

    console.log('Petición:', API + ruta);
    console.log('Datos enviados:', opciones.body);

    const res = await fetch(API + ruta, configuracion);

    // Leemos la respuesta del servidor.
    const data = res.status === 204 ? null : await res.json();

    if (!res.ok) {
        throw new Error(
            data?.msg || data?.message || `Error HTTP ${res.status}`
        );
    }

    return data;
}
