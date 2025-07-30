import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonTitle,
  IonToolbar,
  IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personAddOutline,
  logInOutline,
  fitnessOutline,
  arrowForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.css'],
  standalone: true,
  imports: [IonFooter,
    CommonModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonText,
    IonTitle,
    IonToolbar,
    IonFooter
  ]
})
export class WelcomePage {

  constructor(private router: Router) {
    addIcons({fitnessOutline,personAddOutline,arrowForwardOutline,logInOutline});
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
