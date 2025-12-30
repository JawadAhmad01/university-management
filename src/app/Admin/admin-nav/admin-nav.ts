import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Logoutservice } from '../../services/logoutservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterOutlet, RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.scss',
})
export class AdminNav {
  protected logoutservice = inject(Logoutservice);
  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebarOnMobile() {
    if (window.innerWidth < 700) {
      this.isSidebarOpen = false;
    }
  }
}
