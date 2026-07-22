import { api } from "./api";

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
  async getPositions(): Promise<PositionResponseDto[]> {
    const response = await api.get<PositionResponseDto[]>("/Position");
    return response.data;
  },

  async getPosition(id: number): Promise<PositionDetailsDto> {
    const response = await api.get<PositionDetailsDto>(`/Position/${id}`);
    return response.data;
  },

  async createPosition(dto: PositionCreateDto): Promise<PositionResponseDto> {
    const response = await api.post<PositionResponseDto>("/Position", dto);
    return response.data;
  },

  async updatePosition(id: number, dto: PositionUpdateDto): Promise<PositionResponseDto> {
    const response = await api.put<PositionResponseDto>(`/Position/${id}`, dto);
    return response.data;
  },

  async deletePosition(id: number): Promise<void> {
    await api.delete(`/Position/${id}`);
  },

  async setPositionStatus(id: number, activate: boolean): Promise<PositionResponseDto> {
    const response = await api.put<PositionResponseDto>(`/Position/${id}/status?activate=${activate}`);
    return response.data;
  },
};