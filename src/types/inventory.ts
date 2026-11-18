export type Transmission = "Automática" | "Mecánica";

export type FuelType = "Gasolina" | "Diésel" | "Híbrido" | "Eléctrico";

export type VehicleLine = "NORMAL" | "PRESTIGE" | "IMPORTACION";

export type InventoryStatus = "DISPONIBLE" | "RESERVADO" | "VENDIDO";

export type MediaTipo = "IMAGE" | "VIDEO";

export type LeadTipo =
  | "CONSIGNACION"
  | "IMPORTACION"
  | "CONTACTO"
  | "CITA";

export type MediaItem = {
  id: string;
  url: string;
  key: string;
  tipo: MediaTipo;
  orden: number;
  esPortada: boolean;
};

export type Vehicle = {
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  transmision: Transmission;
  combustible: FuelType;
  motor: string;
  traccion: string;
  color: string;
  placa: string;
  blindaje: string;
  precio: number;
  linea: VehicleLine;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  media: MediaItem[];
};

export type Parcel = {
  id: string;
  slug: string;
  titulo: string;
  ubicacion: string;
  area_m2: number;
  precio: number;
  servicios: string;
  topografia: string;
  documentacion: string;
  estado: InventoryStatus;
  destacado: boolean;
  descripcion: string;
  media: MediaItem[];
};

export type JobRole =
  | "Asesor Comercial"
  | "Perito Automotriz"
  | "Gestor de Trámites"
  | "Administrativo"
  | "Otro";

export type ConsignmentMode =
  | "Consignación en vitrina"
  | "Compra directa"
  | "Retoma por otro vehículo";
