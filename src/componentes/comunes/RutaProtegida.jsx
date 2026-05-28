import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAutenticacion } from '../../contexto/ContextoAutenticacion'

function RutaProtegida({ children }) {
  // Obtenemos el usuario del contexto de autenticación
  const { usuario } = useAutenticacion()

  // Sin sesión → redirigimos a /acceso
  // replace=true evita que la ruta protegida quede en el historial del navegador
  if (!usuario) {
    return <Navigate to="/acceso" replace />
  }

  // Con sesión → renderizamos el contenido protegido
  return children
}

export default RutaProtegida
