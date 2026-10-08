/**
 * Modelos de dados do domínio de Eventos (HU-02-FE).
 */

/** Evento exibido no catálogo e na tela de detalhes. */
export interface Event {
  id: string;
  title: string;
  description: string;
  /** Data/hora de início em formato ISO 8601. */
  date: string;
  /** Local do evento já formatado para exibição (ex: "Arena Central - São Paulo, SP"). */
  location: string;
  imageUrl: string;
  /** Preço do ingresso, quando houver. */
  price?: number;
  precoIngresso?: number;
  category?: string;
  capacity?: number;
  availableTickets?: number;
}

/** Formato aceito pela API (tolerante a nomes de campos alternativos). */
export interface ApiEvent {
  id?: string | number;
  _id?: string | number;
  title?: string;
  name?: string;
  description?: string;
  summary?: string;
  date?: string;
  startDate?: string;
  dateTime?: string;
  location?: string;
  place?: string;
  venue?: string;
  imageUrl?: string;
  image?: string;
  coverImage?: string;
  titulo?: string;
  descricao?: string;
  dataHora?: string;
  local?: string;
  imagemUrl?: string;
  categoria?: string;
  price?: number;
  ticketPrice?: number;
  precoIngresso?: number;
  category?: string;
  capacity?: number;
  availableTickets?: number;
}

/**
 * Normaliza um registro vindo da API para o modelo `Event`.
 * Aceita variações comuns de nomenclatura para facilitar a integração com o backend.
 */
export function mapApiEvent(raw: ApiEvent): Event {
  return {
    id: String(raw.id ?? raw._id ?? ''),
    title: raw.title ?? raw.name ?? raw.titulo ?? 'Evento sem título',
    description: raw.description ?? raw.summary ?? raw.descricao ?? '',
    date: raw.date ?? raw.startDate ?? raw.dateTime ?? raw.dataHora ?? '',
    location: raw.location ?? raw.place ?? raw.venue ?? raw.local ?? 'Local a confirmar',
    imageUrl:
      raw.imageUrl ??
      raw.image ??
      raw.coverImage ??
      raw.imagemUrl ??
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    price: raw.price ?? raw.ticketPrice ?? raw.precoIngresso,
    category: raw.category ?? raw.categoria,
    capacity: raw.capacity,
    availableTickets: raw.availableTickets,
  };
}

/** Formata a data do evento em pt-BR (ex: "sáb., 14 de fev. de 2026 • 22:00"). */
export function formatEventDate(date?: string): string {
  if (!date) {
    return 'Data a confirmar';
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Data a confirmar';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

/** Formata o preço em BRL (ex: "R$ 120,00"). */
export function formatEventPrice(price?: number): string {
  if (price === undefined || price === null || Number.isNaN(price)) {
    return 'Gratuito';
  }

  return price === 0
    ? 'Gratuito'
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}
