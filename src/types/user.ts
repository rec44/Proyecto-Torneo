export interface User {
  id: string;
  name: string;
  email: string;
  role: "usuario" | "admin";
  password: string;
}