import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import {
  departmentService,
  type DepartmentResponseDto,
  type DepartmentUpdateDto,
} from "../../services/departmentService";

// SVG Department Icon
const DepartmentIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
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

const DepartmentDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const departmentId = Number(id);

  const [department, setDepartment] = useState<DepartmentResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);

  // Fetch department details
  const fetchDepartment = async () => {
    if (!departmentId) {
      setError("Id do departamento inválido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await departmentService.getDepartment(departmentId);
      setDepartment(data);
    } catch {
      setError("Erro ao carregar informações do departamento.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  const handleEdit = () => {
    if (!department) return;
    setShowEditPanel(true);
    setEditValue(department.name);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = async () => {
    if (department && editValue.trim()) {
      const updateDto: DepartmentUpdateDto = {
        name: editValue.trim(),
        isActive: department.isActive,
      };
      try {
        await departmentService.updateDepartment(department.id, updateDto);
        await fetchDepartment();
        setShowEditPanel(false);
      } catch {
        setError("Erro ao salvar as alterações.");
      }
    }
  };

  const handleEditCancel = () => {
    setEditValue("");
    setShowEditPanel(false);
  };

  const handleToggleStatus = async () => {
    if (!department) return;
    setStatusLoading(true);
    setError(null);
    try {
      await departmentService.setDepartmentStatus(department.id, !department.isActive);
      await fetchDepartment();
    } catch {
      setError("Erro ao alterar status do departamento.");
    }
    setStatusLoading(false);
  };

  // Profissional Status Button (ATIVAR/DESATIVAR)
  function StatusActionButton({
    isActive,
    disabled,
    onToggle,
  }: {
    isActive: boolean;
    disabled: boolean;
    onToggle: () => void;
  }) {
    return (
      <button
        type="button"
        className={`flex flex-row items-center justify-center gap-2 px-6 py-2 rounded-lg shadow transition font-semibold border text-base w-full
          ${
            isActive
              ? "bg-gray-300 hover:bg-gray-400 border-gray-500 text-gray-800"
              : "bg-green-600 hover:bg-green-700 border-green-700 text-white"
          }
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={onToggle}
        disabled={disabled}
        aria-label={isActive ? "Desativar departamento" : "Ativar departamento"}
        title={isActive ? "Desativar departamento" : "Ativar departamento"}
        style={{
          minWidth: 0 // allow shrink inside flex-grow
        }}
      >
        <svg
          className="w-5 h-5"
          fill={isActive ? "none" : "currentColor"}
          stroke={isActive ? "currentColor" : "none"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 20 20"
        >
          {isActive ? (
            <path d="M10 3v7m0 0a7 7 0 1 1-4.95 2.05M7 17a7 7 0 0 1 6 0" />
          ) : (
            <circle cx="10" cy="10" r="8" />
          )}
        </svg>
        <span className="w-full text-center">{isActive ? "Desativar" : "Ativar"}</span>
      </button>
    );
  }

  function StatusDot({ isActive }: { isActive: boolean }) {
    return (
      <span className="flex items-center gap-2">
        <span
          className={`inline-block w-3 h-3 rounded-full transition-colors duration-300 ${
            isActive ? "bg-green-500" : "bg-gray-400"
          } border border-gray-300 mr-1`}
          aria-label={isActive ? "Ativo" : "Inativo"}
        ></span>
        <span className={`font-semibold uppercase text-xs ${isActive ? "text-green-700" : "text-gray-500"}`}>
          {isActive ? "Ativo" : "Inativo"}
        </span>
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-blue-50 to-gray-50 flex flex-col items-center py-10 px-2 sm:px-4">
      <section className="w-full max-w-xl rounded-2xl bg-white border border-gray-100 shadow-lg flex flex-col items-stretch px-3 py-6 gap-4 sm:px-8 sm:py-10 sm:gap-5">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:gap-4 sm:mb-3">
          {/* Removido botão voltar */}
          <span className="flex items-center justify-center rounded-full bg-blue-50 shadow p-3 mx-auto mb-2 sm:mx-0 sm:mb-0 sm:ml-3">
            <DepartmentIcon className="w-12 h-12 text-blue-600" />
          </span>
          <div className="flex-1 flex flex-col justify-center items-center sm:items-start">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 drop-shadow min-h-[2.5rem]">
              {loading
                ? <span className="text-gray-400">Carregando...</span>
                : department?.name || "Departamento"}
            </h1>
            <span className="text-xs font-medium text-gray-400 mt-1">
              Detalhes do departamento
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 rounded px-2 py-2 mb-2 text-center font-medium shadow sm:px-4" data-testid="error-msg">
            {error}
          </div>
        )}

        {/* Info */}
        <section
          aria-label="Informações do departamento"
          className="flex flex-col gap-2 px-0 sm:gap-3 sm:px-1"
        >
          <InfoRow label="ID" value={department?.id ?? "-"} />
          <InfoRow label="Nome" value={department?.name ?? "-"} />
          <InfoRow
            label="Status"
            value={
              department !== null ? (
                <StatusDot isActive={department.isActive} />
              ) : (
                "-"
              )
            }
          />
        </section>

        {/* Actions - Mobile First: Col, Stacked on mobile, Row on sm+ screens */}
        <div className="w-full flex flex-col gap-2 mt-5 sm:gap-4 sm:flex-row sm:justify-between sm:items-stretch sm:mt-6">
          <div className="flex-1 flex mb-2 sm:mb-0">
            <button
              className="w-full flex items-center gap-2 justify-center px-4 py-2 bg-yellow-300 text-yellow-900 rounded-lg shadow hover:bg-yellow-400 transition font-semibold border border-yellow-400 text-base min-w-0 sm:px-6"
              onClick={handleEdit}
              disabled={!department}
              style={{ minWidth: 0 }}
            >
              <svg
                className="w-5 h-5"
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
              Editar
            </button>
          </div>
          {department && (
            <div className="flex-1 flex">
              <StatusActionButton
                isActive={department.isActive}
                disabled={statusLoading}
                onToggle={handleToggleStatus}
              />
            </div>
          )}
        </div>
      </section>

      {/* Modal de Edição */}
      <ActionPanel
        open={showEditPanel}
        onConfirm={handleEditSave}
        onCancel={handleEditCancel}
        onClose={handleEditCancel}
        type="edit"
        title="Editar Departamento"
      >
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base shadow"
          value={editValue}
          onChange={handleEditChange}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSave();
            if (e.key === "Escape") handleEditCancel();
          }}
          placeholder="Nome do departamento"
        />
      </ActionPanel>
    </div>
  );
};

// Componente auxiliar para informações do departamento
function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-row gap-2 items-center py-1 px-0 sm:gap-4 sm:px-1">
      <span className="text-gray-500 font-semibold w-24 sm:w-28 sm:w-32">{label}:</span>
      <span className="text-gray-900 break-all">{value}</span>
    </div>
  );
}

export default DepartmentDetail;