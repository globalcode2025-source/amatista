import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Catalogo from './pages/catalogo';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Pedidos from './admin/pages/Pedidos'; //VENTAS
import Pedido from './admin/pages/Pedido'; //PEDIDO
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const { pathname } = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Verificar si estamos en una ruta de admin
      if (pathname.startsWith('/admin')) {
        // Si no hay token, marcar como no válido
        if (!token) {
          setIsVerified(true);
          setIsValid(false);
          return;
        }
        
        // Si hay token, verificar que sea válido haciendo una petición al backend
        try {
          const response = await fetch('http://localhost:8000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            setIsValid(true);
            setIsVerified(true);
          } else {
            // Token inválido, limpiar y marcar como no válido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsVerified(true);
            setIsValid(false);
          }
        } catch (error) {
          // Error de conexión, limpiar y marcar como no válido por seguridad
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsVerified(true);
          setIsValid(false);
        }
      } else {
        // No estamos en admin, no verificar
        setIsVerified(true);
      }
    };

    checkAuth();
  }, [token, pathname]);

  // Si estamos en admin y no está verificado, mostrar loading
  if (pathname.startsWith('/admin') && !isVerified) {
    return <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-ink">Verificando autenticación...</div>
    </div>;
  }

  // Si estamos en admin y el token no es válido, redirigir al login
  if (pathname.startsWith('/admin') && !isValid) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

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
      <AuthProvider>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Catalogo />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="ventas" element={<Pedidos />} /> //VENTAS
            <Route path="pedidos" element={<Pedido />} /> //PEDIDO
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
      </AuthProvider>
    </BrowserRouter>
  );
}
