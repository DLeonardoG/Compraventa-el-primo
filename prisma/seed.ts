import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

function shot(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;
}

function mediaCreate(urls: string[], prefix: string) {
  return {
    create: urls.map((url, index) => ({
      url,
      key: `seed/${prefix}-${index}`,
      tipo: "IMAGE",
      orden: index,
      esPortada: index === 0,
    })),
  };
}

async function main() {
  await prisma.media.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.parcel.deleteMany();

  const vehicles = [
    {
      marca: "Toyota",
      modelo: "Fortuner SRV 2.8",
      anio: 2023,
      kilometraje: 41200,
      transmision: "Automática",
      combustible: "Diésel",
      motor: "2.8 D-4D",
      traccion: "4x4",
      color: "Blanco perla",
      placa: "Terminada en 3",
      blindaje: "Sin blindaje",
      precio: 238000000,
      categoria: "SUV",
      linea: "NORMAL",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Fortuner SRV diésel con peritaje certificado, un solo dueño y mantenimiento en concesionario. Lista para traspaso y financiación.",
      urls: [
        shot("photo-1519641471654-76ce0107ad1b"),
        shot("photo-1549317661-bd32c8ce0db2"),
        shot("photo-1533473359331-0135ef1b58bf"),
      ],
    },
    {
      marca: "Toyota",
      modelo: "Land Cruiser Prado TX-L",
      anio: 2021,
      kilometraje: 68400,
      transmision: "Automática",
      combustible: "Diésel",
      motor: "2.8 Turbo",
      traccion: "4x4",
      color: "Gris platino",
      placa: "Terminada en 7",
      blindaje: "Sin blindaje",
      precio: 268000000,
      categoria: "SUV",
      linea: "NORMAL",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Prado TX-L con tercera fila, techo y asistencia de descenso. Historial de servicio al día y SOAT vigente.",
      urls: [
        shot("photo-1533473359331-0135ef1b58bf"),
        shot("photo-1519641471654-76ce0107ad1b"),
        shot("photo-1503376780353-7e6692767b70"),
      ],
    },
    {
      marca: "Porsche",
      modelo: "Macan S",
      anio: 2021,
      kilometraje: 28600,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "2.9 Twin-Turbo",
      traccion: "AWD",
      color: "Negro jet",
      placa: "Terminada en 9",
      blindaje: "Sin blindaje",
      precio: 329000000,
      categoria: "SUV",
      linea: "PRESTIGE",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Macan S de línea Prestige. Interior en cuero, paquete Sport Chrono y peritaje de alta gama antes de entrega.",
      urls: [
        shot("photo-1503376780353-7e6692767b70"),
        shot("photo-1614162692292-7ac56d7f7f1e"),
        shot("photo-1544636331-e26879cd4d9b"),
      ],
    },
    {
      marca: "BMW",
      modelo: "X5 xDrive40i",
      anio: 2022,
      kilometraje: 33400,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "3.0 TwinPower",
      traccion: "xDrive",
      color: "Gris mineral",
      placa: "Terminada en 2",
      blindaje: "Sin blindaje",
      precio: 295000000,
      categoria: "SUV",
      linea: "PRESTIGE",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "X5 xDrive40i con asistencia de conducción, techo panorámico y suspensión neumática. Unidad curada para la línea Prestige.",
      urls: [
        shot("photo-1555215695-3004980ad54e"),
        shot("photo-1617531653332-bd46c24f2068"),
        shot("photo-1555215695-3004980ad54e"),
      ],
    },
    {
      marca: "Mercedes-Benz",
      modelo: "GLC 300",
      anio: 2022,
      kilometraje: 22100,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "2.0 Turbo",
      traccion: "4MATIC",
      color: "Plata iridio",
      placa: "Terminada en 5",
      blindaje: "Sin blindaje",
      precio: 248000000,
      categoria: "SUV",
      linea: "PRESTIGE",
      estado: "RESERVADO",
      destacado: true,
      descripcion:
        "GLC 300 4MATIC con paquete AMG Line y MBUX. Reservado con seña; se publica para lista de espera y unidades similares.",
      urls: [
        shot("photo-1618843479313-40f8afb4b4d8"),
        shot("photo-1606664515524-ed2f786a0bd6"),
        shot("photo-1605559424843-9e4c228bf1c2"),
      ],
    },
    {
      marca: "Ford",
      modelo: "Ranger Raptor",
      anio: 2023,
      kilometraje: 14800,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "3.0 V6 EcoBoost",
      traccion: "4x4",
      color: "Azul performance",
      placa: "En nacionalización",
      blindaje: "Sin blindaje",
      precio: 312000000,
      categoria: "Pickup",
      linea: "IMPORTACION",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Ranger Raptor de importación directa. Suspensión Fox, modo Baja y entrega acompañada hasta la matrícula en Colombia.",
      urls: [
        shot("photo-1559416523-140ddc3d238c"),
        shot("photo-1533473359331-0135ef1b58bf"),
        shot("photo-1494976388531-d1058494cdd8"),
      ],
    },
  ];

  for (const vehicle of vehicles) {
    const { urls, ...data } = vehicle;
    const slug = slugify(`${data.marca}-${data.modelo}-${data.anio}`);
    await prisma.vehicle.create({
      data: {
        ...data,
        slug,
        media: mediaCreate(urls, slug),
      },
    });
  }

  const parcels = [
    {
      titulo: "Parcelación campestre El Retiro",
      ubicacion: "El Retiro, Antioquia",
      areaM2: 850,
      precio: 420000000,
      servicios: "Agua, Luz, Vía pavimentada, Portería",
      topografia: "Pendiente suave",
      documentacion: "Escritura pública y libertad de tradición",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Lote dentro de parcelación cerrada, orientación de tarde y retiro suficiente para casa de un nivel con zona verde.",
      urls: [
        shot("photo-1500382017468-9049fed747ef"),
        shot("photo-1469474968028-56623f02e42e"),
      ],
    },
    {
      titulo: "Lote vista al valle de La Calera",
      ubicacion: "La Calera, Cundinamarca",
      areaM2: 1200,
      precio: 380000000,
      servicios: "Agua, Luz, Vía destapada en buen estado",
      topografia: "Vista abierta, pendiente media",
      documentacion: "Promesa de compraventa y certificados al día",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Terreno campestre con visual despejada, apto para vivienda de descanso a menos de una hora de Bogotá.",
      urls: [
        shot("photo-1464822759023-fed622ff2c3b"),
        shot("photo-1501785888041-af3ef285b470"),
      ],
    },
    {
      titulo: "Hacienda lote plano Guatapé",
      ubicacion: "Guatapé, Antioquia",
      areaM2: 2500,
      precio: 290000000,
      servicios: "Agua, Luz, Acceso vehicular",
      topografia: "Plana",
      documentacion: "Certificado de libertad vigente",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Lote amplio y plano cerca del embalse, con frente suficiente para casa campestre y zona de cultivo menor.",
      urls: [
        shot("photo-1441974231531-c6227db76b6e"),
        shot("photo-1470071459604-3b5ec3a7fe05"),
      ],
    },
  ];

  for (const parcel of parcels) {
    const { urls, ...data } = parcel;
    const slug = slugify(data.titulo);
    await prisma.parcel.create({
      data: {
        ...data,
        slug,
        media: mediaCreate(urls, slug),
      },
    });
  }

  console.log("Seed completed: 6 vehicles, 3 parcels");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
