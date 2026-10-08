import { Routes } from '@angular/router';

import { EventListComponent } from './events/event-list/event-list.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { PurchaseResultComponent } from './purchases/purchase-result.component';

/**
 * Roteamento principal da aplicação.
 * A rota de detalhes usa parâmetro (`:id`) conforme o Critério de Aceitação 3.
 */
export const APP_ROUTES: Routes = [
  {
    path: '',
    component: EventListComponent,
    title: 'Eventos disponíveis',
  },
  {
    path: 'events/:id',
    component: EventDetailComponent,
    title: 'Detalhes do evento',
  },
  {
    path: 'purchase/result/:id',
    component: PurchaseResultComponent,
    title: 'Status da compra',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

export default APP_ROUTES;
