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
import { Reveal } from '../components/Reveal';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Seam variant={1} background="cream" />
      <Reveal>
        <Productos />
      </Reveal>
      <Reveal delay={100}>
        <Eventos />
      </Reveal>
      <Reveal delay={200}>
        <Galeria />
      </Reveal>
      <Reveal delay={300}>
        <Testimonios />
      </Reveal>
      <Reveal delay={400}>
        <Historia />
      </Reveal>
      <Reveal delay={500}>
        <Ubicacion />
      </Reveal>
      <Reveal delay={600}>
        <Cuidado />
      </Reveal>
      <Footer />
    </>
  );
}