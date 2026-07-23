import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import {
  departmentService,
  type DepartmentResponseDto,
  type DepartmentUpdateDto,
} from "../../services/departmentService";
import {
  positionService,
  type PositionResponseDto,
} from "../../services/positionService";
import NotFound from "../NotFound/NotFound";

// Ícone SVG
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

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();

  const [department, setDepartment] = useState<DepartmentResponseDto | null>(
    null
  );
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Painel de edição/exclusão
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const [editStatus, setEditStatus] = useState<boolean>(true);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Buscar detalhes do departamento e os cargos dele
  const fetchDepartment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartment(numericId);
      setDepartment(data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Erro ao carregar departamento.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      const allPositions = await positionService.getPositions();
      setPositions(
        allPositions.filter((p) => p.departmentId === numericId)
      );
    } catch (err) {
      setPositions([]);
    }
  };

  useEffect(() => {
    if (!isNaN(numericId)) {
      fetchDepartment();
      fetchPositions();
    }
    // eslint-disable-next-line
  }, [id]);

  // Paneis e Handlers: editar
  const openEditPanel = () => {
    if (!department) return;
    setEditValue(department.name);
    setEditStatus(department.isActive);
    setShowEditPanel(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  const handleEditStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditStatus(e.target.value === "true");
  };

  const handleEditSave = async () => {
    if (editValue.trim() !== "" && department) {
      const updateDto: DepartmentUpdateDto = {
        name: editValue.trim(),
        isActive: editStatus,
      };
      try {
        await departmentService.updateDepartment(department.id, updateDto);
        await fetchDepartment();
        setShowEditPanel(false);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Erro ao editar departamento.");
        }
      }
    }
  };

  const handleEditCancel = () => {
    setShowEditPanel(false);
    setEditValue("");
    setEditStatus(true);
  };

  // Painel exclusão
  const openDeletePanel = () => setShowDeletePanel(true);
  const closeDeletePanel = () => setShowDeletePanel(false);

  const handleDelete = async () => {
    if (!department) return;
    setDeleteLoading(true);
    try {
      await departmentService.deleteDepartment(department.id);
      setShowDeletePanel(false);
      navigate("/departments");
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError("Erro ao excluir departamento.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  if (notFound) return <NotFound />;

  // Se estiver carregando ou em erro, mostra mensagem centralizada.
  if (loading || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <section className="w-full max-w-3xl bg-white shadow rounded-2xl border border-gray-200 px-10 py-10 flex flex-col gap-8">
          <div className="flex gap-4 items-center mb-8">
            <span className="text-blue-700">
              <DepartmentIcon className="w-10 h-10" />
            </span>
            <h1 className="text-3xl font-bold text-gray-800">
              Detalhes do Departamento
            </h1>
          </div>
          <div className="flex justify-center items-center min-h-[120px] text-center text-gray-400 text-lg">
            {loading ? "Carregando..." : error}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <section className="w-full max-w-3xl bg-white shadow rounded-2xl border border-gray-200 px-8 md:px-10 py-8 md:py-10 flex flex-col gap-8">
        {/* HEADER */}
        <div className="flex items-center space-x-4 mb-10">
          <DepartmentIcon className="w-10 h-10 text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-800">
            Detalhes do Departamento
          </h1>
        </div>
        {/* INFO PRINCIPAL */}
        {department && (
          <>
            <div className="w-full border-b border-gray-200 pb-6 mb-8">
              {/* NOME, STATUS E AÇÕES: padrões sistemas = grid simples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 items-center">
                {/* Nome */}
                <div className="flex flex-row items-center gap-2 md:col-span-2">
                  <div className="font-bold min-w-[75px] text-lg">Nome:</div>
                  <div
                    style={{
                      letterSpacing: "0.01em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                    }}
                    className="truncate text-gray-900 text-base"
                  >
                    {department.name}
                  </div>
                </div>
                {/* Status */}
                <div className="flex flex-row items-center gap-2 md:justify-end">
                  <span className="font-bold">Status:</span>
                  {department.isActive ? (
                    <span className="inline-block text-green-700 bg-green-100 rounded px-4 py-1 text-base font-bold">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-block text-red-700 bg-red-100 rounded px-4 py-1 text-base font-bold">
                      Inativo
                    </span>
                  )}
                </div>
              </div>
              {/* Os botões Editar/Excluir foram removidos conforme solicitado */}
            </div>

            {/* Lista/tabela de cargos */}
            <div>
              <div className="flex items-center mb-2">
                {/* Alterado de mb-4 para mb-2 para remover pela metade o espaçamento acima */}
                <h2 className="text-xl font-bold text-gray-800 mb-0">
                  Cargos Neste Departamento
                </h2>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-full bg-white text-base">
                  <thead>
                    <tr className="bg-gray-100 h-[48px]">
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold align-middle w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold align-middle min-w-[220px]">
                        Cargo
                      </th>
                      <th className="px-4 py-3 text-center text-gray-700 font-semibold align-middle w-44">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!positions.length ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-12 text-center text-gray-400 text-lg"
                        >
                          Nenhum cargo vinculado a este departamento.
                        </td>
                      </tr>
                    ) : (
                      positions.map((pos, idx) => (
                        <tr
                          key={pos.id}
                          className="border-t last:border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 align-middle text-gray-700 text-center font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 align-middle font-semibold text-gray-900 whitespace-nowrap truncate max-w-xs">
                            <Link
                              to={`/positions/${pos.id}`}
                              className="text-blue-700 hover:underline"
                            >
                              {pos.title}
                            </Link>
                          </td>
                          {/* Status Centralizado padrão de sistemas */}
                          <td className="px-4 py-3 align-middle text-center">
                            {pos.isActive ? (
                              <span className="inline-block text-green-700 bg-green-100 rounded px-4 py-1 text-base font-bold">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-block text-red-700 bg-red-100 rounded px-4 py-1 text-base font-bold">
                                Inativo
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
      {/* Os painéis de edição/exclusão foram mantidos para não afetar possíveis fluxos programáticos */}
      <ActionPanel
        open={showEditPanel}
        onConfirm={handleEditSave}
        onCancel={handleEditCancel}
        onClose={handleEditCancel}
        type="edit"
        title="Editar Departamento"
        confirmText="Salvar Alterações"
        cancelText="Cancelar"
      >
        <div className="flex flex-col gap-4 mt-3 mb-2">
          <div>
            <label className="block text-gray-800 text-base font-semibold mb-1" htmlFor="dep-nome-input">
              Nome
            </label>
            <input
              id="dep-nome-input"
              className="border rounded px-4 py-2 min-w-0 w-full sm:min-w-[240px] focus:ring-blue-500 focus:border-blue-500 outline-none text-base font-medium"
              value={editValue}
              onChange={handleEditChange}
              autoFocus
              style={{ letterSpacing: "0.01em" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
                if (e.key === "Escape") handleEditCancel();
              }}
            />
          </div>
          <div>
            <label className="block text-gray-800 text-base font-semibold mb-1" htmlFor="dep-status-input">
              Status
            </label>
            <select
              id="dep-status-input"
              className="border rounded px-4 py-2 w-full sm:min-w-[240px] text-base font-medium"
              value={String(editStatus)}
              onChange={handleEditStatusChange}
              style={{ letterSpacing: "0.01em" }}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>
      </ActionPanel>
      <ActionPanel
        open={showDeletePanel}
        onConfirm={handleDelete}
        onCancel={closeDeletePanel}
        onClose={closeDeletePanel}
        type="delete"
        title="Confirmação de Exclusão"
        confirmText={deleteLoading ? "Excluindo..." : "Excluir Departamento"}
        cancelText="Cancelar"
      >
        <p className="text-lg font-medium mb-3">
          Tem certeza que deseja excluir este departamento?
        </p>
        {deleteLoading && (
          <div className="text-gray-500 text-base mt-3">Excluindo...</div>
        )}
      </ActionPanel>
    </div>
  );
};

export default DepartmentDetail;