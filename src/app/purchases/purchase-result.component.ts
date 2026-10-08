import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ApiError, EventService, PurchaseStatusResponse } from '../services/event.service';
import { formatEventPrice } from '../models/event.model';

@Component({
  selector: 'app-purchase-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-result.component.html',
  styleUrl: './purchase-result.component.css',
})
export class PurchaseResultComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);

  purchase: PurchaseStatusResponse | null = null;
  loading = true;
  error: string | null = null;
  private purchaseId = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.purchaseId = params.get('id') ?? '';
      this.loadPurchase();
    });
  }

  loadPurchase(): void {
    if (!this.purchaseId) {
      this.error = 'Número do pedido não informado.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.eventService
      .getPurchaseStatus(this.purchaseId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (purchase) => {
          this.purchase = purchase;
          this.loading = false;
        },
        error: (error: ApiError) => {
          this.error = error.message;
          this.loading = false;
        },
      });
  }

  get total(): string {
    return formatEventPrice(this.purchase?.totalPrice);
  }

  get statusTitle(): string {
    switch (this.purchase?.status) {
      case 'approved':
        return 'Compra confirmada!';
      case 'failed':
        return 'Pagamento não aprovado';
      case 'refunded':
        return 'Pagamento estornado';
      default:
        return 'Aguardando confirmação do pagamento';
    }
  }

  get statusMessage(): string {
    switch (this.purchase?.status) {
      case 'approved':
        return 'Seu pagamento foi confirmado. Seu ingresso está garantido.';
      case 'failed':
        return 'O pagamento não foi aprovado. Você pode voltar ao evento e tentar novamente.';
      case 'refunded':
        return 'O pagamento foi estornado pelo provedor.';
      default:
        return 'Assim que o Mercado Pago confirmar o pagamento, o status será atualizado aqui.';
    }
  }

  get paymentMethodLabel(): string {
    switch (this.purchase?.paymentMethod) {
      case 'pix':
        return 'Pix';
      case 'credit-card':
        return 'Cartão de crédito';
      case 'boleto':
        return 'Boleto';
      default:
        return 'Definido no checkout';
    }
  }
}
