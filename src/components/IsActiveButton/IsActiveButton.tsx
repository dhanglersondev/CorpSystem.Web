import React from "react";

interface IsActiveButtonProps {
  isActive: boolean;
  onToggle: (newStatus: boolean) => void;
  disabled?: boolean;
  className?: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

/**
 * Botão para alternar status ativo/inativo de recursos como Departamento, Funcionário, etc.
 * 
 * Props:
 * - isActive: estado atual
 * - onToggle: callback ao clicar, passando novo status
 * - disabled: botão desabilitado
 * - className: classes extras
 * - activeLabel/inactiveLabel: labels customizados (padrão: Ativo/Inativo)
 */
const IsActiveButton: React.FC<IsActiveButtonProps> = ({
  isActive,
  onToggle,
  disabled = false,
  className = "",
  activeLabel = "Ativo",
  inactiveLabel = "Inativo",
}) => {
  const handleClick = () => {
    if (!disabled) {
      onToggle(!isActive);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-2 py-1 rounded transition
        text-xs sm:text-sm font-medium
        ${isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      aria-pressed={isActive}
      aria-label={isActive ? activeLabel : inactiveLabel}
      title={isActive ? activeLabel : inactiveLabel}
    >
      <span
        className={`
          w-2 h-2 rounded-full
          ${isActive ? "bg-green-500" : "bg-gray-500"}
        `}
      />
      <span>{isActive ? activeLabel : inactiveLabel}</span>
    </button>
  );
};

export default IsActiveButton;