import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  positionService,
  type PositionResponseDto,
} from "../../services/positionService";
import {
  departmentService,
  type DepartmentResponseDto,
} from "../../services/departmentService";
// employee inicialmente ficticio
type EmployeeResponseDto = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  positionId: number;
};
// Simula um serviço de empregados fake
const employeeService = {
  async getEmployees(): Promise<EmployeeResponseDto[]> {
    // Retorna dados fictícios, pode trocar/ampliar conforme desejado
    return [
      {
        id: 1,
        name: "Maria Souza",
        email: "maria.souza@empresa.com",
        isActive: true,
        positionId: 1,
      },
      {
        id: 2,
        name: "João Rosa",
        email: "joao.rosa@empresa.com",
        isActive: false,
        positionId: 2,
      },
      {
        id: 3,
        name: "Carlos Silva",
        email: "carlos.silva@empresa.com",
        isActive: true,
        positionId: 1,
      },
    ];
  },
};

import NotFound from "../NotFound/NotFound";

// SVG Position Icon (segue padrão visual visto em DepartmentDetail)
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

const PositionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const navigate = useNavigate();

  const [position, setPosition] = useState<PositionResponseDto | null>(null);
  const [department, setDepartment] = useState<DepartmentResponseDto | null>(null);
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  // Painéis que podem ser usados p/ edição/exclusão futura: (mantendo padrão)
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editStatus, setEditStatus] = useState<boolean>(true);
  const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Buscar detalhes da posição
  const fetchPosition = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await positionService.getPosition(numericId);
      setPosition(data);
      // Busca departamento relacionado
      if (data?.departmentId) {
        try {
          const dep = await departmentService.getDepartment(data.departmentId);
          setDepartment(dep);
        } catch {
          setDepartment(null);
        }
      } else {
        setDepartment(null);
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFound(true);
        return;
      }
      setError("Erro ao carregar cargo.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar funcionários vinculados a este cargo
  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees();
      setEmployees(
        Array.isArray(data)
          ? data.filter((e) => e.positionId === numericId)
          : []
      );
    } catch {
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (!isNaN(numericId)) {
      fetchPosition();
      fetchEmployees();
    }
    // eslint-disable-next-line
  }, [id]);

  // Painéis de edição/exclusão (mantidos como referência, podem ser removidos)
  // Omitidos handlers, a menos que solicitado.

  if (notFound) return <NotFound />;

  // Mensagem centralizada se estiver carregando ou erro
  if (loading || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <section className="w-full max-w-3xl bg-white shadow rounded-2xl border border-gray-200 px-10 py-10 flex flex-col gap-8">
          <div className="flex gap-4 items-center mb-8">
            <span className="text-blue-700">
              <PositionIcon className="w-10 h-10" />
            </span>
            <h1 className="text-3xl font-bold text-gray-800">
              Detalhes do Cargo
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
          <PositionIcon className="w-10 h-10 text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-800">
            Detalhes do Cargo
          </h1>
        </div>
        {/* INFORMAÇÕES PRINCIPAIS */}
        {position && (
          <>
            <div className="w-full border-b border-gray-200 pb-6 mb-8">
              {/* Título, status e departamento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 items-center">
                {/* Cargo */}
                <div className="flex flex-row items-center gap-2 md:col-span-2">
                  <div className="font-bold min-w-[75px] text-lg">Cargo:</div>
                  <div
                    style={{
                      letterSpacing: "0.01em",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                    }}
                    className="truncate text-gray-900 text-base"
                  >
                    {position.title}
                  </div>
                </div>
                {/* Status */}
                <div className="flex flex-row items-center gap-2 md:justify-end">
                  <span className="font-bold">Status:</span>
                  {position.isActive ? (
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
              {/* Departamento vinculado */}
              <div className="mt-6 flex flex-row items-center gap-2">
                <span className="font-bold min-w-[120px] text-base">Departamento:</span>
                {department ? (
                  <Link
                    to={`/departments/${department.id}`}
                    className="text-blue-700 hover:underline font-semibold truncate"
                  >
                    {department.name}
                  </Link>
                ) : (
                  <span className="text-gray-400 italic">Não vinculado</span>
                )}
              </div>
              {/* Botões editar/excluir removidos para não afetar o padrão, exceto se desejado */}
            </div>

            {/* Lista/tabela de funcionários */}
            <div>
              <div className="flex items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800 mb-0">
                  Funcionários Neste Cargo
                </h2>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="min-w-full bg-white text-base">
                  <thead>
                    <tr className="bg-gray-100 h-[48px]">
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold align-middle">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold align-middle min-w-[180px]">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold align-middle min-w-[150px]">
                        E-mail
                      </th>
                      <th className="px-4 py-3 text-center text-gray-700 font-semibold align-middle w-44">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!employees.length ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-12 text-center text-gray-400 text-lg"
                        >
                          Nenhum funcionário vinculado a este cargo.
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp, idx) => (
                        <tr
                          key={emp.id}
                          className="border-t last:border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 align-middle text-gray-700 text-center font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 align-middle font-semibold text-gray-900 whitespace-nowrap truncate max-w-xs">
                            <Link
                              to={`/employees/${emp.id}`}
                              className="text-blue-700 hover:underline"
                            >
                              {emp.name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 align-middle text-gray-700 whitespace-nowrap truncate max-w-xs">
                            {emp.email}
                          </td>
                          <td className="px-4 py-3 align-middle text-center">
                            {emp.isActive ? (
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
      {/* Serviços/handlers ActionPanel (edição/exclusão) podem ser adicionados se necessário */}
    </div>
  );
};

export default PositionDetail;