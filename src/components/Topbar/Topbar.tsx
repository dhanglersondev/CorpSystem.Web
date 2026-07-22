import { useState, useRef, useEffect } from "react";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Aqui vai a lógica de logout, por exemplo limpar token, redirecionar, etc.
    alert("Logout realizado!"); // substituir pelo seu fluxo real
  };

  // Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm relative z-20">
      {/* Botão ☰ no mobile apenas */}
      <button
        onClick={onMenuClick}
        className="lg:hidden mr-3 p-2 rounded hover:bg-gray-100 transition"
        aria-label="Abrir menu"
        type="button"
      >
        <span className="text-2xl leading-none font-bold">☰</span>
      </button>
      <div className="flex items-center gap-3">
        <svg className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="19" fill="#2563EB" />
          <rect x="10" y="23" width="4" height="10" rx="2" fill="#60A5FA" />
          <rect x="18" y="16" width="4" height="17" rx="2" fill="#3B82F6" />
          <rect x="26" y="11" width="4" height="22" rx="2" fill="#1D4ED8" />
        </svg>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-800 select-none">
          CorpSystem
        </h1>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition px-3 py-1.5 hover:bg-blue-50 hover:shadow border border-blue-100 active:scale-95 duration-100"
          aria-label="Menu do perfil"
        >
          <span className="w-9 h-9 flex items-center justify-center bg-gradient-to-tr from-blue-300 via-blue-100 to-blue-200 text-blue-900 rounded-full font-bold ring-[2.5px] ring-blue-400 shadow inner-shadow-md">
            {/* Usuário/Avatar */}
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hidden md:inline text-base font-semibold text-gray-800">Meu Perfil</span>
          <svg className="ml-1 w-4 h-4 text-blue-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path d="M6 8l4 4 4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 min-w-[11rem] bg-white rounded-xl shadow-xl border border-blue-100 z-50 py-1 flex flex-col animate-fade-in-fast">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-bold ring-1 ring-blue-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <div className="font-medium text-gray-900 text-sm leading-tight">Usuário</div>
                  <div className="text-xs text-gray-500 leading-none">perfil@email.com</div>
                </div>
              </div>
            </div>
            <button
              className="w-full text-left px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition font-medium text-sm"
              onClick={() => {
                setShowMenu(false);
                // Aqui iria para a página de perfil
                alert("Ir para perfil (implementar)"); // Troque por navegação real
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path d="M10 12a5 5 0 100-10 5 5 0 000 10zM4 18a9 9 0 1112 0H4z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Perfil
              </div>
            </button>
            <button
              className="w-full text-left px-5 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition font-medium text-sm"
              onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path d="M17 16l-4-4m0 0l-4-4m4 4H3m13 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sair
              </div>
            </button>
          </div>
        )}
      </div>
      <style>
        {`
          .animate-fade-in-fast {
            animation: fadeInTop 0.17s cubic-bezier(.35,.92,.55,1) both;
          }
          @keyframes fadeInTop {
            0% { 
              opacity: 0;
              transform: translateY(-12px) scale(0.98);
            }
            100% { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .inner-shadow-md {
            box-shadow: inset 0 1.5px 3px rgba(22, 78, 99, 0.07);
          }
        `}
      </style>
    </header>
  );
};

export default Topbar;