import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  statsChartOutline, 
  fitnessOutline, 
  personOutline, 
  checkmarkCircleOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonAvatar
  ]
})
export class DashboardPage implements OnInit {

  clienteInfo = {
    nombre: 'Ana García',
    entrenador: 'Carlos Martínez',
    objetivoActual: 'Pérdida de peso',
    progreso: 75
  };

  rutinasRecientes = [
    { nombre: 'Rutina Cardio', fechaAsignada: '2025-07-26', completada: true },
    { nombre: 'Fuerza Tren Superior', fechaAsignada: '2025-07-25', completada: true },
    { nombre: 'Funcional', fechaAsignada: '2025-07-28', completada: false }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    addIcons({
      statsChartOutline,
      fitnessOutline,
      personOutline,
      checkmarkCircleOutline
    });
  }

  ngOnInit() {
    if (!this.authService.isCliente()) {
      this.router.navigate(['/login']);
    }
  }

  verRutina(rutina: any) {
    // Navegar al detalle de la rutina
    console.log('Ver rutina:', rutina);
  }

  contactarEntrenador() {
    // Contactar con el entrenador
    console.log('Contactar entrenador');
  }

}
