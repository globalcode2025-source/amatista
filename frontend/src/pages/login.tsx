import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    nombre: string;
  };
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al iniciar sesión');
      }

      const data: LoginResponse = await response.json();
      
      // Guardar token en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir al admin
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amatista-deep">
      <div className="w-full max-w-6xl mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sección izquierda - Fondo oscuro */}
            <div className="md:w-1/2 bg-amatista-deep p-12 text-cream flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold mb-4">AMATISTA</h1>
                <p className="font-hand text-xl text-gold">Accede a tu espacio</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-3xl font-serif font-semibold mb-4">Bienvenida de vuelta a Amatista</h2>
                <p className="text-cream/80 leading-relaxed">
                  Ingresa para gestionar pedidos, revisar tu comunidad y volver a tus rituales favoritos.
                </p>
              </div>
            </div>

            {/* Sección derecha - Formulario */}
            <div className="md:w-1/2 bg-cream p-12 flex flex-col justify-center">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm text-ink/55 uppercase tracking-wide">Iniciar sesión</p>
                  <h3 className="text-2xl font-serif font-bold text-ink">Amatista</h3>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="text-sm text-ink/55 hover:text-ink transition-colors"
                >
                  VOLVER
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                    CORREO
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-ink/14 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                    placeholder="tu@correo.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                    CONTRASEÑA
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-ink/14 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white"
                    placeholder="••••••••"
                  />
                </div>

                {/* <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-gold border-ink/14 rounded focus:ring-gold"
                    />
                    <span className="ml-2 text-sm text-ink/70">Recordarme</span>
                  </label>
                 
                </div> */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amatista-deep text-cream py-3 px-4 rounded-md font-medium hover:bg-amatista-deep/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Iniciando sesión...' : 'ENTRAR'}
                </button>
              </form>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;