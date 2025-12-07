import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Category {
  id: string;
  name: string;
  bgColor: string;
  bgIcon: string;
  borderColor: string;
  iconColor: string;
  icon: string;
  courseCount: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html'
  // ¡Sin styleUrl!
})
export class CategoriesComponent {
  
  // Array de categorías que mostraremos
  categories: Category[] = [
    {
      id: '1',
      name: 'Programación',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      bgIcon: 'bg-white dark:bg-purple-800/50',
      borderColor: 'border-purple-400',
      iconColor: 'text-purple-600 dark:text-purple-400',
      icon: 'code',
      courseCount: 120
    },
    {
      id: '2',
      name: 'Diseño Gráfico',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      bgIcon: 'bg-white dark:bg-pink-800/50',
      borderColor: 'border-pink-400',
      iconColor: 'text-pink-600 dark:text-pink-400',
      icon: 'palette',
      courseCount: 85
    },
    {
      id: '3',
      name: 'Marketing Digital',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      bgIcon: 'bg-white dark:bg-blue-800/50',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: 'megaphone',
      courseCount: 95
    },
    {
      id: '4',
      name: 'UI/UX Design',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      bgIcon: 'bg-white dark:bg-amber-800/50',
      borderColor: 'border-amber-400',
      iconColor: 'text-amber-600 dark:text-amber-400',
      icon: 'desktop',
      courseCount: 67
    },
    {
      id: '5',
      name: 'Negocios',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      bgIcon: 'bg-white dark:bg-green-800/50',
      borderColor: 'border-green-400',
      iconColor: 'text-green-600 dark:text-green-400',
      icon: 'briefcase',
      courseCount: 78
    },
    {
      id: '6',
      name: 'Fotografía',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      bgIcon: 'bg-white dark:bg-indigo-800/50',
      borderColor: 'border-indigo-400',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      icon: 'camera',
      courseCount: 54
    }
  ];

  onCategoryClick(category: Category): void {
    console.log('Selected category:', category.name);
    // Implementar navegación o filtrado
  }

  getIconSVG(iconName: string): string {
    const icons: { [key: string]: string } = {
      code: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>',
      palette: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>',
      megaphone: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>',
      desktop: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      briefcase: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
      camera: '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
    };
    return icons[iconName] || icons['code'];
  }

}

