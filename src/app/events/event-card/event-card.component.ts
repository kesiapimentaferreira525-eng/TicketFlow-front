import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Event, formatEventDate, formatEventPrice } from '../../models/event.model';

/**
 * Card de evento exibido na grade da página inicial (Critério de Aceitação 1).
 * Exibe imagem, título, data formatada e local; ao ser clicado navega para os detalhes.
 */
@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  @Input({ required: true }) event!: Event;
  @Output() selected = new EventEmitter<Event>();

  get formattedDate(): string {
    return formatEventDate(this.event.date);
  }

  get formattedPrice(): string {
    return formatEventPrice(this.event.price);
  }

  onSelect(): void {
    this.selected.emit(this.event);
  }
}
