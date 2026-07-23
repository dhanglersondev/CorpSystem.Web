import { api } from "./api";

/**
 * DTOs para operações de funcionário
 */
export interface EmployeeResponseDto {
  id: number;
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  positionId: number;
  departmentId: number;
}

export interface EmployeeDetailsDto {
  id: number;
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
  positionId: number;
  positionTitle: string;
}

export interface EmployeeCreateDto {
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string | Date;
  positionId: number;
  departmentId: number;
  isActive: boolean;
}

export interface EmployeeUpdateDto {
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string | Date;
  positionId: number;
  departmentId: number;
  isActive: boolean;
}

export const employeeService = {
  /**
   * GET: api/Employee
   * Busca todos os funcionários.
   */
  async getEmployees(): Promise<EmployeeResponseDto[]> {
    // A API retorna todos os funcionários com ToResponseDto
    const response = await api.get<EmployeeResponseDto[]>("/Employee");
    return response.data;
  },

  /**
   * GET: api/Employee/{id}
   * Busca detalhes de um funcionário.
   */
  async getEmployee(id: number): Promise<EmployeeDetailsDto> {
    // A API retorna EmployeeDetailsDto com dept & position names
    const response = await api.get<EmployeeDetailsDto>(`/Employee/${id}`);
    return response.data;
  },

  /**
   * POST: api/Employee
   * Cria um novo funcionário.
   */
  async createEmployee(dto: EmployeeCreateDto): Promise<EmployeeResponseDto> {
    /**
     * O backend valida:
     * - Se o cargo existe para o Departamento.
     * - hireDate deve ser Date or string ISO (ideal YYYY-MM-DDTHH:mm:ssZ, mas o DateOnly parseia YYYY-MM-DD).
     */
    const fixedDto = {
      ...dto,
      hireDate:
        typeof dto.hireDate === "string"
          ? dto.hireDate
          : (dto.hireDate as Date).toISOString().substring(0, 10), // YYYY-MM-DD
    };
    const response = await api.post<EmployeeResponseDto>("/Employee", fixedDto);
    return response.data;
  },

  /**
   * PUT: api/Employee/{id}
   * Atualiza um funcionário existente.
   */
  async updateEmployee(id: number, dto: EmployeeUpdateDto): Promise<EmployeeResponseDto> {
    /**
     * O backend valida:
     * - Se existe o funcionário.
     * - Cargo e dept.
     * - hireDate suporta string/Date no formato YYYY-MM-DD.
     */
    const fixedDto = {
      ...dto,
      hireDate:
        typeof dto.hireDate === "string"
          ? dto.hireDate
          : (dto.hireDate as Date).toISOString().substring(0, 10), // YYYY-MM-DD
    };
    const response = await api.put<EmployeeResponseDto>(`/Employee/${id}`, fixedDto);
    return response.data;
  },

  /**
   * DELETE: api/Employee/{id}
   * Remove um funcionário.
   */
  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/Employee/${id}`);
  },

  /**
   * PUT: api/Employee/{id}/status?activate={true|false}
   * Ativa ou desativa o funcionário.
   */
  async setEmployeeStatus(id: number, activate: boolean): Promise<EmployeeResponseDto> {
    // O backend espera activate como query param ?activate={true|false}
    const response = await api.put<EmployeeResponseDto>(
      `/Employee/${id}/status?activate=${activate}`
    );
    return response.data;
  },
};