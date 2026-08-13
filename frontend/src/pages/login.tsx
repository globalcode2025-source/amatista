import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(122,92,148,0.35),transparent_55%),linear-gradient(180deg,#2a1735_0%,#241825_100%)] px-4 py-4 text-cream sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1180px] items-center justify-center sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">
        <section className="grid w-full overflow-hidden rounded-[24px] border border-cream/10 bg-cream/[0.06] shadow-[0_28px_80px_-35px_rgba(0,0,0,0.55)] xl:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#362043_0%,#2a1735_55%,#241825_100%)] p-8 lg:p-10 xl:flex xl:flex-col xl:justify-between">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25" />
              <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/10" />
            </div>

            <div className="relative z-[1] flex items-center gap-2 font-serif text-[1rem] font-medium tracking-[0.03em] text-cream/90">
              
              Amatista
            </div>

            <div className="relative z-[1] max-w-[420px] pt-12 xl:pt-0">
              <span className="font-hand text-[1.5rem] text-gold-light">Accede a tu espacio</span>
              <h1 className="mt-3 font-serif text-[clamp(2.4rem,4vw,3.4rem)] font-semibold leading-[1.03]">
                Bienvenida de vuelta a Amatista
              </h1>
              <p className="mt-4 max-w-[34ch] leading-[1.75] text-cream/72">
                Ingresa para gestionar pedidos, revisar tu comunidad y volver a tus rituales favoritos.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10 xl:p-14">
            <div className="w-full max-w-[520px] rounded-[24px] border border-cream/10 bg-[#f8f3ec] px-5 py-7 text-ink shadow-[0_18px_60px_-35px_rgba(0,0,0,0.45)] sm:px-8 sm:py-10">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-hand text-[1.35rem] text-gold">Iniciar sesión</span>
                  <h2 className="mt-1 font-serif text-[clamp(1.8rem,4vw,2rem)] font-semibold text-ink">Amatista</h2>
                </div>
                <Link
                  to="/#inicio"
                  className="text-sm uppercase tracking-[0.06em] text-amatista-mid transition-colors hover:text-amatista-deep"
                >
                  Volver
                </Link>
              </div>

              <form className="space-y-4 sm:space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm uppercase tracking-[0.06em] text-ink/60">Usuario</span>
                  <input
                    type="text"
                    placeholder="Tu usuario"
                    className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold sm:px-4 sm:py-3.5"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm uppercase tracking-[0.06em] text-ink/60">Contraseña</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-gold sm:px-4 sm:py-3.5"
                  />
                </label>

                <button
                  type="button"
                  className="mt-2 w-full rounded-xl bg-amatista-deep px-5 py-3.5 text-sm uppercase tracking-[0.08em] text-cream transition-all duration-300 hover:bg-gold hover:text-ink"
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
