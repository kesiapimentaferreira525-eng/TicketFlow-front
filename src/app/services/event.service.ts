import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { API_BASE_URL } from '../core/api.constants';
import { ApiEvent, Event, mapApiEvent } from '../models/event.model';

/** Erro amigável apresentado ao usuário. */
export interface ApiError {
  status: number;
  message: string;
}

export interface PurchaseRequest {
  eventId: number;
  customerName: string;
  email: string;
  cpf: string;
  phone: string;
  quantity: number;
  paymentMethod: string;
}

export interface PurchaseResponse {
  id: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  checkoutUrl: string | null;
}

export interface PurchaseStatusResponse {
  id: number;
  eventTitle: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const DEMO_EVENTS: Event[] = [
  {
    id: 'demo-1',
    title: 'Festival Aurora',
    description: 'Uma noite de música ao vivo, artistas independentes e experiências imersivas.',
    date: '2026-11-14T18:00:00.000Z',
    location: 'Parque Ibirapuera - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    price: 90,
    category: 'Música',
  },
  {
    id: 'demo-2',
    title: 'Noite de Jazz',
    description: 'Clássicos e novas vozes do jazz em uma apresentação intimista.',
    date: '2026-11-21T20:00:00.000Z',
    location: 'Blue Note - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    price: 75,
    category: 'Música',
  },
  {
    id: 'demo-3',
    title: 'Festival Sabores do Brasil',
    description: 'Comida de rua, produtores locais e música para toda a família.',
    date: '2026-11-28T12:00:00.000Z',
    location: 'Parque Villa-Lobos - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    price: 35,
    category: 'Gastronomia',
  },
  {
    id: 'demo-4',
    title: 'Circuito de Arte Urbana',
    description: 'Uma visita guiada pelos murais e ateliês mais criativos da cidade.',
    date: '2026-12-05T10:00:00.000Z',
    location: 'Vila Madalena - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    price: 40,
    category: 'Arte',
  },
  {
    id: 'demo-5',
    title: 'Corrida das Luzes',
    description: 'Uma corrida noturna de 5 km com percurso iluminado e clima de festa.',
    date: '2026-12-12T19:00:00.000Z',
    location: 'Parque do Povo - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
    price: 55,
    category: 'Esporte',
  },
  {
    id: 'demo-6',
    title: 'Festival de Cinema ao Ar Livre',
    description: 'Sessões especiais sob as estrelas, com curtas e longas nacionais.',
    date: '2026-12-19T19:30:00.000Z',
    location: 'Centro Cultural São Paulo - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    price: 25,
    category: 'Cinema',
  },
  {
    id: 'demo-7',
    title: 'Réveillon na Paulista',
    description: 'Shows ao vivo e uma celebração especial para receber o novo ano.',
    date: '2026-12-31T20:00:00.000Z',
    location: 'Avenida Paulista - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&w=1200&q=80',
    price: 0,
    category: 'Celebração',
  },
  {
    id: 'demo-8',
    title: 'Oficina de Cerâmica',
    description: 'Aprenda técnicas básicas de modelagem e crie sua própria peça.',
    date: '2027-01-09T14:00:00.000Z',
    location: 'Ateliê Vila Mariana - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    price: 110,
    category: 'Arte',
  },
  {
    id: 'demo-9',
    title: 'Brunch no Jardim',
    description: 'Um brunch descontraído com ingredientes frescos e música acústica.',
    date: '2027-01-16T10:00:00.000Z',
    location: 'Jardim Botânico - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    price: 85,
    category: 'Gastronomia',
  },
  {
    id: 'demo-10',
    title: 'Festival de Dança',
    description: 'Companhias e bailarinos apresentam estilos que vão do contemporâneo ao street.',
    date: '2027-01-23T16:00:00.000Z',
    location: 'Auditório Ibirapuera - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
    price: 60,
    category: 'Dança',
  },
  {
    id: 'demo-11',
    title: 'Encontro de Fotografia',
    description: 'Palestras, exposições e troca de experiências para quem ama fotografia.',
    date: '2027-01-30T09:00:00.000Z',
    location: 'MIS - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
    price: 45,
    category: 'Cultura',
  },
  {
    id: 'demo-12',
    title: 'Som na Praça',
    description: 'Uma tarde gratuita com bandas locais, feira criativa e espaço para crianças.',
    date: '2027-02-06T15:00:00.000Z',
    location: 'Praça da República - São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    price: 0,
    category: 'Música',
  },
];

/**
 * Serviço injetável que centraliza o consumo da API REST de eventos.
 * Rotas: GET /api/events e GET /api/events/{id}
 */
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly http = inject(HttpClient);
  private readonly eventsUrl = `${API_BASE_URL}/api/events`;

