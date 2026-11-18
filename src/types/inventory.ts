export type Transmission = "Automática" | "Mecánica";

export type FuelType = "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico";

export type VehicleLine = "Normal" | "Prestige" | "Importacion";

export type InventoryStatus = "Disponible" | "Reservado" | "Vendido";

export type Vehicle = {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  transmision: Transmission;
  combustible: FuelType;
  motor: string;
  precio: number;
  linea: VehicleLine;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  fotos: string[];
};

export type Parcel = {
  id: string;
  titulo: string;
  ubicacion: string;
  area_m2: number;
  precio: number;
  servicios: string;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  fotos: string[];
};

export type JobRole =
  | "Asesor Comercial"
  | "Perito"
  | "Administrativo"
  | "Otro";
