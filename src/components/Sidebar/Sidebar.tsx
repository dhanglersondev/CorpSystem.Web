import { useState } from "react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sidebar reduzida: w-[4.75rem] (~76px, ~19 unidades Tailwind de 4px), expandida: w-52 (~13rem)
  // minWidth acompanhando o valor customizado/expandido
  return (
    <aside
      className={`bg-white text-slate-900 p-4 flex flex-col transition-all duration-200 justify-between border-r border-gray-200 ${
        isCollapsed ? "w-[4.75rem]" : "w-52"
      }`}
      style={{ minWidth: isCollapsed ? "4.75rem" : "13rem" }}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="text-xl font-bold">CorpSystem</h2>
          )}
          <button
            className="text-slate-700 focus:outline-none ml-auto rounded hover:bg-gray-200 p-1 transition disabled:opacity-50"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            onClick={() => setIsCollapsed((c) => !c)}
          >
            <span className="w-7 h-7 flex items-center justify-center">
              {isCollapsed ? (
                <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" stroke="currentColor">
                  <path d="M8 6l4 4-4 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6" stroke="currentColor">
                  <path d="M12 6l-4 4 4 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Espaçamento extra acima do Dashboard */}
        <div className={`${isCollapsed ? "mb-2" : "mb-4"} mt-8`} />

        <nav className={`space-y-2 flex flex-col ${isCollapsed ? "items-center" : "items-stretch"}`}>
          <a
            href="/"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
              isCollapsed ? "justify-center text-xs" : ""
            } hover:bg-gray-200`}
            title="Dashboard"
          >
            <span>
              <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0 4h2v-2H3v2zm4 0h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2v-2H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm4 4h2v-2h-2v2zm0-4h2v-2h-2v2z" />
              </svg>
            </span>
            {!isCollapsed && "Dashboard"}
          </a>
          <a
            href="/departments"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
              isCollapsed ? "justify-center text-xs" : ""
            } hover:bg-gray-200`}
            title="Departamentos"
          >
            <span>
              <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6v16h16V6M4 6L12 2l8 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!isCollapsed && "Departamentos"}
          </a>
          <a
            href="/employees"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
              isCollapsed ? "justify-center text-xs" : ""
            } hover:bg-gray-200`}
            title="Funcionários"
          >
            <span>
              <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {!isCollapsed && "Funcionários"}
          </a>
          <a
            href="/positions"
            className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
              isCollapsed ? "justify-center text-xs" : ""
            } hover:bg-gray-200`}
            title="Cargo"
          >
            <span>
              <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="8" y="9" width="8" height="6" rx="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15v4M10 19h4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {!isCollapsed && "Cargo"}
          </a>
        </nav>
      </div>
      {/* Footer: Thema acima de Configurações */}
      <div className={`mt-6 pt-6 border-t border-gray-200 flex flex-col gap-2 ${isCollapsed ? "items-center" : "items-start"}`}>
        <a
          href="/theme"
          className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
            isCollapsed ? "justify-center text-xs" : ""
          } hover:bg-gray-200`}
          title="Thema"
        >
          <span>
            <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12.79A9 9 0 1111.21 3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {!isCollapsed && "Thema"}
        </a>
        <a
          href="/settings"
          className={`flex items-center gap-3 px-2 py-1 rounded transition text-md w-full ${
            isCollapsed ? "justify-center text-xs" : ""
          } hover:bg-gray-200`}
          title="Configurações"
        >
          <span>
            <svg className={`${isCollapsed ? "mx-auto" : ""} w-7 h-7`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M19.4 15A1.65 1.65 0 0121 17.1a1.65 1.65 0 01-1.5 2.4c-.57 0-1.07-.21-1.5-.6a2 2 0 01-2.7 0 2 2 0 010-2.7c.39-.43.6-.93.6-1.5a1.65 1.65 0 01-2.4-1.5c0-.57.21-1.07.6-1.5a2 2 0 012.7 0 2 2 0 010 2.7c-.43.39-.93.6-1.5.6a1.65 1.65 0 011.5-2.4c.57 0 1.07.21 1.5.6a2 2 0 012.7 0 2 2 0 010 2.7c-.39.43-.6.93-.6 1.5z"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {!isCollapsed && "Configurações"}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;