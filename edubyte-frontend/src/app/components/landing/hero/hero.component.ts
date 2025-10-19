import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  searchQuery = '';

  onSearch() {
    console.log('Searching for:', this.searchQuery);
  }

}
