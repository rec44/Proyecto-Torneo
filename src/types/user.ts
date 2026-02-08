export interface User {
  id: number;
  name: string;
  email: string;
  role: "usuario" | "admin";
  password: string;
}