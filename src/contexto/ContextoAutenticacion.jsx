// src/contexto/ContextoAutenticacion.jsx
//
// Contexto global de sesión del anfitrión.
//
// Provee a toda la app:
//   - usuario: objeto { nombre, turno } o null si no hay sesión
//   - iniciarSesion(): guarda el usuario en estado y LocalStorage
//   - cerrarSesion(): limpia el estado y LocalStorage
//
// Cualquier componente puede consumir este contexto con el hook useAutenticacion()
// sin necesidad de pasar props por toda la jerarquía.

import React, { createContext, useContext, useState, useEffect } from 'react'

// ─── 1. Creamos el contexto ────────────────────────────────────────────────
const ContextoAutenticacion = createContext(null)

// ─── 2. Proveedor del contexto ─────────────────────────────────────────────
// Envuelve la app entera desde Aplicacion.jsx
export function ProveedorAutenticacion({ children }) {

  // null = no autenticado | objeto = sesión activa
  const [usuario, setUsuario] = useState(null)

  // Al montar: recuperamos sesión guardada en LocalStorage
  // El [] garantiza que solo se ejecuta una vez al iniciar la app
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('bellanotte_sesion')
    if (sesionGuardada) {
      setUsuario(JSON.parse(sesionGuardada))
    }
  }, [])

  // iniciarSesion: recibe { nombre, turno }, persiste en estado y LocalStorage
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario)
    localStorage.setItem('bellanotte_sesion', JSON.stringify(datosUsuario))
  }

  // cerrarSesion: limpia todo
  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem('bellanotte_sesion')
  }

  return (
    <ContextoAutenticacion.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  )
}

// ─── 3. Hook personalizado ─────────────────────────────────────────────────
// Simplifica el consumo del contexto en cualquier componente
export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de <ProveedorAutenticacion>')
  }
  return contexto
}
