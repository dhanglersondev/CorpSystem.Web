// Página Inicial do Sistema Corporativo

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-10 px-2 sm:px-6">
      <section className="w-full max-w-3xl shadow rounded-3xl bg-white border border-gray-200 flex flex-col items-center justify-center px-8 py-12 gap-4">
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="flex items-center justify-center mb-1">
            {/* Logo Corporativa */}
            <svg
              className="w-16 h-16"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Círculo central */}
              <circle cx="30" cy="30" r="28" fill="#2351A2" />
              {/* Três barras simbolizando crescimento */}
              <rect x="16" y="34" width="6" height="12" rx="2" fill="#3B82F6" />
              <rect x="27" y="24" width="6" height="22" rx="2" fill="#2563EB" />
              <rect x="38" y="18" width="6" height="28" rx="2" fill="#0EA5E9" />
              {/* Detalhe lateral */}
              <rect x="10" y="44" width="40" height="4" rx="2" fill="#60A5FA" />
            </svg>
          </span>
          <span className="text-xl font-bold text-gray-800 tracking-wide">CorpSystem</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center drop-shadow">
          Bem-vindo ao Painel de Gestão Corporativa
        </h1>
        <p className="max-w-2xl text-base md:text-lg text-gray-700 font-medium leading-relaxed text-center">
          Centralize a gestão de setores da sua empresa de modo profissional e seguro. Use o menu lateral para acessar módulos, monitorar indicadores e gerir departamentos, usuários e permissões.<br className="hidden sm:inline" />
          O CorpSystem foi criado para otimizar processos e simplificar decisões, apoiando o crescimento e a organização de empresas de todos os portes. Tenha controle total dos dados corporativos com colaboração e segurança em todos os níveis.
        </p>
      </section>
      <footer className="w-full flex justify-center mt-6">
        <div className="text-xs text-gray-400 text-center">
          &copy; {new Date().getFullYear()} CorpSystem. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default Home;