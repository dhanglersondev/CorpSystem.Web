import { useState } from "react";
import ActionPanel from "../../components/ActionPanel/ActionPanel";

// Links de navegação
const getDepartmentLink = (id: number) => `/departments/${id}`;

type Department = {
  id: number;
  name: string;
};

const initialDepartments: Department[] = [
  { id: 1, name: "Recursos Humanos" },
  { id: 2, name: "Financeiro" },
  { id: 3, name: "Tecnologia da Informação" },
  { id: 4, name: "Marketing" },
];

// SVG Department Icon (mesmo do Sidebar)
const DepartmentIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      d="M4 6v16h16V6M4 6L12 2l8 4"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [newDeptValue, setNewDeptValue] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // For modals
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const handleEditClick = (id: number, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
    setShowEditPanel(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = () => {
    if (editingId != null) {
      setDepartments((prev) =>
        prev.map((dep) =>
          dep.id === editingId ? { ...dep, name: editValue.trim() || dep.name } : dep
        )
      );
    }
    setEditingId(null);
    setEditValue("");
    setShowEditPanel(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
    setShowEditPanel(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setDepartments((prev) => prev.filter((dep) => dep.id !== deleteId));
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDeptValue(e.target.value);
  };

  const openCreatePanel = () => {
    setShowCreatePanel(true);
    setNewDeptValue("");
  };

  const handleCreate = () => {
    if (newDeptValue.trim()) {
      setDepartments((prev) => [
        ...prev,
        { id: prev.length > 0 ? Math.max(...prev.map(d => d.id)) + 1 : 1, name: newDeptValue.trim() },
      ]);
    }
    setNewDeptValue("");
    setShowCreatePanel(false);
  };

  const handleCreateCancel = () => {
    setNewDeptValue("");
    setShowCreatePanel(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:py-10">
      <section className="w-full max-w-5xl shadow rounded-2xl bg-white border border-gray-200 flex flex-col px-3 py-5 sm:px-8 sm:py-8 gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 w-full">
          <span className="flex items-center gap-2 sm:gap-4">
            <span className="text-blue-700">
              <DepartmentIcon className="w-9 h-9 sm:w-12 sm:h-12" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow-sm">
              Departamentos
            </h1>
          </span>
          <button
            className="flex items-center bg-blue-600 text-white font-semibold rounded px-3 py-2 sm:px-4 hover:bg-blue-700 transition text-sm sm:text-base shadow w-full sm:w-auto justify-center"
            onClick={openCreatePanel}
            aria-label="Criar novo departamento"
            title="Criar novo departamento"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path d="M10 5v10M5 10h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Novo Departamento
            <span className="sr-only">Adicionar um novo departamento à lista</span>
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold w-8 sm:w-auto">#</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Nome do Departamento</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg"
                  >
                    Nenhum departamento encontrado.
                  </td>
                </tr>
              ) : (
                departments.map((department, idx) => (
                  <tr
                    key={department.id}
                    className="border-t last:border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">{idx + 1}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      <a
                        href={getDepartmentLink(department.id)}
                        className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                        tabIndex={0}
                      >
                        {department.name}
                      </a>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {/* Editar */}
                        <button
                          className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded hover:bg-yellow-500 transition text-xs sm:text-sm"
                          title="Editar departamento"
                          aria-label="Editar departamento"
                          onClick={() => handleEditClick(department.id, department.name)}
                        >
                          <svg
                            width={16}
                            height={16}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M13.586 3.586a2 2 0 112.828 2.828l-8.27 8.27A2 2 0 016 16H4v-2a2 2 0 01.586-1.414l8.27-8.27z"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="hidden sm:inline">Editar</span>
                        </button>

                        {/* Excluir */}
                        <button
                          className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs sm:text-sm"
                          title="Excluir departamento"
                          aria-label="Excluir departamento"
                          onClick={() => handleDelete(department.id)}
                        >
                          <svg
                            width={16}
                            height={16}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M6 6v10a2 2 0 002 2h4a2 2 0 002-2V6M9 10v4m4-4v4M9 6V4a1 1 0 011-1h0a1 1 0 011 1v2"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path d="M4 6h12" strokeWidth={2} strokeLinecap="round" />
                          </svg>
                          <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Painel de Edição */}
      <ActionPanel
        open={showEditPanel}
        onConfirm={handleEditSave}
        onCancel={handleEditCancel}
        onClose={handleEditCancel}
        type="edit"
        title="Editar Departamento"
      >
        <input
          className="border rounded px-3 py-1 min-w-0 w-full sm:min-w-[180px] focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          value={editValue}
          onChange={handleEditChange}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSave();
            if (e.key === "Escape") handleEditCancel();
          }}
        />
      </ActionPanel>

      {/* Painel de Criação */}
      <ActionPanel
        open={showCreatePanel}
        onConfirm={handleCreate}
        onCancel={handleCreateCancel}
        onClose={handleCreateCancel}
        type="new"
        title="Novo Departamento"
      >
        <input
          className="border rounded px-3 py-1 min-w-0 w-full sm:min-w-[180px] focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          placeholder="Nome do novo departamento"
          value={newDeptValue}
          onChange={handleCreateChange}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCreate();
            if (e.key === "Escape") handleCreateCancel();
          }}
        />
      </ActionPanel>

      {/* Painel de Exclusão */}
      <ActionPanel
        open={deleteId !== null}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        onClose={cancelDelete}
        type="delete"
        title="Confirmação de Exclusão"
        confirmText="Excluir"
      >
        <p>Tem certeza que deseja excluir este departamento?</p>
      </ActionPanel>
    </div>
  );
};

export default DepartmentPage;