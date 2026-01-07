import { api } from "../axios.config";
import { ApiEndpoints } from "../endpoints";
import type { ApiResponse, PaginationParams } from "../../interfaces/apiRequestInterface";
import type { Employee, EmployeeLoginList } from "../../interfaces/employeeInterface";

export interface EmployeeListResponse {
  data: Employee[];
}

export interface EmployeeLoginRequest {
  username: string;
  password: string;
}

export interface EmployeeLoginResponse {
  userId: string;
  accessToken: string;
  refreshToken?: string;
  message: string;
}

export const employeeService = {
  getEmployees: async (params?: PaginationParams): Promise<ApiResponse<EmployeeListResponse>> => {
    const response = (await api.get<ApiResponse<EmployeeListResponse>>(ApiEndpoints.GET_EMPLOYEES, { params }));
    console.log("Employees API Raw Response:", response); // Debug
    return response.data; // Return the object directly
  },

  getEmployeesForLogin: async (): Promise<ApiResponse<EmployeeLoginList[]>> => {
    const response = (await api.get<ApiResponse<EmployeeLoginList[]>>(ApiEndpoints.GET_EMPLOYEES_FOR_LOGIN));
    console.log("Employees API Raw Response:", response); // Debug
    return response.data; // Return the object directly
  },

  getEmployeeById: async (employeeId: string): Promise<Employee> => {
    const response = await api.get<ApiResponse<Employee>>(ApiEndpoints.GET_EMPLOYEE_BY_ID(employeeId));
    return response.data.data;
  },

  createEmployee: async (employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await api.post<ApiResponse<Employee>>(ApiEndpoints.CREATE_EMPLOYEE, employeeData);
    return response.data.data;
  },

  updateEmployee: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const response = await api.put<ApiResponse<Employee>>(
      ApiEndpoints.UPDATE_EMPLOYEE(id),
      employee
    );
    return response.data.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(ApiEndpoints.DELETE_EMPLOYEE(id));
  },

  login: async (loginData: EmployeeLoginRequest): Promise<EmployeeLoginResponse> => {
    console.log("Employee Login API Request Data:", loginData); // Debug
    const response = await api.post<EmployeeLoginResponse>(ApiEndpoints.LOGIN, loginData);
    return response.data;
  },
};
