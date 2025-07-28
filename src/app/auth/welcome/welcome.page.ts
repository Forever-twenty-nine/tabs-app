import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personAddOutline, 
  logInOutline, 
  fitnessOutline,
  trophyOutline,
  peopleOutline,
  statsChartOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonText
  ]
})
export class WelcomePage {

  features = [
    {
      icon: 'fitness-outline',
      title: 'Entrenamientos Personalizados',
      description: 'Rutinas adaptadas a tus objetivos y nivel'
    },
    {
      icon: 'stats-chart-outline',
      title: 'Seguimiento de Progreso',
      description: 'Monitorea tu evolución día a día'
    },
    {
      icon: 'people-outline',
      title: 'Entrenadores Profesionales',
      description: 'Acompañamiento experto en tu camino'
    },
    {
      icon: 'trophy-outline',
      title: 'Logra tus Metas',
      description: 'Alcanza tus objetivos de fitness'
    }
  ];

  constructor(private router: Router) {
    addIcons({ 
      personAddOutline, 
      logInOutline,
      fitnessOutline,
      trophyOutline,
      peopleOutline,
      statsChartOutline,
      arrowForwardOutline
    });
  }

  /**
   * Navega a la página de registro
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Navega a la página de login
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
