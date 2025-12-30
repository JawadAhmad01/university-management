import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logoutservice } from '../../services/logoutservice';

@Component({
  selector: 'app-techers-nav',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './techers-nav.html',
  styleUrl: './techers-nav.scss',
})
export class TechersNav {
  isAsideOpen = false;

  toggleAside() {
    this.isAsideOpen = !this.isAsideOpen;
  }

  protected logOutService = inject(Logoutservice);
}
