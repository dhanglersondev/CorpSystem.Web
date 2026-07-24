import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { positionService } from "../../services/positionService";
import { departmentService } from "../../services/departmentService";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import NotFound from "../NotFound/NotFound";
import type {
  PositionResponseDto,
  PositionCreateDto,
  PositionUpdateDto
} from "../../services/positionService";
import type { DepartmentResponseDto } from "../../services/departmentService";

// Função para obter o link da página de departamento

// URL para página de detalhes do cargo (ID apenas)
const getPositionDetailLink = (position: PositionResponseDto) => {
  return `/positions/${position.id}`;
};

// Badge de status do cargo
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
    }`}
  >
    {isActive ? "Ativo" : "Inativo"}
  </span>
);

const PositionIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x={4} y={10} width={16} height={10} rx={2} strokeWidth={2} stroke="currentColor" />
    <path d="M12 4v6" strokeWidth={2} strokeLinecap="round" />
    <circle cx={12} cy={8} r={2} strokeWidth={2} stroke="currentColor" />
  </svg>
);

const PositionPage: React.FC = () => {
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filtro de departamento
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>("");

  const [newData, setNewData] = useState<
    Omit<PositionCreateDto, "departmentId"> & { departmentId: string }
  >({
    title: "",
    departmentId: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<
    Omit<PositionUpdateDto, "departmentId"> & { departmentId: string }
  >({
    title: "",
    departmentId: "",
    isActive: true,
  });

  interface ApiErrorResponse {
    response?: {
      status?: number;
      data?: { message?: string; errors?: Record<string, string[]> } | string;
    };
  }

  // Buscas iniciais
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [positionsList, departmentsList] = await Promise.all([
        positionService.getPositions(),
        departmentService.getDepartments(),
      ]);
      setPositions(positionsList);
      setDepartments(departmentsList);
      setNotFound(false);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      if (apiError?.response?.status === 404) setNotFound(true);
      else setError("Erro ao carregar cargos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const runFetchAll = async () => {
      await fetchAll();
    };
    runFetchAll();
  }, [fetchAll]);

  // --- CRIAÇÃO ---
  const handleCreateOpen = () => {
    setShowCreate(true);
    setNewData({
      title: "",
      departmentId: departments[0]?.id?.toString() || "",
      isActive: true,
    });
    setError(null);
  };

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  const handleCreateConfirm = async () => {
    let errMsg: string | null = null;
    if (!newData.title) errMsg = "O título do cargo é obrigatório.";
    else if (!newData.departmentId) errMsg = "O departamento é obrigatório.";
    if (errMsg) {
      setError(errMsg);
      return;
    }
    const dto: PositionCreateDto = {
      title: newData.title,
      departmentId: Number(newData.departmentId),
      isActive: !!newData.isActive,
    };
    try {
      await positionService.createPosition(dto);
      await fetchAll();
      setShowCreate(false);
      setNewData({
        title: "",
        departmentId: departments[0]?.id?.toString() || "",
        isActive: true,
      });
      setError(null);
    } catch (err: unknown) {
      let apiMsg: string | undefined | object =
        ((err as ApiErrorResponse)?.response &&
          (((err as ApiErrorResponse).response?.data as { message?: string })?.message ||
            (typeof (err as ApiErrorResponse).response?.data === "string" ? (err as ApiErrorResponse).response?.data : undefined))) ||
        "Erro ao criar cargo.";

      const errorsObj = (err as ApiErrorResponse)?.response?.data as { errors?: Record<string, string[]> };
      if (errorsObj && typeof errorsObj === "object" && errorsObj.errors) {
        apiMsg = Object.values(errorsObj.errors)
          .map((arr) => (Array.isArray(arr) ? arr.join("; ") : String(arr)))
          .join("; ");
      }
      setError(
        `Erro ao criar cargo${
          typeof apiMsg === "string"
            ? `: ${apiMsg}`
            : ". Verifique os dados informados."
        }`
      );
    }
  };

  const handleCreateCancel = () => {
    setShowCreate(false);
    setNewData({
      title: "",
      departmentId: departments[0]?.id?.toString() || "",
      isActive: true,
    });
    setError(null);
  };

  // --- EDIÇÃO ---
  const handleEditOpen = (position: PositionResponseDto) => {
    setEditingId(position.id);
    setEditData({
      title: position.title || "",
      departmentId: position.departmentId?.toString() || "",
      isActive: position.isActive,
    });
    setShowEdit(true);
    setError(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? value === "true"
          : value,
    }));
  };

  const handleEditConfirm = async () => {
    if (!editingId) return;
    if (
      !editData.title ||
      !editData.departmentId
    ) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    const dto: PositionUpdateDto = {
      title: editData.title,
      departmentId: Number(editData.departmentId),
      isActive: !!editData.isActive,
    };
    try {
      await positionService.updatePosition(editingId, dto);
      await fetchAll();
      setShowEdit(false);
      setEditingId(null);
      setError(null);
    } catch (err: unknown) {
      let apiMsg: string | undefined | object =
        ((err as ApiErrorResponse)?.response &&
          (((err as ApiErrorResponse).response?.data as { message?: string })?.message ||
            (typeof (err as ApiErrorResponse).response?.data === "string"
              ? (err as ApiErrorResponse).response?.data
              : undefined))) ||
        "Erro ao editar cargo.";

      const errorsObj = (err as ApiErrorResponse)?.response?.data as { errors?: Record<string, string[]> };
      if (errorsObj && typeof errorsObj === "object" && errorsObj.errors) {
        apiMsg = Object.values(errorsObj.errors)
          .map((arr) => (Array.isArray(arr) ? arr.join("; ") : String(arr)))
          .join("; ");
      }
      setError(
        `Erro ao editar cargo${
          typeof apiMsg === "string"
            ? `: ${apiMsg}`
            : ". Verifique os dados informados."
        }`
      );
    }
  };

  const handleEditCancel = () => {
    setShowEdit(false);
    setEditingId(null);
    setError(null);
  };

  // --- EXCLUSÃO ---
  const handleDeleteOpen = (id: number) => setDeleteId(id);

  const handleDeleteConfirm = async () => {
    if (deleteId == null) return;
    try {
      await positionService.deletePosition(deleteId);
      await fetchAll();
      setDeleteId(null);
      setError(null);
    } catch {
      setError("Erro ao excluir cargo.");
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setError(null);
  };

  // --- FILTRO ---
  // Removido filteredPositions pois apresentaremos listagem agrupada por departamento

  if (notFound) return <NotFound />;

  // Agrupar cargos por departamento
  const positionsByDepartment: Record<number, PositionResponseDto[]> = {};
  positions.forEach((pos) => {
    if (
      (!filterDepartmentId || pos.departmentId === Number(filterDepartmentId))
    ) {
      if (!positionsByDepartment[pos.departmentId]) {
        positionsByDepartment[pos.departmentId] = [];
      }
      positionsByDepartment[pos.departmentId].push(pos);
    }
  });

  // Lista de departamentos a serem exibidos (ordem do select/filtro), se houver filtro, só aquele dep, senão todos
  const shownDepartments = filterDepartmentId
    ? departments.filter((dep) => String(dep.id) === filterDepartmentId)
    : departments;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:py-14">
      <section className="w-full max-w-4xl bg-white shadow rounded-2xl border border-gray-200 px-5 py-8 sm:px-10 sm:py-10 flex flex-col gap-6">
        <div className="w-full flex flex-col gap-6 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-4 sm:gap-6">
              <span className="text-purple-700">
                <PositionIcon />
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
                Cargos
              </h1>
            </span>
            <button
              className="inline-flex items-center bg-emerald-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow hover:bg-emerald-700 transition-colors text-base gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              type="button"
              aria-label="Criar novo cargo"
              title="Criar novo cargo"
              onClick={handleCreateOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                <path d="M10 5v10M5 10h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Novo Cargo
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex flex-row items-center gap-4">
              <label htmlFor="filterDepartmentId" className="font-medium text-gray-700 text-sm mb-0">
                Filtrar por Departamento
              </label>
              <select
                id="filterDepartmentId"
                className="border rounded px-3 py-1 min-w-[160px] text-sm ml-0 sm:ml-2" // width e height igual do select de Employee
                value={filterDepartmentId}
                onChange={e => setFilterDepartmentId(e.target.value)}
              >
                <option value="">Todos</option>
                {departments.map(dep => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          {/* Listagem agrupada por departamento */}
          {loading ? (
            <div className="py-8 text-center text-gray-400 text-base sm:text-lg">
              Carregando...
            </div>
          ) : shownDepartments.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-base sm:text-lg">
              Nenhum departamento encontrado.
            </div>
          ) : (
            shownDepartments.map(dep => {
              const posList = positionsByDepartment[dep.id] || [];
              return (
                <div key={dep.id} className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                  </div>
                  {posList.length === 0 ? (
                    <div className="py-4 text-gray-400 text-base text-center">
                      Nenhum cargo neste departamento.
                    </div>
                  ) : (
                    <table className="min-w-full bg-white text-sm sm:text-base">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold w-8 sm:w-auto">#</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Título</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 text-center text-gray-700 font-semibold">Status</th>
                          <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-gray-700 font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posList.map((pos, idx) => (
                          <tr
                            key={pos.id}
                            className="border-t last:border-b hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 align-middle text-center">{idx + 1}</td>
                            <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                       
                              <Link
                                to={getPositionDetailLink(pos)}
                                style={{
                                  color: "#6366f1",
                                  textDecoration: "underline",
                                  cursor: "pointer"
                                }}
                                onClick={e => e.stopPropagation()}
                              >
                                {pos.title}
                              </Link>
                            </td>
                            <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle text-center">
                              <StatusBadge isActive={pos.isActive} />
                            </td>
                            <td className="px-2 py-2 sm:px-4 sm:py-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium rounded-md px-3 py-1.5 shadow hover:bg-yellow-200 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                  title="Editar cargo"
                                  aria-label="Editar cargo"
                                  onClick={() => handleEditOpen(pos)}
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
                                <button
                                  type="button"
                                  className="inline-flex items-center bg-red-50 text-red-700 font-medium rounded-md px-3 py-1.5 shadow hover:bg-red-100 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                                  title="Excluir cargo"
                                  aria-label="Excluir cargo"
                                  onClick={() => handleDeleteOpen(pos.id)}
                                >
                                  <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 20 20">
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
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Painel de Edição */}
      <ActionPanel
        open={showEdit}
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
        onClose={handleEditCancel}
        type="edit"
        title="Editar Cargo"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col font-medium text-gray-800">
            Título do Cargo
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              disabled={editingId == null}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Departamento
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="departmentId"
              value={editData.departmentId}
              onChange={handleEditChange}
              disabled={editingId == null}
            >
              <option value="" disabled>
                Selecione o departamento
              </option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Situação do Cargo
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="isActive"
              value={String(editData.isActive)}
              onChange={handleEditChange}
              disabled={editingId == null}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
        </div>
      </ActionPanel>

      {/* Painel de Criação */}
      <ActionPanel
        open={showCreate}
        onConfirm={handleCreateConfirm}
        onCancel={handleCreateCancel}
        onClose={handleCreateCancel}
        type="new"
        title="Novo Cargo"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col font-medium text-gray-800">
            Título do Cargo
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="title"
              value={newData.title}
              onChange={handleCreateChange}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Departamento
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="departmentId"
              value={newData.departmentId}
              onChange={handleCreateChange}
            >
              <option value="" disabled>
                Selecione o departamento
              </option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Situação do Cargo
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="isActive"
              value={String(newData.isActive)}
              onChange={handleCreateChange}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
        </div>
      </ActionPanel>

      {/* Painel de Exclusão */}
      <ActionPanel
        open={deleteId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        onClose={handleDeleteCancel}
        type="delete"
        title="Confirmação de Exclusão"
        confirmText="Excluir"
      >
        <div className="py-2 px-1">
          <p className="text-base text-gray-800 text-center">
            Tem certeza que deseja excluir este cargo?
          </p>
        </div>
      </ActionPanel>
      {error && (
        <div className="mt-4 max-w-2xl w-full bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center text-base">
          {error}
        </div>
      )}
    </div>
  );
};

export default PositionPage;