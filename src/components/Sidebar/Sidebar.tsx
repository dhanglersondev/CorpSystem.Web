import React from "react";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  // Detecta se está em mobile (width < 1024px)
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Função para atualizar if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Quando for mobile, ignorar isCollapsed (sempre mostrar labels)
  const collapsed = isMobile ? false : isCollapsed;

  return (
    <aside
      className={`
        fixed
        top-0
        left-0
        h-screen
        bg-white
        z-50
        border-r border-gray-200
        transition-all
        duration-300
        flex flex-col justify-between
        p-4
        text-slate-900
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${collapsed ? "lg:w-20" : "lg:w-64"}
      `}
      aria-label="Sidebar de navegação"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-xl font-bold">Gerenciamento</h2>
          )}
          {/* Botão para fechar o sidebar no mobile */}
          <button
            className="lg:hidden text-slate-700 ml-2 rounded hover:bg-gray-200 p-2 transition"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
            type="button"
          >
            &#10005;
          </button>
          {/* Botão para colapsar/expandir no desktop (desabilitado no mobile) */}
          <button
            className="hidden lg:flex text-slate-700 ml-2 rounded hover:bg-gray-200 p-2 transition"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expandir Sidebar" : "Colapsar Sidebar"}
            type="button"
            disabled={isMobile}
            tabIndex={isMobile ? -1 : 0}
            style={isMobile ? { opacity: 0.5, pointerEvents: "none" } : {}}
          >
            {/* Ícone adequado para indicar o estado */}
            {collapsed ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* Setinha apontando para a direita */}
                <path d="M10 6l6 6-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {/* Setinha apontando para a esquerda */}
                <path d="M14 6l-6 6 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        <nav className="space-y-2 flex flex-col items-stretch mt-8">
          <a
            href="/"
            className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
            title="Dashboard"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0 4h2v-2H3v2zm4 0h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2v-2H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm4 4h2v-2h-2v2zm0-4h2v-2h-2v2z" />
              </svg>
            </span>
            {!collapsed && "Dashboard"}
          </a>
          <a
            href="/departments"
            className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
            title="Departamentos"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6v16h16V6M4 6L12 2l8 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!collapsed && "Departamentos"}
          </a>
          <a
            href="/employees"
            className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
            title="Funcionários"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!collapsed && "Funcionários"}
          </a>
          <a
            href="/positions"
            className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
            title="Cargo"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="8" y="9" width="8" height="6" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15v4M10 19h4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {!collapsed && "Cargo"}
          </a>
        </nav>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col gap-2 items-start">
        <a
          href="/theme"
          className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
          title="Thema"
        >
          <span>
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12.79A9 9 0 1111.21 3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {!collapsed && "Thema"}
        </a>
        <a
          href="/settings"
          className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200"
          title="Configurações"
        >
          <span>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M19.4 15A1.65 1.65 0 0121 17.1a1.65 1.65 0 01-1.5 2.4c-.57 0-1.07-.21-1.5-.6a2 2 0 01-2.7 0 2 2 0 010-2.7c.39-.43.6-.93.6-1.5a1.65 1.65 0 01-2.4-1.5c0-.57.21-1.07.6-1.5a2 2 0 012.7 0 2 2 0 010 2.7c-.43.39-.93.6-1.5.6a1.65 1.65 0 011.5-2.4c.57 0 1.07.21 1.5.6a2 2 0 012.7 0 2 2 0 010 2.7c-.39.43-.6.93-.6 1.5z"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {!collapsed && "Configurações"}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;