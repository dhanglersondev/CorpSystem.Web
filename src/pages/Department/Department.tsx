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

// Icon igual Employee (departamento/caixa)
const DepartmentIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="#7c3aed"
  >
    <rect
      x={4}
      y={4}
      width={16}
      height={16}
      rx={3}
      strokeWidth={2}
      stroke="#8A0BDE"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 8v8M15 8v8M4 12h16"
      strokeWidth={2}
      stroke="#8A0BDE"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Badge visual status (igual Position)
function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-block text-green-700 bg-green-100 rounded px-2 py-1 text-xs font-semibold">Ativo</span>
    );
  }
  return (
    <span className="inline-block text-red-700 bg-red-100 rounded px-2 py-1 text-xs font-semibold">Inativo</span>
  );
}

function getDepartmentDetailLink(id: number) {
  return `/departments/${id}`;
}

interface AxiosError {
  response?: {
    status?: number;
  };
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingStatus, setEditingStatus] = useState(true);
  const [showEditPanel, setShowEditPanel] = useState(false);

  // Create states
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentStatus, setNewDepartmentStatus] = useState(true);

  // Delete states
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  // Carregar todos
  async function fetchDepartments() {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data || []);
    } catch (err) {
      const errorObj = err as AxiosError;
      if (errorObj?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Erro ao carregar departamentos");
    } finally {
      setLoading(false);
    }
  }

  // Avoid calling setState synchronously inside effect
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    departmentService
      .getDepartments()
      .then(data => {
        if (!cancelled) {
          setDepartments(data || []);
        }
      })
      .catch(err => {
        if (!cancelled) {
          const errorObj = err as AxiosError;
          if (errorObj?.response?.status === 404) {
            setNotFound(true);
            return;
          }
          setError("Erro ao carregar departamentos");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Editar
  function openEditPanel(id: number, currentName: string, isActive: boolean) {
    setEditingId(id);
    setEditingName(currentName);
    setEditingStatus(isActive);
    setShowEditPanel(true);
  }
  function closeEditPanel() {
    setEditingId(null);
    setEditingName("");
    setEditingStatus(true);
    setShowEditPanel(false);
  }
  async function handleEditSave() {
    if (
      editingId != null &&
      editingName.trim() !== "" &&
      typeof editingStatus === "boolean"
    ) {
      const updateDto: DepartmentUpdateDto = {
        name: editingName.trim(),
        isActive: editingStatus,
      };
      try {
        await departmentService.updateDepartment(editingId, updateDto);
        await fetchDepartments();
      } catch (err) {
        const errorObj = err as AxiosError;
        if (errorObj?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao editar departamento.");
        }
      }
      closeEditPanel();
    }
  }

  // Criar
  function openCreatePanelHandler() {
    setShowCreatePanel(true);
    setNewDepartmentName("");
    setNewDepartmentStatus(true);
  }
  function closeCreatePanel() {
    setShowCreatePanel(false);
    setNewDepartmentName("");
    setNewDepartmentStatus(true);
  }
  async function handleCreate() {
    if (newDepartmentName.trim() !== "") {
      const createDto: DepartmentCreateDto = {
        name: newDepartmentName.trim(),
        isActive: newDepartmentStatus,
      };
      try {
        await departmentService.createDepartment(createDto);
        await fetchDepartments();
      } catch (err) {
        const errorObj = err as AxiosError;
        if (errorObj?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao criar departamento.");
        }
      }
      closeCreatePanel();
    }
  }

  // Remover
  function handleDelete(id: number) {
    setDeleteId(id);
  }
  function cancelDelete() {
    setDeleteId(null);
  }
  async function confirmDelete() {
    if (deleteId != null) {
      try {
        await departmentService.deleteDepartment(deleteId);
        await fetchDepartments();
      } catch (err) {
        const errorObj = err as AxiosError;
        if (errorObj?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao excluir departamento.");
        }
      }
      cancelDelete();
    }
  }

  // Detalhes
  function handleSelectDepartment(id: number) {
    navigate(getDepartmentDetailLink(id));
  }

  if (notFound) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:py-14">
      <section className="w-full max-w-5xl shadow rounded-2xl bg-white border border-gray-200 flex flex-col px-5 py-8 sm:px-12 sm:py-10 gap-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">
          <span className="flex items-center gap-4 sm:gap-6">
            <span>
              <DepartmentIcon className="w-11 h-11 sm:w-14 sm:h-14" />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
              Departamentos
            </h1>
          </span>
          <button
            className="inline-flex items-center bg-emerald-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow hover:bg-emerald-700 transition-colors text-base gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            onClick={openCreatePanelHandler}
            aria-label="Criar novo departamento"
            title="Criar novo departamento"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path d="M10 5v10M5 10h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Novo Departamento
            <span className="sr-only">Adicionar um novo departamento à lista</span>
          </button>
        </div>

        {/* Erro */}
        {error && <div className="bg-red-100 text-red-800 rounded px-4 py-2 mb-4">{error}</div>}

        {/* Tabela */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold w-8 sm:w-auto">#</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Nome do Departamento</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-center text-gray-700 font-semibold">Status</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg">
                    Carregando...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg">
                    Nenhum departamento encontrado.
                  </td>
                </tr>
              ) : (
                departments.map((d, idx) => (
                  <tr key={d.id} className="border-t last:border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3 align-middle text-center">{idx + 1}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      <button
                        type="button"
                        className="text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-left"
                        tabIndex={0}
                        onClick={() => handleSelectDepartment(d.id)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault(); handleSelectDepartment(d.id);
                          }
                        }}
                        aria-label={`Ver detalhes do departamento ${d.name}`}
                        title={`Ver detalhes do departamento ${d.name}`}
                      >
                        {d.name}
                      </button>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle text-center">
                      <StatusBadge isActive={d.isActive} />
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {/* Editar */}
                        <button
                          className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium rounded-md px-3 py-1.5 shadow hover:bg-yellow-200 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          title="Editar departamento"
                          aria-label="Editar departamento"
                          type="button"
                          onClick={() => openEditPanel(d.id, d.name, d.isActive)}
                        >
                          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 20 20">
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
                          className="inline-flex items-center bg-red-50 text-red-700 font-medium rounded-md px-3 py-1.5 shadow hover:bg-red-100 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Excluir departamento"
                          aria-label="Excluir departamento"
                          type="button"
                          onClick={() => handleDelete(d.id)}
                        >
                          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 20 20">
                            <path d="M6 6v10a2 2 0 002 2h4a2 2 0 002-2V6M9 10v4m4-4v4M9 6V4a1 1 0 011-1h0a1 1 0 011 1v2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 6h12" strokeWidth={2} strokeLinecap="round"/>
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
        onCancel={closeEditPanel}
        onClose={closeEditPanel}
        type="edit"
        title="Editar Departamento"
      >
        <div className="flex flex-col gap-5">
          <input
            className="border rounded px-4 py-2 min-w-0 w-full sm:min-w-[220px] focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
            value={editingName}
            onChange={e => setEditingName(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") closeEditPanel();
            }}
          />
          <div className="flex flex-col gap-1">
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base"
              value={String(editingStatus)}
              onChange={e => setEditingStatus(e.target.value === "true")}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <div>
              <StatusBadge isActive={editingStatus} />
            </div>
          </div>
        </div>
      </ActionPanel>

      {/* Painel de Criação */}
      <ActionPanel
        open={showCreatePanel}
        onConfirm={handleCreate}
        onCancel={closeCreatePanel}
        onClose={closeCreatePanel}
        type="new"
        title="Novo Departamento"
      >
        <div className="flex flex-col gap-5">
          <input
            className="border rounded px-4 py-2 min-w-0 w-full sm:min-w-[220px] focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
            placeholder="Nome do novo departamento"
            value={newDepartmentName}
            onChange={e => setNewDepartmentName(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") closeCreatePanel();
            }}
          />
          <div className="flex flex-col gap-1">
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base"
              value={String(newDepartmentStatus)}
              onChange={e => setNewDepartmentStatus(e.target.value === "true")}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <div>
              <StatusBadge isActive={newDepartmentStatus} />
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
          <p className="text-base text-gray-800 text-center">
            Tem certeza que deseja excluir este departamento?
          </p>
        </div>
      </ActionPanel>
    </div>
  );
}