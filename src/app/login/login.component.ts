import { Component } from '@angular/core';
import { AuthGoogleService } from '../auth-google.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authGoogleService: AuthGoogleService){}

  login(){ 
    this.authGoogleService.login();
  }

}
