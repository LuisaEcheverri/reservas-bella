// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorAutenticacion } from './contexto/ContextoAutenticacion'
import RutaProtegida from './componentes/comunes/RutaProtegida'
import PaginaAcceso from './paginas/PaginaAcceso'
import PaginaPanel from './paginas/PaginaPanel'
 
function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/acceso" replace />} />
          <Route path="/acceso" element={<PaginaAcceso />} />
          <Route
            path="/panel"
            element={
              <RutaProtegida>
                <PaginaPanel />
              </RutaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/acceso" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorAutenticacion>
  )
}
 
export default App
 