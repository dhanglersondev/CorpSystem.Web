import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import {
  departmentService,
  type DepartmentResponseDto,
  type DepartmentCreateDto,
  type DepartmentUpdateDto,
} from "../../services/departmentService";
import NotFound from "../NotFound/NotFound";

// Função para obter link de detalhes do departamento
const getDepartmentDetailLink = (id: number) => `/departments/${id}`;

// SVG Department Icon (mesmo do Sidebar)
const DepartmentIcon = ({
  className = "w-8 h-8",
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
      d="M4 6v16h16V6M4 6L12 2l8 4"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// StatusBadge com estilo igual ao de Position.tsx
const StatusBadge = ({ active }: { active: boolean }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium text-xs 
      ${
        active
          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      } transition duration-150`}
  >
    <span
      className={`w-2 h-2 rounded-full 
        ${active ? "bg-emerald-400" : "bg-red-400"}
        border border-white shadow`}
    />
    {active ? "Ativo" : "Inativo"}
  </span>
);

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // For edit panel
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  // For create panel
  const [newDeptValue, setNewDeptValue] = useState<string>("");
  // For delete panel
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // For modals
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  const navigate = useNavigate();

  // Fetch departments from API
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);

      // If the API returns 404 or an empty array when this is a "not found" situation
      if (Array.isArray(data) && data.length === 0) {
        // Optional: Only treat as not found if some condition applies
        // Uncomment next line ONLY IF an empty list is "not found" for your context
        // setNotFound(true);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Erro ao carregar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line
  }, []);

  const handleEditClick = (id: number, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
    setShowEditPanel(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = async () => {
    if (editingId != null && editValue.trim()) {
      const departmentToUpdate = departments.find((d) => d.id === editingId);
      if (!departmentToUpdate) return;

      const updateDto: DepartmentUpdateDto = {
        name: editValue.trim(),
        isActive: departmentToUpdate.isActive, // or true by default
      };

      try {
        await departmentService.updateDepartment(editingId, updateDto);
        await fetchDepartments();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao editar o departamento.");
        }
      }
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

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await departmentService.deleteDepartment(deleteId);
        await fetchDepartments();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao excluir o departamento.");
        }
      }
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

  const handleCreate = async () => {
    if (newDeptValue.trim()) {
      const createDto: DepartmentCreateDto = {
        name: newDeptValue.trim(),
        isActive: true,
      };
      try {
        await departmentService.createDepartment(createDto);
        await fetchDepartments();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao criar departamento.");
        }
      }
    }
    setNewDeptValue("");
    setShowCreatePanel(false);
  };

  const handleCreateCancel = () => {
    setNewDeptValue("");
    setShowCreatePanel(false);
  };

  // Handler para redirecionar para a página de detalhes do departamento
  const handleDepartmentSelect = (id: number) => {
    navigate(getDepartmentDetailLink(id));
  };

  // If the page is not found (API 404 or forced condition), render NotFound
  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center py-10 px-4">
      <section className="w-full max-w-5xl rounded-3xl bg-white border border-gray-200 shadow-lg flex flex-col px-6 py-8 gap-6 transition-all duration-300">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-8 w-full">
          <span className="flex items-center gap-3 sm:gap-6">
            <span className="text-blue-700 drop-shadow-lg">
              <DepartmentIcon className="w-12 h-12 sm:w-14 sm:h-14" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow">
              Departamentos
            </h1>
          </span>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5 py-2.5 shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base sm:text-lg w-full sm:w-auto justify-center"
            onClick={openCreatePanel}
            aria-label="Criar novo departamento"
            title="Criar novo departamento"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10 5v10M5 10h10"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Novo Departamento
            <span className="sr-only">
              Adicionar um novo departamento à lista
            </span>
          </button>
        </div>
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-5 py-3 font-bold mb-2 text-center">
            {error}
          </div>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow">
          <table className="min-w-full bg-white text-base sm:text-lg border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-5 py-4 text-left text-gray-400 font-semibold tracking-wider w-10 sm:w-16 rounded-tl-xl">
                  #
                </th>
                <th className="px-5 py-4 text-left text-gray-700 font-bold tracking-wider">
                  Nome do Departamento
                </th>
                <th className="px-5 py-4 text-left text-gray-700 font-bold tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-gray-700 font-bold tracking-wider rounded-tr-xl">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-16 text-center text-gray-400 text-lg sm:text-xl font-medium"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-16 text-center text-gray-500 text-lg sm:text-xl font-medium"
                  >
                    Nenhum departamento encontrado.
                  </td>
                </tr>
              ) : (
                departments.map((department, idx) => (
                  <tr
                    key={department.id}
                    className="border-t border-gray-100 hover:bg-blue-50/20 transition-colors"
                  >
                    <td className="px-5 py-4 align-middle text-gray-500 font-semibold text-center">{idx + 1}</td>
                    <td className="px-5 py-4 align-middle">
                      <button
                        type="button"
                        className="font-bold text-blue-700 hover:text-blue-900 hover:underline underline-offset-4 transition focus:outline-none focus:ring-2 focus:ring-blue-400 w-full text-left"
                        tabIndex={0}
                        onClick={() => handleDepartmentSelect(department.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleDepartmentSelect(department.id);
                          }
                        }}
                        aria-label={`Ver detalhes do departamento ${department.name}`}
                        title={`Ver detalhes do departamento ${department.name}`}
                      >
                        {department.name}
                      </button>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <StatusBadge active={!!department.isActive} />
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap align-middle">
                      <div className="flex justify-end gap-3">
                        {/* Editar */}
                        <button
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 text-sm font-bold shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          title="Editar departamento"
                          aria-label="Editar departamento"
                          onClick={() =>
                            handleEditClick(department.id, department.name)
                          }
                        >
                          <svg
                            width={20}
                            height={20}
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
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-bold shadow-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Excluir departamento"
                          aria-label="Excluir departamento"
                          onClick={() => handleDelete(department.id)}
                        >
                          <svg
                            width={20}
                            height={20}
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
                            <path
                              d="M4 6h12"
                              strokeWidth={2}
                              strokeLinecap="round"
                            />
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
          className="border border-gray-300 rounded-lg px-4 py-3 min-w-0 w-full sm:min-w-[250px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base placeholder-gray-400 bg-gray-50 font-medium transition"
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
          className="border border-gray-300 rounded-lg px-4 py-3 min-w-0 w-full sm:min-w-[250px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base placeholder-gray-400 bg-gray-50 font-medium transition"
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
        <p className="text-gray-700 text-base font-semibold text-center">
          Tem certeza que deseja excluir este departamento?
        </p>
      </ActionPanel>
    </div>
  );
};

export default DepartmentPage;