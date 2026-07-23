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

// SVG Department Icon
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

// Badge visual para status
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  isActive ? (
    <span className="inline-block text-green-700 bg-green-100 rounded px-3 py-1 text-sm font-semibold">Ativo</span>
  ) : (
    <span className="inline-block text-red-700 bg-red-100 rounded px-3 py-1 text-sm font-semibold">Inativo</span>
  )
);

const DepartmentPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Para painel de edição
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editStatus, setEditStatus] = useState<boolean>(true);

  // Para painel de criação
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newDepartmentValue, setNewDepartmentValue] = useState<string>("");
  const [newStatus, setNewStatus] = useState<boolean>(true);

  // Para painel de exclusão
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Para painel de edição
  const [showEditPanel, setShowEditPanel] = useState(false);

  const navigate = useNavigate();

  // Buscar departamentos da API
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);

      if (Array.isArray(data) && data.length === 0) {
        // setNotFound(true); // Habilite se necessário
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

  const handleEditClick = (id: number, currentName: string, isActive: boolean) => {
    setEditingId(id);
    setEditValue(currentName);
    setEditStatus(isActive);
    setShowEditPanel(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditStatus(e.target.value === "true");
  };

  const handleEditSave = async () => {
    if (
      editingId != null &&
      editValue.trim() !== "" &&
      typeof editStatus === "boolean"
    ) {
      const updateDto: DepartmentUpdateDto = {
        name: editValue.trim(),
        isActive: editStatus,
      };

      try {
        await departmentService.updateDepartment(editingId, updateDto);
        await fetchDepartments();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao editar departamento.");
        }
      }
    }
    setEditingId(null);
    setEditValue("");
    setEditStatus(true);
    setShowEditPanel(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
    setEditStatus(true);
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
    setNewDepartmentValue(e.target.value);
  };

  const handleCreateStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value === "true");
  };

  const openCreatePanel = () => {
    setShowCreatePanel(true);
    setNewDepartmentValue("");
    setNewStatus(true);
  };

  const handleCreate = async () => {
    if (newDepartmentValue.trim() !== "") {
      const createDto: DepartmentCreateDto = {
        name: newDepartmentValue.trim(),
        isActive: newStatus,
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
    setNewDepartmentValue("");
    setNewStatus(true);
    setShowCreatePanel(false);
  };

  const handleCreateCancel = () => {
    setNewDepartmentValue("");
    setNewStatus(true);
    setShowCreatePanel(false);
  };

  // Handler para redirecionar para detalhes
  const handleDepartmentSelect = (id: number) => {
    navigate(getDepartmentDetailLink(id));
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2 sm:py-14">
      <section className="w-full max-w-5xl shadow rounded-2xl bg-white border border-gray-200 flex flex-col px-5 py-8 sm:px-12 sm:py-10 gap-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
          <span className="flex items-center gap-4 sm:gap-6">
            <span className="text-blue-700">
              <DepartmentIcon className="w-11 h-11 sm:w-14 sm:h-14" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
              Departamentos
            </h1>
          </span>
          <button
            className="inline-flex items-center bg-emerald-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow hover:bg-emerald-700 transition-colors text-base gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            onClick={openCreatePanel}
            aria-label="Criar novo departamento"
            title="Criar novo departamento"
            type="button"
          >
            <svg
              className="w-5 h-5"
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
          <div className="bg-red-100 text-red-800 rounded px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-gray-700 font-semibold w-10 sm:w-16">#</th>
                <th className="px-4 py-3 text-left text-gray-700 font-semibold">Nome do Departamento</th>
                <th className="px-4 py-3 text-center text-gray-700 font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-400 text-lg"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-400 text-lg"
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
                    <td className="px-4 py-3 align-middle text-center">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <button
                        type="button"
                        className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-left"
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
                    <td className="px-4 py-3 align-middle text-center">
                      <StatusBadge isActive={department.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap align-middle">
                      <div className="flex justify-end gap-3">
                        {/* EDITAR */}
                        <button
                          className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium rounded-md px-4 py-2 shadow hover:bg-yellow-200 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          title="Editar departamento"
                          aria-label="Editar departamento"
                          type="button"
                          onClick={() =>
                            handleEditClick(
                              department.id,
                              department.name,
                              department.isActive
                            )
                          }
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

                        {/* EXCLUIR */}
                        <button
                          className="inline-flex items-center bg-red-50 text-red-700 font-medium rounded-md px-4 py-2 shadow hover:bg-red-100 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Excluir departamento"
                          aria-label="Excluir departamento"
                          type="button"
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
        <div className="flex flex-col gap-5">
          <input
            className="border rounded px-4 py-2 min-w-0 w-full sm:min-w-[220px] focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
            value={editValue}
            onChange={handleEditChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") handleEditCancel();
            }}
          />
          <div className="flex flex-col gap-1">
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base"
              value={String(editStatus)}
              onChange={handleEditStatusChange}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            {/* Detalhe visual do status selecionado */}
            <div>
              <StatusBadge isActive={editStatus} />
            </div>
          </div>
        </div>
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
        <div className="flex flex-col gap-5">
          <input
            className="border rounded px-4 py-2 min-w-0 w-full sm:min-w-[220px] focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
            placeholder="Nome do novo departamento"
            value={newDepartmentValue}
            onChange={handleCreateChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") handleCreateCancel();
            }}
          />
          <div className="flex flex-col gap-1">
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base"
              value={String(newStatus)}
              onChange={handleCreateStatusChange}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            {/* Detalhe visual do status selecionado */}
            <div>
              <StatusBadge isActive={newStatus} />
            </div>
          </div>
        </div>
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
        <div className="py-2 px-1">
          <p className="text-base text-gray-800 text-center">Tem certeza que deseja excluir este departamento?</p>
        </div>
      </ActionPanel>
    </div>
  );
};

export default DepartmentPage;