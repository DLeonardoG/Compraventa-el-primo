import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const cars = [
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
];

const lands = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
];

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
  await prisma.lead.deleteMany();
  await prisma.jobApplication.deleteMany();

  const vehicles = [
    {
      marca: "Toyota",
      modelo: "Corolla XEI",
      anio: 2022,
      kilometraje: 28500,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "1.8 L",
      traccion: "4x2",
      color: "Plata metalizado",
      placa: "Terminada en 4",
      blindaje: "Sin blindaje",
      precio: 85000000,
      linea: "NORMAL",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Peritaje certificado, SOAT y Tecnomecánica vigentes. Único dueño, traspaso inmediato y listo para financiación hasta el 100%.",
      urls: [cars[0], cars[1], cars[2]],
    },
    {
      marca: "Mazda",
      modelo: "CX-5 Grand Touring",
      anio: 2021,
      kilometraje: 41200,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "2.5 L",
      traccion: "AWD",
      color: "Rojo Soul",
      placa: "Terminada en 8",
      blindaje: "Sin blindaje",
      precio: 118000000,
      linea: "PRESTIGE",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Línea Prestige: techo panorámico, cuero y Bose. Recibimos tu usado en parte de pago.",
      urls: [cars[4], cars[5], cars[3]],
    },
    {
      marca: "BMW",
      modelo: "X3 xDrive30i",
      anio: 2019,
      kilometraje: 68400,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "2.0 Turbo",
      traccion: "xDrive",
      color: "Negro zafiro",
      placa: "Terminada en 6",
      blindaje: "Sin blindaje",
      precio: 145000000,
      linea: "PRESTIGE",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Prestige con asistencia a la conducción, peritaje certificado y traspaso seguro.",
      urls: [cars[6], cars[7], cars[4]],
    },
    {
      marca: "Renault",
      modelo: "Duster Intens",
      anio: 2023,
      kilometraje: 18200,
      transmision: "Mecánica",
      combustible: "Gasolina",
      motor: "1.3 Turbo",
      traccion: "4x2",
      color: "Gris titanium",
      placa: "Terminada en 1",
      blindaje: "Sin blindaje",
      precio: 78000000,
      linea: "NORMAL",
      estado: "DISPONIBLE",
      destacado: false,
      descripcion:
        "Pocos kilómetros, garantía vigente. Ideal para trabajo o familia.",
      urls: [cars[3], cars[0]],
    },
    {
      marca: "Mercedes-Benz",
      modelo: "GLC 300 4MATIC",
      anio: 2021,
      kilometraje: 33800,
      transmision: "Automática",
      combustible: "Gasolina",
      motor: "2.0 Turbo",
      traccion: "4MATIC",
      color: "Gris selenita",
      placa: "En trámite",
      blindaje: "Sin blindaje",
      precio: 210000000,
      linea: "IMPORTACION",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Importación directa: paquete AMG Line, interiores premium y tecnología MBUX.",
      urls: [cars[5], cars[4], cars[7]],
    },
    {
      marca: "Audi",
      modelo: "Q5 45 TFSI",
      anio: 2020,
      kilometraje: 47500,
      transmision: "Automática",
      combustible: "Híbrido",
      motor: "2.0 TFSI Quattro",
      traccion: "Quattro",
      color: "Blanco glaciar",
      placa: "En tránsito",
      blindaje: "Sin blindaje",
      precio: 195000000,
      linea: "IMPORTACION",
      estado: "DISPONIBLE",
      destacado: false,
      descripcion:
        "Importación en tránsito: Virtual Cockpit y suspensión adaptativa.",
      urls: [cars[7], cars[6], cars[1]],
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
      titulo: "Lote residencial Vista Serena",
      ubicacion: "La Ceja, Antioquia",
      areaM2: 320,
      precio: 185000000,
      servicios: "Agua, Luz, Alcantarillado, Vía pavimentada",
      topografia: "Plana",
      documentacion: "Escritura pública al día",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Parcela plana con excelente orientación, zona residencial consolidada y cerca a vías principales.",
      urls: [lands[0], lands[1]],
    },
    {
      titulo: "Parcela campestre El Mirador",
      ubicacion: "Rionegro, Antioquia",
      areaM2: 1200,
      precio: 320000000,
      servicios: "Agua, Luz, Vía destapada",
      topografia: "Pendiente suave",
      documentacion: "Promesa de compraventa disponible",
      estado: "DISPONIBLE",
      destacado: true,
      descripcion:
        "Terreno amplio ideal para casa campestre, con vista abierta y buena topografía.",
      urls: [lands[2], lands[3]],
    },
    {
      titulo: "Lote comercial vía principal",
      ubicacion: "Marinilla, Antioquia",
      areaM2: 450,
      precio: 275000000,
      servicios: "Agua, Luz, Alcantarillado, Gas, Vía pavimentada",
      topografia: "Plana",
      documentacion: "Certificado de libertad vigente",
      estado: "RESERVADO",
      destacado: false,
      descripcion:
        "Ubicación estratégica sobre vía principal, apto para local o proyecto mixto.",
      urls: [lands[3], lands[0]],
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
