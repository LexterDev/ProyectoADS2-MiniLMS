import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


interface Category {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  icon: string;
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
      name: 'Business Management',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      iconColor: 'text-blue-600',
      icon: 'users'
    },
    {
      id: '2',
      name: 'Arts & Design',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-400',
      iconColor: 'text-pink-600',
      icon: 'palette'
    },
    {
      id: '3',
      name: 'Personal Development',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      iconColor: 'text-green-600',
      icon: 'code'
    },
    {
      id: '4',
      name: 'UI/UX Design',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-400',
      iconColor: 'text-amber-600',
      icon: 'desktop'
    },
    {
      id: '5',
      name: 'Graphic Design',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      iconColor: 'text-purple-600',
      icon: 'pencil'
    },
    {
      id: '6',
      name: 'Digital Marketing',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-400',
      iconColor: 'text-rose-600',
      icon: 'megaphone'
    },
    {
      id: '7',
      name: 'Exclusive man',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-400',
      iconColor: 'text-indigo-600',
      icon: 'badge'
    },
    {
      id: '8',
      name: 'Product Design',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      iconColor: 'text-orange-600',
      icon: 'presentation'
    },
    {
      id: '9',
      name: 'Video & Photography',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-400',
      iconColor: 'text-cyan-600',
      icon: 'video'
    }
  ];

  onCategoryClick(category: Category): void {
    console.log('Selected category:', category.name);
    // Implementar navegación o filtrado
  }

}

