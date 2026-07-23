import { api } from "./api";

export interface DepartmentResponseDto {
  id: number;
  name: string;
  isActive: boolean;
}

export interface DepartmentCreateDto {
  name: string;
  isActive: boolean;
}

export interface DepartmentUpdateDto {
  name: string;
  isActive: boolean;
}

export const departmentService = {
  /**
   * Busca a lista de departamentos.
   * GET: api/Department
   */
  async getDepartments(): Promise<DepartmentResponseDto[]> {
    // Retorna todos os departamentos no formato simplificado
    const response = await api.get<DepartmentResponseDto[]>("/Department");
    return response.data;
  },

  /**
   * Busca detalhes de um departamento por ID.
   * GET: api/Department/{id}
   */
  async getDepartment(id: number): Promise<DepartmentResponseDto> {
    const response = await api.get<DepartmentResponseDto>(`/Department/${id}`);
    return response.data;
  },

  /**
   * Cria um novo departamento.
   * POST: api/Department
   */
  async createDepartment(dto: DepartmentCreateDto): Promise<DepartmentResponseDto> {
    const response = await api.post<DepartmentResponseDto>("/Department", dto);
    return response.data;
  },

  /**
   * Atualiza os dados de um departamento existente.
   * PUT: api/Department/{id}
   */
  async updateDepartment(id: number, dto: DepartmentUpdateDto): Promise<DepartmentResponseDto> {
    const response = await api.put<DepartmentResponseDto>(`/Department/${id}`, dto);
    return response.data;
  },

  /**
   * Exclui um departamento.
   * DELETE: api/Department/{id}
   */
  async deleteDepartment(id: number): Promise<void> {
    await api.delete(`/Department/${id}`);
  },

  /**
   * Ativa ou desativa um departamento.
   * PUT: api/Department/{id}/status?activate={true|false}
   * @param id ID do departamento
   * @param activate true para ativar, false para desativar
   * Se desativar um departamento, os cargos relacionados também serão desativados pela API.
   */
  async setDepartmentStatus(id: number, activate: boolean): Promise<DepartmentResponseDto> {
    const response = await api.put<DepartmentResponseDto>(`/Department/${id}/status?activate=${activate}`);
    return response.data;
  },
};