import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Shell da aplicação: apenas o outlet do roteador. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: #f7f8fc;
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        color: #0f172a;
      }

      .app-shell {
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent {}
