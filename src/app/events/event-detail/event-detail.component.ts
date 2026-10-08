import { CommonModule, Location } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiError, EventService } from '../../services/event.service';
import { Event, formatEventDate, formatEventPrice } from '../../models/event.model';

/**
 * Tela de detalhes do evento (rota parametrizada /events/:id).
 * Consome GET /api/events/{id} conforme o Critério de Aceitação 3.
 */
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly eventService = inject(EventService);

  event: Event | null = null;
  loading = true;
  error: string | null = null;
  notFound = false;
  purchaseOpen = false;
  quantity = 1;
  paymentMethod = 'pix';
  purchaseFeedback = '';
  checkoutUrl = '';
  purchaseLoading = false;
  purchaseCompleted = false;

  ngOnInit(): void {
    // Reage a mudanças de parâmetro (ex: navegar de /events/1 para /events/2 sem recarregar).
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadEvent(id);
      }
    });
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.error = null;
    this.notFound = false;
    this.event = null;
    this.purchaseOpen = false;
    this.quantity = 1;
    this.purchaseCompleted = false;
    this.purchaseFeedback = '';
    this.checkoutUrl = '';

    this.eventService
      .getEventById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event) => {
          this.event = event;
          this.loading = false;
        },
        error: (error: ApiError) => {
          this.error = error.message;
          this.notFound = error.status === 404;
          this.loading = false;
        },
      });
  }

  get formattedDate(): string {
    return formatEventDate(this.event?.date);
  }

  get formattedPrice(): string {
    return formatEventPrice(this.event?.price);
  }

  get purchaseTotal(): string {
    return formatEventPrice((this.event?.price ?? 0) * this.quantity);
  }

  get maxQuantity(): number {
    return this.event?.availableTickets ?? 10;
  }

  get canPurchase(): boolean {
    const id = Number(this.event?.id);
    return Number.isSafeInteger(id) && id > 0;
  }

  openPurchase(): void {
    this.purchaseOpen = !this.purchaseOpen;
    this.purchaseFeedback = '';
  }

  submitPurchase(form: NgForm): void {
    if (form.invalid || this.purchaseLoading || this.purchaseCompleted) {
      form.form.markAllAsTouched();
      return;
    }

    const eventId = Number(this.event?.id);
    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
      this.purchaseFeedback = 'Este evento de demonstração não está cadastrado para compra.';
      return;
    }

    const values = form.value;
    this.purchaseLoading = true;
    this.purchaseFeedback = '';
    this.checkoutUrl = '';

    this.eventService
      .createPurchase({
        eventId,
        customerName: String(values['customerName'] ?? ''),
        email: String(values['email'] ?? ''),
        cpf: String(values['cpf'] ?? ''),
        phone: String(values['phone'] ?? ''),
        quantity: Number(values['quantity']),
        paymentMethod: this.paymentMethod,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (purchase) => {
          this.purchaseLoading = false;
          this.purchaseCompleted = true;
          this.checkoutUrl = purchase.checkoutUrl ?? '';
          this.purchaseFeedback = purchase.checkoutUrl
            ? `Pedido #${purchase.id} criado. Conclua o pagamento no checkout seguro do Mercado Pago.`
            : `Ingresso gratuito confirmado. Número do pedido: #${purchase.id}.`;
        },
        error: (error: ApiError) => {
          this.purchaseLoading = false;
          this.purchaseFeedback = error.message;
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  goToCatalog(): void {
    void this.router.navigate(['/']);
  }
}
