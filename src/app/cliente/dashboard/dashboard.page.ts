import { Component } from '@angular/core';
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
  checkmarkCircleOutline,
  timeOutline
} from 'ionicons/icons';

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
export class DashboardPage {

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
  ) { 
    addIcons({
      statsChartOutline,
      fitnessOutline,
      personOutline,
      checkmarkCircleOutline,
      timeOutline
    });
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
