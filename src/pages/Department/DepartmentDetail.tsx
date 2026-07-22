import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

// Department Icon
const DepartmentIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <span
    className={`
      inline-flex items-center justify-center rounded-lg bg-blue-100 text-blue-600
      border border-blue-200 overflow-hidden shadow
      ${className}
    `}
    style={{ width: 48, height: 48, minWidth: 48 }}
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        d="M4 6v16h16V6M4 6L12 2l8 4"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

// As cores abaixo foram alinhadas com o padrão de Department.tsx
const statusConfig = {
  ativo: {
    label: "Ativo",
    dot: "bg-green-500", // cor primária ativo em Department.tsx
    pill: "bg-green-100 text-green-800 border-green-200",
  },
  inativo: {
    label: "Inativo",
    dot: "bg-red-300", // cor primária inativo em Department.tsx
    pill: "bg-red-100 text-red-600 border-red-200",
  }
};

// Department status pill, similar to PositionStatus but for the department
function DepartmentStatusPill({ isActive }: { isActive: boolean }) {
  const S = isActive ? statusConfig.ativo : statusConfig.inativo;
  return (
    <span
      className={`flex items-center gap-1 pl-2 pr-2 py-0.5 rounded-full border text-xs font-medium ${S.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`}></span>
      {S.label}
    </span>
  );
}

// --- Botão de ativar/desativar com estilo igual as listas (cores e tamanho do Department.tsx) ---
function StatusActionButton({
  isActive,
  disabled,
  onToggle,
  "data-testid": dataTestId,
}: {
  isActive: boolean;
  disabled: boolean;
  onToggle: () => void;
  "data-testid"?: string;
}) {
  // Cores idênticas àquelas usadas em Department.tsx
  return (
    <button
      type="button"
      className={`
        inline-flex items-center gap-2 rounded-lg px-5 py-2.5
        font-semibold text-sm border transition
        ${isActive
          ? "bg-white border-green-300 text-green-800 hover:border-green-500 hover:text-green-900"
          : "bg-green-600 border-green-700 text-white hover:bg-green-700"
        }
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        shadow-sm
      `}
      onClick={onToggle}
      disabled={disabled}
      aria-label={isActive ? "Desativar departamento" : "Ativar departamento"}
      title={isActive ? "Desativar departamento" : "Ativar departamento"}
      data-testid={dataTestId}
      style={{
        minHeight: 36,
      }}
    >
      <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 20 20">
        {isActive ? (
          <path d="M10 3v7m0 0a7 7 0 1 1-4.95 2.05M7 17a7 7 0 0 1 6 0" />
        ) : (
          <circle cx="10" cy="10" r="8" />
        )}
      </svg>
      <span>{isActive ? "Desativar" : "Ativar"}</span>
    </button>
  );
}

