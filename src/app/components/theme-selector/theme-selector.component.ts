import { Component, OnInit, HostListener } from '@angular/core';
import { ThemeService, ColorPalette } from '../../services/theme.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.css']
})
export class ThemeSelectorComponent implements OnInit {
  themes: ColorPalette[] = [];
  currentTheme: ColorPalette;
  showThemeMenu = false;

  constructor(private themeService: ThemeService) {
    console.log('ThemeSelectorComponent constructor called');
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnInit() {
    console.log('ThemeSelectorComponent ngOnInit called');
    this.themes = this.themeService.getThemes();
    console.log('Themes loaded:', this.themes);
    this.themeService.currentTheme$.subscribe(themeId => {
      console.log('Theme changed to:', themeId);
      this.currentTheme = this.themeService.getCurrentTheme();
    });
  }

  selectTheme(theme: ColorPalette) {
    console.log('Selecting theme:', theme);
    this.themeService.setTheme(theme.id);
    this.showThemeMenu = false;
  }

  toggleThemeMenu() {
    console.log('Toggle theme menu, current state:', this.showThemeMenu);
    this.showThemeMenu = !this.showThemeMenu;
    console.log('New state:', this.showThemeMenu);
  }

  closeThemeMenu() {
    this.showThemeMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-selector')) {
      this.showThemeMenu = false;
    }
  }
} 