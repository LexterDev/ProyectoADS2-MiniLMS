import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryService, Category } from '../../../services/category.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private snackbarService = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  loading = false;
  showForm = false;
  editingCategory: Category | null = null;
  searchQuery = '';

  categoryForm!: FormGroup;

  // Predefined color options
  colorOptions = [
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' }
  ];

  // Predefined icon options (Material Symbols)
  iconOptions = [
    'code', 'palette', 'megaphone', 'desktop_windows', 'business_center',
    'camera_alt', 'music_note', 'sports_soccer', 'menu_book', 'psychology',
    'science', 'language', 'calculate', 'fitness_center', 'restaurant'
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  initializeForm(): void {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      icono: ['code'],
      color: ['purple']
    });
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackbarService.showError('Error al cargar las categorías');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredCategories = this.categories.filter(cat =>
        cat.nombre.toLowerCase().includes(query) ||
        cat.descripcion.toLowerCase().includes(query)
      );
    } else {
      this.filteredCategories = [...this.categories];
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  openCreateForm(): void {
    this.editingCategory = null;
    this.categoryForm.reset({
      icono: 'code',
      color: 'purple'
    });
    this.showForm = true;
  }

  openEditForm(category: Category): void {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      nombre: category.nombre,
      descripcion: category.descripcion,
      icono: category.icono || 'code',
      color: category.color || 'purple'
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  saveCategory(): void {
    if (!this.categoryForm.valid) {
      this.snackbarService.showError('Por favor completa todos los campos requeridos');
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const categoryData: Category = this.categoryForm.value;

    const operation = this.editingCategory
      ? this.categoryService.updateCategory(this.editingCategory.id!, categoryData)
      : this.categoryService.createCategory(categoryData);

    operation.subscribe({
      next: () => {
        const action = this.editingCategory ? 'actualizada' : 'creada';
        this.snackbarService.showSuccess(`Categoría ${action} exitosamente`);
        this.closeForm();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error saving category:', error);
        this.snackbarService.showError('Error al guardar la categoría');
        this.loading = false;
      }
    });
  }

  toggleStatus(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: category.activa === 1 ? 'Desactivar Categoría' : 'Activar Categoría',
        message: `¿Deseas ${category.activa === 1 ? 'desactivar' : 'activar'} la categoría "${category.nombre}"?`,
        confirmText: category.activa === 1 ? 'Desactivar' : 'Activar',
        cancelText: 'Cancelar',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.categoryService.toggleStatus(category.id!).subscribe({
          next: () => {
            const action = category.activa === 1 ? 'desactivada' : 'activada';
            this.snackbarService.showSuccess(`Categoría ${action} exitosamente`);
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error toggling status:', error);
            this.snackbarService.showError('Error al cambiar el estado de la categoría');
            this.loading = false;
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Eliminar Categoría',
        message: `¿Estás seguro de eliminar la categoría "${category.nombre}"? ${category.cursosCount ? `Tiene ${category.cursosCount} cursos asociados.` : 'Esta acción no se puede deshacer.'}`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Categoría eliminada exitosamente');
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            const errorMessage = error.error?.message || 'Error al eliminar la categoría';
            this.snackbarService.showError(errorMessage);
            this.loading = false;
          }
        });
      }
    });
  }

  getCategoryColorClass(color: string): string {
    return `bg-${color}-50 dark:bg-${color}-900/20`;
  }

  getCategoryIconColorClass(color: string): string {
    return `text-${color}-600 dark:text-${color}-400`;
  }

  getCategoryBorderColorClass(color: string): string {
    return `border-${color}-400`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
