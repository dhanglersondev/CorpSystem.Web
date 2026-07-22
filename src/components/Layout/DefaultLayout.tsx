import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

const DefaultLayout = () => {
  // Estado para o sidebar mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado para expandido/recolhido no desktop
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Backdrop para mobile ao abrir o sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar agora recebe ambos os estados e setters */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Conteúdo principal acompanha a largura do sidebar */}
      <div
        className={`
          flex
          flex-col
          flex-1
          transition-all
          duration-300
          min-h-screen
          ${
            isCollapsed
              ? "lg:ml-20"
              : "lg:ml-64"
          }
        `}
      >
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DefaultLayout;