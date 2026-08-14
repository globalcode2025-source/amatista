import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Catalogo from './pages/catalogo';
import Login from './pages/login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Pedidos from './admin/pages/Pedidos'; //VENTAS
import Clientes from './admin/pages/Clientes';
import Productos from './admin/pages/Productos';
import Eventos from './admin/pages/Eventos';
import Galeria from './admin/pages/Galeria';
import Testimonios from './admin/pages/Testimonios';
import Gastos from './admin/pages/Gastos';
import Costos from './admin/pages/Costos';
import Proveedores from './admin/pages/Proveedores';
import Cuidados from './admin/pages/Cuidados';
import Suscriptores from './admin/pages/Suscriptores';

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!hash) { 
        // Si no hay hash, hacer scroll al inicio (header)
        window.scrollTo({ top: 0, behavior: 'auto' }); 
        return; 
      }
      // Si hay hash, scroll a la sección correspondiente
      const element = document.getElementById(hash.slice(1));
      if (element) {
        // Pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        }, 100);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ventas" element={<Pedidos />} /> //VENTAS
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="testimonios" element={<Testimonios />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="costos" element={<Costos />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="cuidados" element={<Cuidados />} />
          <Route path="suscriptores" element={<Suscriptores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
