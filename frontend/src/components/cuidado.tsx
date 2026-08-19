import { useEffect, useState } from 'react';
import { fetchCuidados } from '../services/cuidados';

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQS_FALLBACK: FaqItem[] = [
  {
    question: '¿Cuánto debo dejar quemar mi vela la primera vez?',
    answer:
      'Deja que la cera se derrita hasta los bordes del vaso, mínimo 1 hora, así evitas el "efecto túnel" y la vela quema pareja en cada uso.',
  },
  {
    question: '¿Cómo hago pedidos para eventos o matrimonios?',
    answer:
      'Escríbenos por el botón de contacto contándonos cantidad, fecha y aroma deseado — hacemos producciones personalizadas desde 20 unidades.',
  },
  {
    question: '¿Hacen envíos a todo el país?',
    answer:
      'Sí, enviamos a toda Colombia. Los pedidos se despachan en 2-3 días hábiles con empaque protegido para que llegue intacta.',
  },
  {
    question: '¿Puedo reservar un taller para un grupo privado?',
    answer:
      'Claro — organizamos despedidas de soltera, cumpleaños y actividades de bienestar empresarial. Cuéntanos tu fecha ideal por Contacto.',
  },
];

export function Cuidado() {
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQS_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCuidados = async () => {
      try {
        const data = await fetchCuidados();
        if (data && data.length > 0) {
          // Ordenar por el campo orden y convertir al formato esperado
          const sorted = data
            .sort((a, b) => a.orden - b.orden)
            .map((c) => ({
              question: c.pregunta,
              answer: c.respuesta,
            }));
          setFaqs(sorted);
        }
      } catch (error) {
        console.error('Error al cargar cuidados:', error);
        // Mantener los datos fallback si hay error
      } finally {
        setLoading(false);
      }
    };

    loadCuidados();
  }, []);

  return (
    <section id="cuidado" className="bg-cream py-[120px]">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-16 max-w-[640px]">
          <span className="font-hand text-[1.3rem] text-gold">Para que dure y arda mejor</span>
          <h2 className="mt-2 font-serif text-[clamp(2.1rem,3.6vw,3rem)] font-semibold text-ink">
            Cuidado de tus velas
          </h2>
          <p className="mt-4 leading-relaxed text-ink/68">
            Todo lo que necesitas saber para que tu vela artesanal luzca y huela como el primer día.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-[50px] gap-y-5 md:grid-cols-2">
          {faqs.map((faq, i) => (
            <details
              key={faq.question}
              className="group border-b border-ink/14 py-[22px]"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-[1.08rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="ml-3.5 text-[1.4rem] text-gold transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[480px] text-[0.92rem] leading-[1.65] text-ink/65">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Cuidado;