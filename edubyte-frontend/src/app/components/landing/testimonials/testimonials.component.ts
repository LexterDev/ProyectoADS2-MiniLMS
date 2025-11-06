import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html'

})
export class TestimonialsComponent {

  // Array de testimonios (con los datos del diseño original)
  testimonials = [
    {
      author: 'Ana García',
      quote: '"EduByte me ha ayudado a cambiar mi carrera. Los cursos son excelentes y los instructores muy profesionales."',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCogbwxt6jVzeOrWq4KXCxY4ghk8FLPNhk0UaFZIjKWAzOM9nO-GknPnNXKnrliEA1gskqKHcV1P8cDJI1mnOxBURNUtWAXhxEokkG9alnLBYQ7wXDAR31xQpMloy5hV_ZnYMMrYoRqPAh1pnKAvMl2f-3CWMCRp0LxoyeMBy97B67WtzP2HGfKFVTZ2nzj00eLupmUD1zoOI51lISmg0DQejXOHAJjTxa6X80ywwPCrY8c2q2iS_Cy29BqigYe6QnXkllPKIk5ZrM'
    },
    {
      author: 'Carlos López',
      quote: '"La flexibilidad de EduByte es perfecta para mi estilo de vida. Puedo aprender a mi propio ritmo y desde cualquier lugar."',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChcVBsVzPYe9BRjbX38QsSbHmh9U3yHSxtJYtSvzjw6z9kO4No1jVxL4J9byEd7PMvF2IZjlK9VtAtVyg1oJfgI8Bj4kLybzjl34IJbVRjeuSB4aqOciLRZFhKqJbtQQ6J0WAnaDMCl4XIfqysWwAQJBFKbtnLzFP7vjjd9ygyDBZU7i-0l8zQJY_Znzz0FVV73E_wCDdngFNso5ccoRPruGC_gw6UHBPHg7GkVcNaB4Squ7E77pOh7T50EqmuSPGdSVZPoKXaGB0'
    },
    {
      author: 'Sofía Martínez',
      quote: '"Recomiendo EduByte a todos los que quieran adquirir nuevas habilidades. La calidad de los cursos es excepcional."',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVQi1nhHedf93xajeezRXRABtmbVxB4SjmiaRIR392erhXs8PJ8wl7M7MOkM42I8llEv2_RMpanx0WDQreQ_I2-5j19B_eyxqoRhnsqQ8MxRJyDCWvDV0aW05zFK_1gNaRRZb8j1be8263zb3btsh-NnUlpKWChXpmr2EFNMBqqEcx45OvkiGrmiC83xAcQNKsZVdr_s5m16yghr-B6LWUI08kBKlg3sLQNRO4uOwdsK4O_MbN6kGAuoMSSDM5Ob-rIwuHp7it21A'
    }
  ];

}
