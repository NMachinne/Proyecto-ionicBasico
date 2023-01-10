import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfo:any;
  constructor(private loginS:LoginService,
    private router:Router) {
  }

  ngOnInit() {
    if(localStorage.getItem('login') != null) {
      this.loginS.user = JSON.parse(localStorage.getItem('login'));
      this.router.navigate(['tabs/tabs/tab1']);
    }
    if(this.loginS.isLogged()){
      this.router.navigate(['/tabs/tabs/tab1']);
    }
  }

  public async signin() {
    await this.loginS.login();
    this.router.navigate(['tabs/tabs/tab1']);
  }

}
