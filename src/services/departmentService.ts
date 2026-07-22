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
  async getDepartments(): Promise<DepartmentResponseDto[]> {
    const response = await api.get<DepartmentResponseDto[]>("/Department");
    return response.data;
  },

  async getDepartment(id: number): Promise<DepartmentResponseDto> {
    const response = await api.get<DepartmentResponseDto>(`/Department/${id}`);
    return response.data;
  },

  async createDepartment(department: DepartmentCreateDto): Promise<DepartmentResponseDto> {
    const response = await api.post<DepartmentResponseDto>("/Department", department);
    return response.data;
  },

  async updateDepartment(id: number, department: DepartmentUpdateDto): Promise<DepartmentResponseDto> {
    const response = await api.put<DepartmentResponseDto>(`/Department/${id}`, department);
    return response.data;
  },

  async deleteDepartment(id: number): Promise<void> {
    await api.delete(`/Department/${id}`);
  },

  async setDepartmentStatus(id: number, activate: boolean): Promise<DepartmentResponseDto> {
    const response = await api.put<DepartmentResponseDto>(`/Department/${id}/status?activate=${activate}`);
    return response.data;
  },
};