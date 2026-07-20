import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 p-6 z-50 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div className="bg-white p-10 rounded-4xl shadow-lg border border-gray-200 text-center max-w-2xl w-full sm:max-w-3xl">
        <div className="mb-6 flex justify-center">
          <svg
            width={72}
            height={72}
            viewBox="0 0 72 72"
            fill="none"
            className="text-gray-400"
            aria-hidden="true"
          >
            <circle
              cx="36"
              cy="36"
              r="33"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="#f3f4f6"
            />
            <path
              d="M36 24v18"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="36" cy="48" r="2.5" fill="#ef4444" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-red-600 mb-2 select-none">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
          Página Não Encontrada
        </h2>
        <p className="text-gray-600 mb-6 text-base sm:text-lg">
          A página que você está tentando acessar não existe ou foi movida.
          <br />
          <span className="block mt-2">
            Caso acredite que isso seja um engano, entre em contato com o suporte técnico ou verifique a URL digitada.
          </span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-block px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            Voltar para a Página Inicial
          </Link>
          <a
            href="mailto:suporte@empresa.com"
            className="inline-block px-5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
            tabIndex={0}
          >
            Contatar Suporte
          </a>
        </div>
        <div className="text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} CorpSystem. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default NotFound;