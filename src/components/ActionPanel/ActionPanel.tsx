import type { ReactNode } from "react";

interface ActionPanelProps {
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
  type?: "edit" | "delete" | "new";
  title?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
}

// Ícones SVG para os botões de ação
const EditIcon = () => (
  <svg className="inline mr-2" width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.27 8.27A2 2 0 016 16H4v-2a2 2 0 01.586-1.414l8.27-8.27z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg className="inline mr-2" width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 20 20">
    <path d="M6 6v10a2 2 0 002 2h4a2 2 0 002-2V6M9 10v4m4-4v4M9 6V4a1 1 0 011-1h0a1 1 0 011 1v2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 6h12" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const typeInfo = {
  edit: {
    color: "bg-blue-600 hover:bg-blue-700",
    confirmLabel: "Salvar",
    title: "Editar",
    icon: <EditIcon />,
  },
  delete: {
    color: "bg-red-600 hover:bg-red-700",
    confirmLabel: "Excluir",
    title: "Excluir",
    icon: <DeleteIcon />,
  },
  new: {
    color: "bg-green-600 hover:bg-green-700",
    confirmLabel: "Criar",
    title: "Novo Registro",
    icon: null,
  },
};

const ActionPanel = ({
  open,
  onConfirm,
  onCancel,
  onClose,
  type = "edit",
  title,
  children,
  confirmText,
  cancelText = "Cancelar",
}: ActionPanelProps) => {
  if (!open) return null;

  const info = typeInfo[type] || typeInfo.edit;
  const confirmLabel = confirmText || info.confirmLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 p-6 animate-fade-in-fast relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-xl font-bold"
          aria-label="Fechar"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {title || info.title}
        </h2>
        <div className="mb-6">{children}</div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
            onClick={onCancel || onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className={`px-4 py-2 text-white rounded transition text-sm font-semibold flex items-center justify-center ${info.color}`}
            onClick={onConfirm}
            type="button"
          >
            {/* Exibe o ícone apenas para editar/excluir */}
            {(type === "edit" || type === "delete") && info.icon}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;