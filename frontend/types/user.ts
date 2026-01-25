export interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    email: string;
    phone: string;
    username: string;
    password: string;
    ssn: string;
    dateOfBirth: string; // ISO date string
    address: Address;
    company: Company;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    latitude: number;
    longitude: number;
}

export interface Company {
    name: string;
    jobTitle: string;
}
