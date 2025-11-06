// src/app/pages/student/my-courses/my-courses.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// (La interfaz 'StudentCourse' no cambia)
interface StudentCourse {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  progress: number;
  lastLesson: string;
  isCompleted: boolean;
  isFavorite: boolean;
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-courses.component.html',
  // ¡styleUrl ELIMINADO!
})
export class MyCoursesComponent implements OnInit {

  // (Toda la lógica del componente: allCourses, filteredCourses, applyFilters(), etc., se mantiene igual)
  allCourses: StudentCourse[] = [
    { 
      id: '1', 
      title: 'Introduction to Data Science', 
      instructor: 'Dr. Amelia Ramirez', 
      imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxEYXRhJTIwU2NpZW5jZXxlbnwwfHx8fDE2NzgwMjY3Nzc&ixlib=rb-4.0.3&q=80&w=400', 
      progress: 75, 
      lastLesson: '5. Data Visualization',
      isCompleted: false,
      isFavorite: true
    },
    { 
      id: '2', 
      title: 'Advanced Machine Learning', 
      instructor: 'Prof. Ethan Carter', 
      imageUrl: 'https://images.unsplash.com/photo-1593025287313-2708c69d8063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDExfHxNYWNoaW5lJTIwTGVhcm5pbmd8ZW58MHx8fHwxNjc4MDI2ODE4&ixlib=rb-4.0.3&q=80&w=400', 
      progress: 0, 
      lastLesson: '',
      isCompleted: false,
      isFavorite: false
    },
    { 
      id: '3', 
      title: 'Web Development with React', 
      instructor: 'Ms. Olivia Bennett', 
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fFJlYWN0JTIwSnN8ZW58MHx8fHwxNjc4MDI2ODQ3&ixlib=rb-4.0.3&q=80&w=400', 
      progress: 0, 
      lastLesson: '',
      isCompleted: false,
      isFavorite: true
    },
    { 
      id: '4', 
      title: 'Java Spring Boot Masterclass', 
      instructor: 'Josue Colocho', 
      imageUrl: 'https://images.unsplash.com/photo-1629654037139-3c834041a6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fFNwringJTIwQm9vdHxlbnwwfHx8fDE2NzgwMjY4NzI&ixlib=rb-4.0.3&q=80&w=400', 
      progress: 100, 
      lastLesson: '10. Deployment',
      isCompleted: true,
      isFavorite: false
    }
  ];

  filteredCourses: StudentCourse[] = [];
  activeButtonFilter: string = 'Todos';
  activeTabFilter: string = 'Todos';
  searchTerm: string = '';
  sortOrder: string = 'recent';

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  setButtonFilter(filter: string): void {
    this.activeButtonFilter = filter;
    this.applyFilters();
  }

  setTabFilter(tab: string): void {
    this.activeTabFilter = tab;
    console.log('Filtro de pestaña:', tab);
    this.applyFilters();
  }

  setSort(sort: string): void {
    this.sortOrder = sort;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    let courses = [...this.allCourses];

    if (this.activeButtonFilter === 'En progreso') {
      courses = courses.filter(c => c.progress > 0 && c.progress < 100);
    } else if (this.activeButtonFilter === 'Completados') {
      courses = courses.filter(c => c.isCompleted);
    } else if (this.activeButtonFilter === 'Favoritos') {
      courses = courses.filter(c => c.isFavorite);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(term) || 
        c.instructor.toLowerCase().includes(term)
      );
    }

    if (this.sortOrder === 'name') {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOrder === 'progress') {
      courses.sort((a, b) => b.progress - a.progress);
    }

    this.filteredCourses = courses;
  }
}