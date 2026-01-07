import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { PaginationParams } from "../interfaces/apiRequestInterface";
import {
  employeeService,
  type EmployeeLoginRequest,
} from "../api/services/employeeService";
import type { Employee } from "../interfaces/employeeInterface";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const employeeKeys = {
  all: ["employees"] as const,
  listforlogin: () => ["listforlogin"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
};

export const useEmployees = (params?: PaginationParams) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: async () => {
      const response = await employeeService.getEmployees(params);
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployeesForLogin = () => {
  return useQuery({
    queryKey: employeeKeys.listforlogin(),
    queryFn: async () => {
      const response = await employeeService.getEmployeesForLogin();
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: Partial<Employee>) =>
      employeeService.createEmployee(employee),

    onSuccess: (newEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.setQueryData(
        employeeKeys.detail(newEmployee.employeeId),
        newEmployee
      );
      toast.success("Employee created successfully!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create employee");
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      employee,
    }: {
      id: string;
      employee: Partial<Employee>;
    }) => employeeService.updateEmployee(id, employee),

    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.setQueryData(
        employeeKeys.detail(updatedEmployee.employeeId),
        updatedEmployee
      );
      toast.success("Employee updated successfully!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update employee");
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),

    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: employeeKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success("Employee deleted successfully!");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete employee");
    },
  });
};

export const useEmployeeLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (loginData: EmployeeLoginRequest) =>
      employeeService.login(loginData),
    onSuccess: (data) => {
      console.log("success response", data);
      localStorage.setItem("authToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      toast.success(data.message || "Login successful!");
      navigate("/home");
    },
    onError: (error) => { 
      console.log("error response", error);
      const message = error?.message || "Login failed. Please check your PIN.";
      toast.error(message);
    },
  });
};
