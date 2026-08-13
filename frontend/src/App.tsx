import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Catalogo from './pages/catalogo';
import Login from './pages/login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Pedidos from './admin/pages/Pedidos';
import Clientes from './admin/pages/Clientes';
import Productos from './admin/pages/Productos';
import Eventos from './admin/pages/Eventos';
import Galeria from './admin/pages/Galeria';
import Testimonios from './admin/pages/Testimonios';
import Gastos from './admin/pages/Gastos';
import Costos from './admin/pages/Costos';
import Proveedores from './admin/pages/Proveedores';

function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!hash) { window.scrollTo({ top: 0, behavior: 'auto' }); return; }
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'auto', block: 'start' });
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
          <Route path="ventas" element={<Pedidos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="productos" element={<Productos />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="testimonios" element={<Testimonios />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="costos" element={<Costos />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
