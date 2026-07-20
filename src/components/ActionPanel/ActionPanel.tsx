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
  <svg
    className="inline mr-2"
    width={18}
    height={18}
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
);

const DeleteIcon = () => (
  <svg
    className="inline mr-2"
    width={18}
    height={18}
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
);

const typeInfo = {
  edit: {
    color:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    confirmLabel: "Salvar",
    title: "Editar",
    icon: <EditIcon />,
    ring: "ring-blue-200",
  },
  delete: {
    color:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    confirmLabel: "Excluir",
    title: "Excluir",
    icon: <DeleteIcon />,
    ring: "ring-red-200",
  },
  new: {
    color:
      "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    confirmLabel: "Criar",
    title: "Novo Registro",
    icon: null,
    ring: "ring-green-200",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/60">
      <div
        className={`relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg mx-4 px-8 py-8 animate-fade-in-fast flex flex-col`}
        style={{ minWidth: 340 }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 p-1"
          aria-label="Fechar"
          onClick={onClose}
          type="button"
        >
          <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 6l12 12M18 6l-12 12" strokeWidth={2.2} strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-3 mb-4">
          {(type === "edit" || type === "delete") && info.icon && (
            <span
              className={`rounded-full p-2 bg-gray-100 text-xl ${type === "edit" ? "text-blue-600" : "text-red-600"}`}
              aria-hidden="true"
            >
              {info.icon}
            </span>
          )}
          <h2 className={`text-2xl font-extrabold text-gray-900 tracking-tight`}>
            {title || info.title}
          </h2>
        </div>
        <div className="mb-8">{children}</div>
        <div className="flex gap-2 justify-end">
          <button
            className={`px-5 py-2 text-white rounded-lg transition text-base font-semibold flex items-center justify-center shadow ${info.color} focus:outline-none focus:ring-2 focus:ring-offset-2 ${info.ring}`}
            onClick={onConfirm}
            type="button"
          >
            {(type === "edit" || type === "delete") && info.icon}
            {confirmLabel}
          </button>
          <button
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition text-base font-medium"
            onClick={onCancel || onClose}
            type="button"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;