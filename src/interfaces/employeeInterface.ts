export interface Employee {
    employeeId: string;
    userId: string; 
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nic: string;
    salary: string;
    status: ("Active"|"Suspended"|"Resigned");
    date_joined: string;
    created_at: string;
}