// --- Botão editar (usar amarelo padrão do Department.tsx, tamanho maior) ---
function EditButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  // Cores inspiradas no Departamento.tsx - ghost amarelo
  return (
    <button
      className={`
        inline-flex items-center gap-2 rounded-lg px-5 py-2.5
        font-semibold text-sm border border-yellow-300
        bg-yellow-50 text-yellow-900
        hover:bg-yellow-100 hover:border-yellow-400
        transition shadow-sm
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
      onClick={onClick}
      disabled={disabled}
      aria-label="Editar departamento"
      title="Editar departamento"
      data-testid="edit-department-btn"
      style={{
        minHeight: 36,
      }}
    >
      <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.27 8.27A2 2 0 016 16H4v-2a2 2 0 01.586-1.414l8.27-8.27z"/>
      </svg>
      Editar
    </button>
  );
}

// InfoRow customizados para editar/ativar diretamente
function InfoRowCustom({
  label,
  value,
  action,
}: {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
}) {
  // Botão de ação à direita do valor
  return (
    <div className="flex flex-row gap-3 items-center py-2 border-b last:border-b-0 border-gray-100">
      <span className="text-[13px] font-medium text-slate-500 min-w-[74px] w-[74px]">{label}:</span>
      <span className="text-[14px] font-normal text-slate-800 flex flex-row items-center gap-2">
        {value}
        {action && <span className="ml-2">{action}</span>}
      </span>
    </div>
  );
}

function PositionStatus({ isActive }: { isActive: boolean }) {
  const S = isActive ? statusConfig.ativo : statusConfig.inativo;
  return (
    <span className={`flex items-center gap-1 pl-2 pr-2 py-0.5 rounded-full border text-xs font-medium ${S.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${S.dot}`}></span>
      {S.label}
    </span>
  );
}

// Linha de item cargo
function PositionRow({ position }: { position: PositionResponseDto }) {
  return (
    <li key={position.id}
      className={`
        flex flex-row items-center justify-between px-2 py-2 rounded-md transition
        ${position.isActive 
          ? "hover:bg-blue-50 cursor-pointer"
          : "opacity-50 pointer-events-none"
        }
      `}
    >
      <Link to={`/positions/${position.id}`} className="flex-1 flex items-center gap-2 min-w-0 group">
        <span
          className={`
            block truncate text-base
            ${position.isActive ? "text-slate-800 group-hover:text-blue-700 font-semibold" : "text-gray-400 line-through"}
          `}
          title={position.title}
        >
          {position.title}
        </span>
      </Link>
      <PositionStatus isActive={position.isActive} />
    </li>
  );
}

const DepartmentDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const departmentId = Number(id);

  const [department, setDepartment] = useState<DepartmentResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [linkedPositions, setLinkedPositions] = useState<PositionResponseDto[]>([]);
  const [positionsLoading, setPositionsLoading] = useState<boolean>(false);

  // Buscar detalhes
  useEffect(() => {
    const fetchAll = async () => {
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

      setPositionsLoading(true);
      try {
        const allPositions = await positionService.getPositions();
        const filtered = allPositions.filter(
          (pos) => pos.departmentId === departmentId
        );
        setLinkedPositions(filtered);
      } catch {
        setLinkedPositions([]);
      }
      setPositionsLoading(false);
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId]);

  // Edit handlers
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
        // Refresh
        const updated = await departmentService.getDepartment(department.id);
        setDepartment(updated);
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
      const updated = await departmentService.getDepartment(department.id);
      setDepartment(updated);
    } catch {
      setError("Erro ao alterar status do departamento.");
    }
    setStatusLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 px-2 py-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg border border-slate-100 rounded-2xl p-0 flex flex-col">
        {/* Top bar */}
        <div className="flex flex-row items-center gap-4 border-b border-slate-100 px-6 pt-6 pb-3">
          <DepartmentIcon />
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-center gap-2">
              <h2 className="font-bold text-xl text-slate-900 truncate">
                {loading ? (
                  <span className="text-slate-300">Carregando...</span>
                ) : department?.name || "Departamento"}
              </h2>
              {/* Edit button removido conforme solicitado */}
            </div>
            <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
              Detalhes
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded px-5 py-2.5 m-6 mb-0 mt-6 border border-red-200 font-semibold text-center" data-testid="error-msg">
            {error}
          </div>
        )}

        {/* Info grid */}
        <section aria-label="Informações do departamento" className="px-6 pt-4">
          <div className="w-full rounded-lg bg-slate-50 border border-slate-100 p-0 divide-y divide-slate-100">
            <InfoRowCustom label="ID" value={department?.id ?? "-"} />
            <InfoRowCustom
              label="Nome"
              value={department?.name ?? "-"}
            />
            <InfoRowCustom
              label="Status"
              value={
                department !== null ?
                  <DepartmentStatusPill isActive={department.isActive} />
                  : "-"
              }
            />
          </div>
        </section>

        {/* Botões de ação (ativar/desativar/editar), agora logo abaixo de Status e acima dos cargos */}
        <div className="flex flex-row gap-4 px-6 pt-6 pb-1">
          {department && (
            <>
              <StatusActionButton
                isActive={department.isActive}
                disabled={statusLoading}
                onToggle={handleToggleStatus}
                data-testid="status-toggle-btn"
              />
              <EditButton
                onClick={handleEdit}
                disabled={!department}
              />
            </>
          )}
        </div>

        {/* Lista de cargos vinculados */}
        <section aria-label="Cargos vinculados" className="mt-6 px-6">
          <h3 className="mb-1 text-base font-bold text-slate-800 tracking-tight">Cargos vinculados</h3>
          <div className="w-full">
            {positionsLoading ? (
              <span className="text-slate-400 text-sm py-2">Carregando cargos...</span>
            ) : linkedPositions.length === 0 ? (
              <span className="text-slate-400 text-sm py-2">Nenhum cargo vinculado a este departamento.</span>
            ) : (
              <ul className="flex flex-col gap-1 w-full mt-0 rounded-lg border border-slate-100 bg-white p-2">
                {linkedPositions.map((position) => (
                  <PositionRow key={position.id} position={position} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Edit Modal */}
        <ActionPanel
          open={showEditPanel}
          onConfirm={handleEditSave}
          onCancel={handleEditCancel}
          onClose={handleEditCancel}
          type="edit"
          title="Editar Departamento"
        >
          <input
            className="
              border border-slate-300 rounded-lg px-4 py-2 w-full text-base shadow-sm
              focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none
              transition placeholder:text-slate-400
            "
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
    </div>
  );
};

export default DepartmentDetail;