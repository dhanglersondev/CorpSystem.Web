import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import {
  positionService,
  type PositionResponseDto,
  type PositionCreateDto,
  type PositionUpdateDto,
} from "../../services/positionService";
import {
  departmentService,
  type DepartmentResponseDto,
} from "../../services/departmentService";
import NotFound from "../NotFound/NotFound";

// Função para obter link de detalhes da posição
const getPositionDetailLink = (id: number) => `/positions/${id}`;

// SVG Position Icon
const PositionIcon = ({
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
      d="M12 2l7 7-7 13-7-13z"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PositionPage = () => {
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // For edit panel
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // For create panel
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newPositionValue, setNewPositionValue] = useState<string>("");
  const [newDepartmentId, setNewDepartmentId] = useState<number | null>(null);
  const [newIsActive, setNewIsActive] = useState<boolean>(true);

  // For delete panel
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // For modals
  const [showEditPanel, setShowEditPanel] = useState(false);

  const navigate = useNavigate();

  // Buscar posições da API
  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await positionService.getPositions();
      setPositions(data);
      // if (Array.isArray(data) && data.length === 0) { /* setNotFound(true); */ }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Erro ao carregar cargos");
    } finally {
      setLoading(false);
    }
  };

  // Buscar departamentos para dropdown
  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch {
      setDepartments([]); // fallback
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchDepartments();
    // eslint-disable-next-line
  }, []);

  const handleEditClick = (id: number, currentTitle: string, departmentId: number) => {
    setEditingId(id);
    setEditValue(currentTitle);
    setEditDepartmentId(departmentId);

    const pos = positions.find((p) => p.id === id);
    setEditIsActive(pos?.isActive ?? true);

    setShowEditPanel(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  // Departamento não pode ser editado durante a edição - não será chamado no painel de edição de cargo
  const handleEditDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditDepartmentId(Number(e.target.value));
  };

  const handleEditIsActiveSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditIsActive(e.target.value === "true");
  };

  // Troquei o toggle (handleEditIsActiveChange) pelo select, logo o handler só é chamado na confirmação.
  const handleEditSave = async () => {
    if (
      editingId != null &&
      editValue.trim() &&
      editDepartmentId != null
    ) {
      const updateDto: PositionUpdateDto = {
        title: editValue.trim(),
        departmentId: editDepartmentId,
        isActive: editIsActive,
      };

      try {
        await positionService.updatePosition(editingId, updateDto);
        await fetchPositions();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao editar o cargo.");
        }
      }
    }
    setEditingId(null);
    setEditValue("");
    setEditDepartmentId(null);
    setEditIsActive(true);
    setShowEditPanel(false);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
    setEditDepartmentId(null);
    setEditIsActive(true);
    setShowEditPanel(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      try {
        await positionService.deletePosition(deleteId);
        await fetchPositions();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao excluir o cargo.");
        }
      }
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPositionValue(e.target.value);
  };

  const handleCreateDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewDepartmentId(Number(e.target.value));
  };

  const handleNewIsActiveSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewIsActive(e.target.value === "true");
  };

  const openCreatePanel = () => {
    setShowCreatePanel(true);
    setNewPositionValue("");
    setNewDepartmentId(
      departments.length > 0 ? departments[0].id : null
    );
    setNewIsActive(true);
  };

  const handleCreate = async () => {
    if (newPositionValue.trim() && newDepartmentId != null) {
      const createDto: PositionCreateDto = {
        title: newPositionValue.trim(),
        departmentId: newDepartmentId,
        isActive: newIsActive,
      };
      try {
        await positionService.createPosition(createDto);
        await fetchPositions();
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao criar cargo.");
        }
      }
    }
    setNewPositionValue("");
    setNewDepartmentId(null);
    setNewIsActive(true);
    setShowCreatePanel(false);
  };

  const handleCreateCancel = () => {
    setNewPositionValue("");
    setNewDepartmentId(null);
    setNewIsActive(true);
    setShowCreatePanel(false);
  };

  // Handler para redirecionar para detalhes
  const handlePositionSelect = (id: number) => {
    navigate(getPositionDetailLink(id));
  };

  if (notFound) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:py-10">
      <section className="w-full max-w-5xl shadow rounded-2xl bg-white border border-gray-200 flex flex-col px-3 py-5 sm:px-8 sm:py-8 gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 w-full">
          <span className="flex items-center gap-2 sm:gap-4">
            <span className="text-blue-700">
              <PositionIcon className="w-9 h-9 sm:w-12 sm:h-12" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow-sm">
              Cargos
            </h1>
          </span>
          <button
            className="inline-flex items-center bg-emerald-600 text-white font-semibold rounded-md px-4 py-2 shadow hover:bg-emerald-700 transition-colors text-base gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            onClick={openCreatePanel}
            aria-label="Criar novo cargo"
            title="Criar novo cargo"
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
            Novo Cargo
            <span className="sr-only">
              Adicionar um novo cargo à lista
            </span>
          </button>
        </div>
        {error && (
          <div className="bg-red-100 text-red-800 rounded px-4 py-2 mb-2">
            {error}
          </div>
        )}
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold w-8 sm:w-auto">
                  #
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">
                  Nome do Cargo
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-center text-gray-700 font-semibold">
                  Status
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">
                  Departamento
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-gray-700 font-semibold">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : positions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg"
                  >
                    Nenhum cargo encontrado.
                  </td>
                </tr>
              ) : (
                positions.map((position, idx) => (
                  <tr
                    key={position.id}
                    className="border-t last:border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      {idx + 1}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      <button
                        type="button"
                        className="font-bold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-left"
                        tabIndex={0}
                        onClick={() => handlePositionSelect(position.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handlePositionSelect(position.id);
                          }
                        }}
                        aria-label={`Ver detalhes do cargo ${position.title}`}
                        title={`Ver detalhes do cargo ${position.title}`}
                      >
                        {position.title}
                      </button>
                    </td>
                    {/* STATUS DO CARGO (estilo igual do Department.js, status abaixo do nome/cargo, acima do departamento) */}
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle text-center">
                      {editingId === position.id && showEditPanel ? (
                        <div className="flex flex-col items-center w-full">
                          {/* Para ocupar o mesmo tamanho do campo de departamento e nome, usamos w-full e as mesmas classes do input/textbox */}
                          <select
                            className="border rounded px-3 py-1 w-full sm:min-w-[180px] text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500 outline-none"
                            value={editIsActive ? "true" : "false"}
                            onChange={handleEditIsActiveSelectChange}
                          >
                            <option value="true">Ativo</option>
                            <option value="false">Inativo</option>
                          </select>
                          <span className="text-xs mt-1 text-gray-700">
                            {editIsActive ? (
                              <span className="inline-block text-green-700 bg-green-100 rounded px-2 py-1 text-xs font-semibold">Ativo</span>
                            ) : (
                              <span className="inline-block text-red-700 bg-red-100 rounded px-2 py-1 text-xs font-semibold">Inativo</span>
                            )}
                          </span>
                        </div>
                      ) : (
                        position.isActive ? (
                          <span className="inline-block text-green-700 bg-green-100 rounded px-2 py-1 text-xs font-semibold">Ativo</span>
                        ) : (
                          <span className="inline-block text-red-700 bg-red-100 rounded px-2 py-1 text-xs font-semibold">Inativo</span>
                        )
                      )}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      {
                        departments.find((d) => d.id === position.departmentId)
                          ?.name ?? "—"
                      }
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {/* EDITAR: botão igual ao do Department */}
                        <button
                          className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium rounded-md px-3 py-1.5 shadow hover:bg-yellow-200 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          title="Editar cargo"
                          aria-label="Editar cargo"
                          type="button"
                          onClick={() =>
                            handleEditClick(
                              position.id,
                              position.title,
                              position.departmentId
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

                        {/* EXCLUIR: botão igual ao do Department */}
                        <button
                          className="inline-flex items-center bg-red-50 text-red-700 font-medium rounded-md px-3 py-1.5 shadow hover:bg-red-100 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Excluir cargo"
                          aria-label="Excluir cargo"
                          type="button"
                          onClick={() => handleDelete(position.id)}
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
        title="Editar Cargo"
      >
        <div className="flex flex-col gap-3">
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
          {/* Status ocupa o mesmo tamanho dos demais */}
          <div className="flex flex-col mt-0.5 w-full">
            <span className="text-xs text-gray-600 mb-1">Status do cargo</span>
            <select
              className="border rounded px-3 py-1 w-full sm:min-w-[180px] text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={editIsActive ? "true" : "false"}
              onChange={handleEditIsActiveSelectChange}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <span className="text-xs mt-1 text-gray-700">
              {editIsActive ? (
                <span className="inline-block text-green-700 bg-green-100 rounded px-2 py-1 text-xs font-semibold">Ativo</span>
              ) : (
                <span className="inline-block text-red-700 bg-red-100 rounded px-2 py-1 text-xs font-semibold">Inativo</span>
              )}
            </span>
          </div>
          {/* Departamento não pode ser editado durante edição, apenas exibido */}
          <input
            className="border rounded px-3 py-1 w-full sm:min-w-[180px] text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            value={
              departments.find((d) => d.id === editDepartmentId)?.name || ""
            }
            disabled
            readOnly
            tabIndex={-1}
          />
        </div>
      </ActionPanel>

      {/* Painel de Criação */}
      <ActionPanel
        open={showCreatePanel}
        onConfirm={handleCreate}
        onCancel={handleCreateCancel}
        onClose={handleCreateCancel}
        type="new"
        title="Novo Cargo"
      >
        <div className="flex flex-col gap-3">
          <input
            className="border rounded px-3 py-1 min-w-0 w-full sm:min-w-[180px] focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Nome do novo cargo"
            value={newPositionValue}
            onChange={handleCreateChange}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") handleCreateCancel();
            }}
          />
          {/* Seleção do status ocupa o mesmo tamanho dos demais */}
          <div className="flex flex-col mt-0.5 w-full">
            <span className="text-xs text-gray-600 mb-1">Status do cargo</span>
            <select
              className="border rounded px-3 py-1 w-full sm:min-w-[180px] text-sm text-gray-700 bg-white focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={newIsActive ? "true" : "false"}
              onChange={handleNewIsActiveSelectChange}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
            <span className="text-xs mt-1 text-gray-700">
              {newIsActive ? (
                <span className="inline-block text-green-700 bg-green-100 rounded px-2 py-1 text-xs font-semibold">Ativo</span>
              ) : (
                <span className="inline-block text-red-700 bg-red-100 rounded px-2 py-1 text-xs font-semibold">Inativo</span>
              )}
            </span>
          </div>
          <select
            className="border rounded px-3 py-1 w-full sm:min-w-[180px] text-sm"
            value={newDepartmentId ?? ""}
            onChange={handleCreateDepartmentChange}
          >
            <option value="" disabled>
              Selecione o departamento
            </option>
            {departments.map((d) => (
              <option value={d.id} key={d.id}>
                {d.name}
              </option>
            ))}
          </select>
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
        <p>Tem certeza que deseja excluir este cargo?</p>
      </ActionPanel>
    </div>
  );
};

export default PositionPage;