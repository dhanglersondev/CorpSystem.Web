import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import NotFound from "../NotFound/NotFound";
import {
  employeeService,
  type EmployeeResponseDto,
  type EmployeeCreateDto,
  type EmployeeUpdateDto,
} from "../../services/employeeService";
import {
  departmentService,
  type DepartmentResponseDto,
} from "../../services/departmentService";
import {
  positionService,
  type PositionResponseDto,
} from "../../services/positionService";

// Função para obter o link da página de departamento
const getDepartmentDetailLink = (department: DepartmentResponseDto) =>
  `/departments/${department.id}`;

// Função para obter o link da página de cargo
const getPositionDetailLink = (position: PositionResponseDto) =>
  `/positions/${position.id}`;

// Badge de status do funcionário
const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-block rounded px-2 py-1 text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
    }`}
  >
    {isActive ? "Ativo" : "Inativo"}
  </span>
);

const EmployeeIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx={12} cy={8} r={4} strokeWidth={2} stroke="currentColor" />
    <path d="M2 20c0-3.31 2.69-6 6-6h8c3.31 0 6 2.69 6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// URL para página de detalhes do funcionário (ID apenas)
const getEmployeeDetailLink = (emp: EmployeeResponseDto) => {
  return `/employees/${emp.id}`;
};

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponseDto[]>([]);
  const [positions, setPositions] = useState<PositionResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [newData, setNewData] = useState<
    Omit<EmployeeCreateDto, "departmentId" | "positionId" | "hireDate"> & {
      departmentId: string;
      positionId: string;
      hireDate: string;
    }
  >({
    name: "",
    email: "",
    cpf: "",
    salary: 0,
    hireDate: "",
    departmentId: "",
    positionId: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<
    Omit<EmployeeUpdateDto, "departmentId" | "positionId" | "hireDate"> & {
      departmentId: string;
      positionId: string;
      hireDate: string;
    }
  >({
    name: "",
    email: "",
    cpf: "",
    salary: 0,
    hireDate: "",
    departmentId: "",
    positionId: "",
    isActive: true,
  });

  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empList, depList, posList] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
        positionService.getPositions(),
      ]);
      setEmployees(empList);
      setDepartments(depList);
      setPositions(posList);
      setNotFound(false);
    } catch (e: any) {
      if (e?.response?.status === 404) setNotFound(true);
      else setError("Erro ao carregar funcionários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  // --- CRIAÇÃO ---
  const handleCreateOpen = () => {
    setShowCreate(true);
    setNewData({
      name: "",
      email: "",
      cpf: "",
      salary: 0,
      hireDate: "",
      departmentId: departments[0]?.id?.toString() || "",
      positionId: "",
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
          : name === "salary"
          ? Number(value)
          : value,
      ...(name === "departmentId" ? { positionId: "" } : {}),
    }));
  };

  const handleCreateConfirm = async () => {
    let errMsg: string | null = null;
    if (!newData.name) errMsg = "O nome do funcionário é obrigatório.";
    else if (!newData.departmentId) errMsg = "O departamento é obrigatório.";
    else if (!newData.positionId) errMsg = "O cargo é obrigatório.";
    if (errMsg) {
      setError(errMsg);
      return;
    }
    const dto: EmployeeCreateDto = {
      name: newData.name,
      email: newData.email,
      cpf: newData.cpf,
      salary: Number(newData.salary) || 0,
      hireDate: newData.hireDate || new Date().toISOString().slice(0, 10),
      departmentId: Number(newData.departmentId),
      positionId: Number(newData.positionId),
      isActive: !!newData.isActive,
    };
    try {
      await employeeService.createEmployee(dto);
      await fetchAll();
      setShowCreate(false);
      setNewData({
        name: "",
        email: "",
        cpf: "",
        salary: 0,
        hireDate: "",
        departmentId: departments[0]?.id?.toString() || "",
        positionId: "",
        isActive: true,
      });
      setError(null);
    } catch (e: any) {
      let apiMsg =
        (e?.response && (e.response.data?.message || e.response.data)) ||
        "Erro ao criar funcionário.";
      if (apiMsg && typeof apiMsg === "object" && apiMsg.errors) {
        apiMsg = Object.values(apiMsg.errors)
          .map((arr: any) => (Array.isArray(arr) ? arr.join("; ") : arr))
          .join("; ");
      }
      setError(
        `Erro ao criar funcionário${
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
      name: "",
      email: "",
      cpf: "",
      salary: 0,
      hireDate: "",
      departmentId: departments[0]?.id?.toString() || "",
      positionId: "",
      isActive: true,
    });
    setError(null);
  };

  // --- EDIÇÃO ---
  const handleEditOpen = (emp: EmployeeResponseDto) => {
    setEditingId(emp.id);
    setEditData({
      name: emp.name || "",
      email: emp.email || "",
      cpf: emp.cpf || "",
      salary: emp.salary ?? 0,
      hireDate: emp.hireDate || "",
      departmentId: emp.departmentId?.toString() || "",
      positionId: emp.positionId?.toString() || "",
      isActive: emp.isActive,
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
          : name === "salary"
          ? Number(value)
          : value,
      ...(name === "departmentId" ? { positionId: "" } : {}),
    }));
  };

  const handleEditConfirm = async () => {
    if (!editingId) return;
    if (
      !editData.name ||
      !editData.departmentId ||
      !editData.positionId
    ) {
      setError("Todos os campos são obrigatórios.");
      return;
    }
    const dto: EmployeeUpdateDto = {
      name: editData.name,
      email: editData.email,
      cpf: editData.cpf,
      salary: Number(editData.salary) || 0,
      hireDate: editData.hireDate || new Date().toISOString().slice(0, 10),
      departmentId: Number(editData.departmentId),
      positionId: Number(editData.positionId),
      isActive: !!editData.isActive,
    };
    try {
      await employeeService.updateEmployee(editingId, dto);
      await fetchAll();
      setShowEdit(false);
      setEditingId(null);
      setError(null);
    } catch (e: any) {
      let apiMsg =
        (e?.response && (e.response.data?.message || e.response.data)) ||
        "Erro ao editar funcionário.";
      if (apiMsg && typeof apiMsg === "object" && apiMsg.errors) {
        apiMsg = Object.values(apiMsg.errors)
          .map((arr: any) => (Array.isArray(arr) ? arr.join("; ") : arr))
          .join("; ");
      }
      setError(
        `Erro ao editar funcionário${
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
      await employeeService.deleteEmployee(deleteId);
      await fetchAll();
      setDeleteId(null);
      setError(null);
    } catch {
      setError("Erro ao excluir funcionário.");
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
    setError(null);
  };

  // Navegação para detalhes do empregado
  const handleEmployeeSelect = (emp: EmployeeResponseDto) => {
    navigate(getEmployeeDetailLink(emp));
  };

  // Filtra cargos por departamento e ativos
  const positionsByDepartment = (deptId: string | number) =>
    positions.filter(
      (p) => p.departmentId === Number(deptId) && p.isActive
    );

  if (notFound) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6 px-2 sm:py-14">
      <section className="w-full max-w-5xl bg-white shadow rounded-2xl border border-gray-200 px-5 py-8 sm:px-12 sm:py-10 flex flex-col gap-6">
        <div className="w-full flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between mb-6">
          <span className="flex items-center gap-4 sm:gap-6">
            <span className="text-purple-700">
              <EmployeeIcon />
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-sm tracking-tight">
              Funcionários
            </h1>
          </span>
          <button
            className="inline-flex items-center bg-emerald-600 text-white font-semibold rounded-lg px-6 py-2.5 shadow hover:bg-emerald-700 transition-colors text-base gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            type="button"
            aria-label="Criar novo funcionário"
            title="Criar novo funcionário"
            onClick={handleCreateOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path d="M10 5v10M5 10h10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Novo Funcionário
            <span className="sr-only">Adicionar novo funcionário à lista</span>
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
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold w-8 sm:w-auto">#</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Nome</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Departamento</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-gray-700 font-semibold">Cargo</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-center text-gray-700 font-semibold">Status</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-gray-700 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg">
                    Carregando...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-7 sm:px-4 sm:py-8 text-center text-gray-400 text-base sm:text-lg">
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              ) : (
                employees.map((emp, idx) => {
                  // Busca o departamento e o cargo
                  const dep = departments.find((d) => d.id === emp.departmentId);
                  const posi = positions.find((p) => p.id === emp.positionId);
                  return (
                  <tr
                    key={emp.id}
                    className="border-t last:border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 align-middle text-center">{idx + 1}</td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      {emp.name ? (
                        <Link
                          to={getEmployeeDetailLink(emp)}
                          style={{ color: "#6366f1", textDecoration: "underline", cursor: "pointer" }}
                          onClick={e => e.stopPropagation()}
                        >
                          {emp.name}
                        </Link>
                      ) : "-"}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      {dep ? (
                        <Link
                          to={getDepartmentDetailLink(dep)}
                          style={{ color: "#6366f1", textDecoration: "underline", cursor: "pointer" }}
                          onClick={e => e.stopPropagation()}
                        >
                          {dep.name}
                        </Link>
                      ) : "-"}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle">
                      {posi ? (
                        <Link
                          to={getPositionDetailLink(posi)}
                          style={{ color: "#6366f1", textDecoration: "underline", cursor: "pointer" }}
                          onClick={e => e.stopPropagation()}
                        >
                          {posi.title}
                        </Link>
                      ) : "-"}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 align-middle text-center">
                      <StatusBadge isActive={emp.isActive} />
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center bg-yellow-100 text-yellow-800 font-medium rounded-md px-3 py-1.5 shadow hover:bg-yellow-200 transition-colors text-sm gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                          title="Editar funcionário"
                          aria-label="Editar funcionário"
                          onClick={() => handleEditOpen(emp)}
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
                          title="Excluir funcionário"
                          aria-label="Excluir funcionário"
                          onClick={() => handleDeleteOpen(emp.id)}
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
                )}
              )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Painel de Edição */}
      <ActionPanel
        open={showEdit}
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
        onClose={handleEditCancel}
        type="edit"
        title="Editar Funcionário"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col font-medium text-gray-800">
            Nome do Funcionário
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              disabled={editingId == null}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            E-mail
            <input
              type="email"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              disabled={editingId == null}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            CPF
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="cpf"
              value={editData.cpf}
              onChange={handleEditChange}
              disabled={editingId == null}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Salário
            <input
              type="number"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="salary"
              value={editData.salary}
              onChange={handleEditChange}
              disabled={editingId == null}
              min={0}
              step={0.01}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Data de Admissão
            <input
              type="date"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="hireDate"
              value={
                typeof editData.hireDate === "string"
                  ? editData.hireDate || ""
                  : (editData.hireDate && typeof (editData.hireDate as any).toISOString === "function"
                      ? (editData.hireDate as any).toISOString().substring(0, 10)
                      : "")
              }
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
            Cargo
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="positionId"
              value={editData.positionId}
              onChange={handleEditChange}
              disabled={!editData.departmentId || editingId == null}
            >
              <option value="" disabled>
                Selecione o cargo
              </option>
              {positionsByDepartment(editData.departmentId).map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Situação do Funcionário
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
        title="Novo Funcionário"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col font-medium text-gray-800">
            Nome do Funcionário
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="name"
              value={newData.name}
              onChange={handleCreateChange}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            E-mail
            <input
              type="email"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="email"
              value={newData.email}
              onChange={handleCreateChange}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            CPF
            <input
              type="text"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="cpf"
              value={newData.cpf}
              onChange={handleCreateChange}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Salário
            <input
              type="number"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="salary"
              value={newData.salary}
              onChange={handleCreateChange}
              min={0}
              step={0.01}
            />
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Data de Admissão
            <input
              type="date"
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="hireDate"
              value={
                typeof newData.hireDate === "string"
                  ? newData.hireDate || ""
                  : (newData.hireDate && typeof (newData.hireDate as any).toISOString === "function"
                      ? (newData.hireDate as any).toISOString().substring(0, 10)
                      : "")
              }
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
            Cargo
            <select
              className="border rounded px-4 py-2 w-full sm:min-w-[220px] text-base mt-1"
              name="positionId"
              value={newData.positionId}
              onChange={handleCreateChange}
              disabled={!newData.departmentId}
            >
              <option value="" disabled>
                Selecione o cargo
              </option>
              {positionsByDepartment(newData.departmentId).map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col font-medium text-gray-800">
            Situação do Funcionário
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
            Tem certeza que deseja excluir este funcionário?
          </p>
        </div>
      </ActionPanel>
    </div>
  );
};

export default EmployeePage;