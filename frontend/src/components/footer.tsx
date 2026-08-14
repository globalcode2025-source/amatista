import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createSuscriptor } from '../services/suscriptores';

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setLoading(true);
      await createSuscriptor({ correo: email });
      setSent(true);
      setEmail('');
    } catch (err) {
      console.error('Error al suscribir:', err);
      alert('Hubo un error al suscribirte. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-amatista-deep py-20 text-cream/70">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-cream/12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="mb-3.5 font-serif text-[1.3rem] uppercase tracking-[0.04em] text-cream">Amatista</div>
            <p className="text-sm leading-[1.65]">
              Rituales, aromas y arte para el bienestar. Velas artesanales y experiencias kintsugi hechas a mano en
              Colombia.
            </p>
          </div>

          <div>
            <h5 className="mb-4 text-[0.78rem] uppercase tracking-[0.08em] text-gold-light">Explorar</h5>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/#inicio" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/#eventos" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Taller de Kintsugi
                </Link>
              </li>
              <li>
                <Link to="/#galeria" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Galería
                </Link>
              </li>
              <li>
                <Link to="/#historia" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Historia
                </Link>
              </li>
              <li>
                <Link to="/#ubicacion" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  Ubicación
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[0.78rem] uppercase tracking-[0.08em] text-gold-light">Contacto</h5>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="mailto:hola@amatistavelas.co" className="text-sm text-cream/72 transition-colors hover:text-gold-light">
                  hola@amatistavelas.co
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/573000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/72 transition-colors hover:text-gold-light"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/amatista_velasyaromas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/72 transition-colors hover:text-gold-light"
                >
                  Instagram
                </a>
              </li>
              <li className="text-sm text-cream/72">Envíos a toda Colombia</li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-[0.78rem] uppercase tracking-[0.08em] text-gold-light">
              Únete a nuestros rituales
            </h5>
            <p className="text-sm leading-[1.5]">Recibe primero los nuevos aromas y cupos de talleres.</p>

            {sent ? (
              <p className="mt-3.5 text-sm text-gold-light">¡Gracias! Ya quedaste en la lista.</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-3.5 flex items-center border-b border-cream/35 pb-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo"
                  disabled={loading}
                  className="flex-1 bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="text-[0.85rem] uppercase tracking-[0.05em] text-gold-light disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-6 text-center text-[0.78rem]">
          <span>© 2026 Amatista Velas y Aromas</span>
        </div>
         <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-center text-[0.78rem] text-cream/55">
          <span>GC - Desarrollado por GlobalCode</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
