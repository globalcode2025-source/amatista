import Hero from '../components/hero';
import Nav from '../components/nav';
import Marquee from '../components/marquee';
import Seam from '../components/seam';
import Productos from '../components/productos';
import Eventos from '../components/eventos';
import Galeria from '../components/galeria';
import Testimonios from '../components/testimonios';
import Historia from '../components/historia';
import Ubicacion from '../components/ubicacion';
import Cuidado from '../components/cuidado';
import Footer from '../components/footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Seam variant={1} background="cream" />
      <Productos />
      <Eventos />
      <Galeria />
      <Testimonios />
      <Historia />
      <Ubicacion />
      <Cuidado />
      <Footer />
    </>
  );
}