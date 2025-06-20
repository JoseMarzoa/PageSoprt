import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  surface: string;
  border: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<string>('default');
  currentTheme$ = this.currentThemeSubject.asObservable();

  private themes: { [key: string]: ColorPalette } = {
    default: {
      id: 'default',
      name: 'SportFlex Classic',
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#F8FAFC',
      text: '#1F2937',
      surface: '#FFFFFF',
      border: '#E5E7EB'
    },
    ocean: {
      id: 'ocean',
      name: 'Ocean Blue',
      primary: '#0EA5E9',
      secondary: '#0369A1',
      accent: '#06B6D4',
      background: '#F0F9FF',
      text: '#0F172A',
      surface: '#FFFFFF',
      border: '#BAE6FD'
    },
    forest: {
      id: 'forest',
      name: 'Forest Green',
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      background: '#F0FDF4',
      text: '#064E3B',
      surface: '#FFFFFF',
      border: '#A7F3D0'
    },
    sunset: {
      id: 'sunset',
      name: 'Sunset Orange',
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFF7ED',
      text: '#7C2D12',
      surface: '#FFFFFF',
      border: '#FED7AA'
    },
    purple: {
      id: 'purple',
      name: 'Royal Purple',
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#FAF5FF',
      text: '#581C87',
      surface: '#FFFFFF',
      border: '#DDD6FE'
    },
    midnight: {
      id: 'midnight',
      name: 'Midnight Dark',
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#818CF8',
      background: '#0F172A',
      text: '#F1F5F9',
      surface: '#1E293B',
      border: '#334155'
    }
  };

  constructor() {
    // Cargar tema guardado en localStorage
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    this.setTheme(savedTheme);
  }

  getCurrentTheme(): ColorPalette {
    return this.themes[this.currentThemeSubject.value];
  }

  getThemes(): ColorPalette[] {
    return Object.values(this.themes);
  }

  setTheme(themeId: string) {
    if (this.themes[themeId]) {
      this.currentThemeSubject.next(themeId);
      localStorage.setItem('selectedTheme', themeId);
      this.applyTheme(this.themes[themeId]);
    }
  }

  private applyTheme(theme: ColorPalette) {
    const root = document.documentElement;
    
    // Aplicar variables CSS personalizadas
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-border', theme.border);
    
    // Aplicar variables para Tailwind CSS
    root.style.setProperty('--tw-primary-50', this.adjustColor(theme.primary, 0.95));
    root.style.setProperty('--tw-primary-100', this.adjustColor(theme.primary, 0.9));
    root.style.setProperty('--tw-primary-200', this.adjustColor(theme.primary, 0.8));
    root.style.setProperty('--tw-primary-300', this.adjustColor(theme.primary, 0.7));
    root.style.setProperty('--tw-primary-400', this.adjustColor(theme.primary, 0.6));
    root.style.setProperty('--tw-primary-500', theme.primary);
    root.style.setProperty('--tw-primary-600', this.adjustColor(theme.primary, -0.1));
    root.style.setProperty('--tw-primary-700', this.adjustColor(theme.primary, -0.2));
    root.style.setProperty('--tw-primary-800', this.adjustColor(theme.primary, -0.3));
    root.style.setProperty('--tw-primary-900', this.adjustColor(theme.primary, -0.4));
    
    // Variables para colores de fondo y texto
    root.style.setProperty('--tw-bg-background', theme.background);
    root.style.setProperty('--tw-bg-surface', theme.surface);
    root.style.setProperty('--tw-text-text', theme.text);
    root.style.setProperty('--tw-border-border', theme.border);
    
    // Aplicar el tema al body también
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }

  private adjustColor(color: string, factor: number): string {
    // Convertir hex a RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Ajustar brillo
    const adjustR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)));
    const adjustG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)));
    const adjustB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)));
    
    // Convertir de vuelta a hex
    return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
  }
} 