import { api } from "./api";

// DTO definitions for position operations

export interface PositionResponseDto {
  id: number;
  title: string;
  isActive: boolean;
  departmentId: number;
}

export interface PositionDetailsDto {
  id: number;
  title: string;
  isActive: boolean;
  departmentId: number;
  departmentName: string;
}

export interface PositionCreateDto {
  title: string;
  departmentId: number;
  isActive: boolean;
}

export interface PositionUpdateDto {
  title: string;
  departmentId: number;
  isActive: boolean;
}

export const positionService = {
  /**
   * GET: api/Position
   * Obtém a lista de cargos (Position).
   */
  async getPositions(): Promise<PositionResponseDto[]> {
    const response = await api.get<PositionResponseDto[]>("/Position");
    return response.data;
  },

  /**
   * GET: api/Position/{id}
   * Busca detalhes de um cargo por id, incluindo departmentName.
   */
  async getPosition(id: number): Promise<PositionDetailsDto> {
    const response = await api.get<PositionDetailsDto>(`/Position/${id}`);
    return response.data;
  },

  /**
   * POST: api/Position
   * Cria um novo cargo. 
   * A API valida se o departmentId existe.
   */
  async createPosition(dto: PositionCreateDto): Promise<PositionResponseDto> {
    const response = await api.post<PositionResponseDto>("/Position", dto);
    return response.data;
  },

  /**
   * PUT: api/Position/{id}
   * Atualiza um cargo existente pelo id.
   */
  async updatePosition(id: number, dto: PositionUpdateDto): Promise<PositionResponseDto> {
    const response = await api.put<PositionResponseDto>(`/Position/${id}`, dto);
    return response.data;
  },

  /**
   * DELETE: api/Position/{id}
   * Remove um cargo do banco de dados.
   */
  async deletePosition(id: number): Promise<void> {
    await api.delete(`/Position/${id}`);
  },

  /**
   * PUT: api/Position/{id}/status?activate={true|false}
   * Ativa ou desativa um cargo, conforme o parâmetro 'activate'.
   */
  async setPositionStatus(id: number, activate: boolean): Promise<PositionResponseDto> {
    const response = await api.put<PositionResponseDto>(`/Position/${id}/status?activate=${activate}`);
    return response.data;
  },
};