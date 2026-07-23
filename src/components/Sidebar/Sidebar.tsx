import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// Adicionando ícone da posição (do Position.tsx)
const PositionIcon = ({
  className = "w-7 h-7",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      d="M12 2l7 7-7 13-7-13z"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Novo SVG de Departamento baseado em @Department.tsx (21-43)
const DepartmentIcon = ({
  className = "w-7 h-7",
}: {
  className?: string;
}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <rect
      x={4}
      y={4}
      width={16}
      height={16}
      rx={3}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8v8M15 8v8M4 12h16"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
  const [isMobile, setIsMobile] = React.useState(true);

  useEffect(() => {
    // Função para atualizar if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Garante que o sidebar inicia fechado ao montar no mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
    // Só executar quando montar inicialmente ou mudar para mobile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Quando iniciar em telas grandes (PC), iniciar o sidebar recolhido
  useEffect(() => {
    // Só tenta setar o estado na montagem inicial
    if (!isMobile && !isCollapsed) {
      setIsCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Quando for mobile, ignorar isCollapsed (sempre mostrar labels)
  const collapsed = isMobile ? false : isCollapsed;

  // Para destacar o link ativo (opcional)
  const location = useLocation();

  // Adaptação do menu com as rotas reais do router.tsx
  // ("/", "/departments", "/departments/:id", "/positions", "*")
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
          <Link
            to="/"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200
              ${location.pathname === "/" ? "bg-gray-200 font-semibold" : ""}`}
            title="Dashboard"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0 4h2v-2H3v2zm4 0h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2v-2H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm4 4h2v-2h-2v2zm0-4h2v-2h-2v2z" />
              </svg>
            </span>
            {!collapsed && "Dashboard"}
          </Link>
          <Link
            to="/departments"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200
              ${location.pathname.startsWith("/departments") ? "bg-gray-200 font-semibold" : ""}`}
            title="Departamentos"
          >
            <span>
              {/* Novo SVG de Departamento */}
              <DepartmentIcon />
            </span>
            {!collapsed && "Departamentos"}
          </Link>
          {/* Nenhuma rota para employees em router.tsx, mas mantém visual */}
          <a
            href="/employees"
            className="flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200 opacity-60 pointer-events-none"
            title="Funcionários (em breve)"
            tabIndex={-1}
            aria-disabled="true"
          >
            <span>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!collapsed && <span className="italic">Funcionários</span>}
          </a>
          <Link
            to="/positions"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full hover:bg-gray-200
              ${location.pathname.startsWith("/positions") ? "bg-gray-200 font-semibold" : ""}`}
            title="Cargos"
          >
            <span>
              <PositionIcon />
            </span>
            {!collapsed && "Cargos"}
          </Link>
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