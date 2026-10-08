import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiError, EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { EventCardComponent } from '../event-card/event-card.component';

/**
 * Tela de listagem (Home) do catálogo de eventos.
 * Critérios: 1 (grade de cards), 2 (HttpClient + loading/erro) e 3 (navegação para detalhes).
 */
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  events: Event[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  /** Consome GET /api/events tratando os estados de carregamento e falha de conexão. */
  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventService
      .getEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
        },
        error: (error: ApiError) => {
          this.error = error.message;
          this.events = [];
          this.loading = false;
        },
      });
  }

  /** Filtro local por título, local ou categoria. */
  get filteredEvents(): Event[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.events;
    }

    return this.events.filter((event) =>
      [event.title, event.location, event.category ?? ''].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }

  /** Navega para a rota parametrizada /events/:id. */
  goToDetails(event: Event): void {
    void this.router.navigate(['/events', event.id]);
  }
}
