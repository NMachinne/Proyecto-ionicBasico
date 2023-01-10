import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user:any;

  constructor(
    private platform:Platform) {
    GoogleAuth.initialize({
      clientId: '781225353371-tuj2ph780bktnlh7d5l1omc96ltet8om.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }

  public async login(){
    let user = await GoogleAuth.signIn();
    this.user=user;
    localStorage.setItem('login',JSON.stringify(user));
  }
  
  public async logout(){
    localStorage.removeItem('login');
    await GoogleAuth.signOut();
    this.user=null;
  }

  public isLogged():boolean{
    if(this.user) {
      return true;
    }
    else {
      return false;
    }
  }
}
