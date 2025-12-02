import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { AuthService } from './features/auth/login/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CodePulse');

  authService = inject(AuthService);

  loadUserRef = this.authService.loadUser();
  user = this.loadUserRef.value;

  effectRef = effect(()=>{
    const userValue = this.user();
    if(userValue){
      this.authService.user.set(userValue);
    }
  })
}
