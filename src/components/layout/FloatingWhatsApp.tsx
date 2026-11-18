import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, generalWhatsAppMessage } from "@/lib/formatters";

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl(generalWhatsAppMessage())}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-sm bg-whatsapp text-white transition-colors hover:bg-whatsapp-hover"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
    </a>
  );
}
