export interface User {
  uid: string;
  nombre: string;
  email: string;
  role?: string;
  roles?: string[];
  entrenadorId?: string;
  gimnasioId?: string;
  onboarded?: boolean;
}
