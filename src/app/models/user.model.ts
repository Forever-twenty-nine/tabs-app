import { Rol } from '../enums/rol.enum';
import { Permiso } from '../enums/permiso.enum';
import { ClienteTabsSet } from '../enums/cliente-tabs.enum';
import { GimnasioTabsSet } from '../enums/gimnasio-tabs.enum';

/**
 * Modelo de Usuario - Contiene SOLO información de autenticación y control de acceso.
 * No debe contener datos específicos de roles como cliente, entrenador, etc.
 */
export interface User {
  uid: string;
  nombre: string;
  email: string;
  onboarded?: boolean;
  roles: Rol[]; 
  permisos?: Permiso[];
  // Configuración de tabs específica para clientes
  clienteTabsSet?: ClienteTabsSet;
  // Configuración de tabs específica para gimnasios
  gimnasioTabsSet?: GimnasioTabsSet;
}