  /** Lista todos os eventos disponíveis no catálogo. */
  getEvents(): Observable<Event[]> {
    return this.http.get<unknown>(this.eventsUrl).pipe(
      map((response) => {
        const events = this.toEventArray(response);
        const eventIds = new Set(events.map((event) => event.id));
        return [...events, ...DEMO_EVENTS.filter((event) => !eventIds.has(event.id))];
      }),
      catchError(() => of(DEMO_EVENTS)),
    );
  }

  /** Busca os detalhes de um evento específico. */
  getEventById(id: string): Observable<Event> {
    const demoEvent = DEMO_EVENTS.find((event) => event.id === id);
    if (demoEvent) {
      return of(demoEvent);
    }

    return this.http.get<unknown>(`${this.eventsUrl}/${encodeURIComponent(id)}`).pipe(
      map((response) => this.toEvent(response)),
      catchError((error: HttpErrorResponse) => this.toErrorObservable(error, this.toApiError.bind(this))),
    );
  }

  /** Registra um pedido pendente; o endpoint não efetua a cobrança. */
  createPurchase(request: PurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(`${API_BASE_URL}/api/purchases`, request).pipe(
      catchError((error: HttpErrorResponse) => this.toErrorObservable(error, this.toPurchaseApiError.bind(this))),
    );
  }

  getPurchaseStatus(id: string): Observable<PurchaseStatusResponse> {
    return this.http.get<PurchaseStatusResponse>(
      `${API_BASE_URL}/api/purchases/${encodeURIComponent(id)}`,
    ).pipe(
      catchError((error: HttpErrorResponse) => this.toErrorObservable(error, this.toPurchaseApiError.bind(this))),
    );
  }

  /** Aceita tanto um array puro quanto envelopes comuns (`data`, `results`, `content`, `items`). */
  private toEventArray(response: unknown): Event[] {
    const envelope = response as Record<string, unknown> | null;

    const list = Array.isArray(response)
      ? response
      : (envelope?.['data'] ?? envelope?.['results'] ?? envelope?.['content'] ?? envelope?.['items'] ?? []);

    if (!Array.isArray(list)) {
      return [];
    }

    return list.map((item) => mapApiEvent(item as ApiEvent));
  }

  /** Aceita tanto o objeto do evento quanto { data: {...} }. */
  private toEvent(response: unknown): Event {
    const payload =
      response && typeof response === 'object' && 'data' in (response as Record<string, unknown>)
        ? (response as Record<string, unknown>)['data']
        : response;

    return mapApiEvent((payload ?? {}) as ApiEvent);
  }

  private toErrorObservable(
    error: HttpErrorResponse,
    converter: (httpError: HttpErrorResponse) => ApiError,
  ): Observable<never> {
    return new Observable<never>((observer) => {
      observer.error(converter(error));
    });
  }

  /** Converte o erro HTTP em uma mensagem legível para o usuário. */
  private toApiError(error: HttpErrorResponse): ApiError {
    const status = error.status ?? 0;

    if (status === 0) {
      return {
        status,
        message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
      };
    }

    if (status === 404) {
      return { status, message: 'Este evento não foi encontrado. Ele pode ter sido removido.' };
    }

    if (status >= 500) {
      return { status, message: 'O servidor está indisponível no momento. Tente novamente em instantes.' };
    }

    return { status, message: 'Algo deu errado ao carregar os eventos. Tente novamente.' };
  }

  private toPurchaseApiError(error: HttpErrorResponse): ApiError {
    const status = error.status ?? 0;
    const body: unknown = error.error;

    if (status === 400 && body && typeof body === 'object') {
      const message = Object.values(body).find((value): value is string => typeof value === 'string');
      return { status, message: message ?? 'Revise os dados informados e tente novamente.' };
    }

    if (status === 404) {
      return { status, message: 'O evento não foi encontrado. Atualize a página e tente novamente.' };
    }

    if (status === 0) {
      return {
        status,
        message: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
      };
    }

    return { status, message: 'Não foi possível registrar o pedido. Tente novamente em instantes.' };
  }
}
