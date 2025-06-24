import { Component, OnInit } from '@angular/core';
import { MaterialSharedModule } from '../../shared/material-shared.module';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  standalone: true,
  imports: [MaterialSharedModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;

  constructor (private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.enableDarkMode();
      }
    }
  }

  toggleTheme(): void {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode(): void {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  private disableDarkMode(): void {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }

  goToSearchPage(): void {
    this.router.navigate(['/']);
  }
}
