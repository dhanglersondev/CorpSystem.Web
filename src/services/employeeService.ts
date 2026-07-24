// DTOs para Employee (funcionário)
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
  // birthDate não faz parte do modelo principal aqui, apenas nos detalhes/DTOs de criação/atualização. 
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
  phone?: string;
}

export interface EmployeeCreateDto {
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string; // ISO 8601 string (yyyy-MM-dd)
  isActive: boolean;
  positionId: number;
  departmentId: number;
  phone?: string;
}

export interface EmployeeUpdateDto {
  name: string;
  email: string;
  cpf: string;
  salary: number;
  hireDate: string; // ISO 8601 string (yyyy-MM-dd)
  isActive: boolean;
  positionId: number;
  departmentId: number;
  phone?: string;
}

/**
 * Metadata de departamentos e cargos para cadastro de funcionário
 */
export interface EmployeeDepartmentMetadata {
  departmentId: number;
  departmentName: string;
  positions: {
    positionId: number;
    positionTitle: string;
  }[];
}

import { api } from "./api";

/**
 * Serviço para comunicação com a API Employee.
 * Implementa métodos que espelham os endpoints do EmployeeController do backend.
 */
export const employeeService = {
  /**
   * GET: api/Employee
   * Obtém lista simplificada de funcionários.
   * Corresponde ao GET: api/Employee do backend.
   */
  async getEmployees(): Promise<EmployeeResponseDto[]> {
    const response = await api.get<EmployeeResponseDto[]>("/Employee");
    return response.data;
  },

  /**
   * GET: api/Employee/{id}
   * Obtém detalhes completos de um funcionário, incluindo departmentName e positionTitle.
   * Corresponde ao GET: api/Employee/{id} do backend.
   */
  async getEmployee(id: number): Promise<EmployeeDetailsDto> {
    const response = await api.get<EmployeeDetailsDto>(`/Employee/${id}`);
    return response.data;
  },

  /**
   * GET: api/Employee/metadata
   * Lista todos os departamentos e seus cargos associados para cadastro de funcionário.
   * Corresponde ao GET: api/Employee/metadata do backend.
   * Retorna: { departments: EmployeeDepartmentMetadata[] }
   */
  async getEmployeeMetadata(): Promise<{ departments: EmployeeDepartmentMetadata[] }> {
    const response = await api.get<{ departments: EmployeeDepartmentMetadata[] }>("/Employee/metadata");
    return {
      departments: response.data.departments ?? [],
    };
  },

  /**
   * POST: api/Employee
   * Cria um novo funcionário.
   * Corresponde ao POST: api/Employee do backend.
   * Se o departamento ou cargo não existir, retorna erro.
   */
  async createEmployee(dto: EmployeeCreateDto): Promise<EmployeeResponseDto> {
    const response = await api.post<EmployeeResponseDto>("/Employee", dto);
    return response.data;
  },

  /**
   * PUT: api/Employee/{id}
   * Atualiza os dados de um funcionário existente.
   * Corresponde ao PUT: api/Employee/{id} do backend.
   * Se o funcionário, departamento ou cargo não existir, retorna erro.
   */
  async updateEmployee(id: number, dto: EmployeeUpdateDto): Promise<EmployeeResponseDto> {
    const response = await api.put<EmployeeResponseDto>(`/Employee/${id}`, dto);
    return response.data;
  },

  /**
   * DELETE: api/Employee/{id}
   * Remove um funcionário do banco de dados.
   * Corresponde ao DELETE: api/Employee/{id} do backend.
   */
  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/Employee/${id}`);
  },

  /**
   * PUT: api/Employee/{id}/status?activate={true|false}
   * Ativa ou desativa um funcionário.
   * Corresponde ao PUT: api/Employee/{id}/status?activate={true|false} do backend.
   */
  async setEmployeeStatus(id: number, activate: boolean): Promise<EmployeeResponseDto> {
    const response = await api.put<EmployeeResponseDto>(`/Employee/${id}/status?activate=${activate}`);
    return response.data;
  },
};
