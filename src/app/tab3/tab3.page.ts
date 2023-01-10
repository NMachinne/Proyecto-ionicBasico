import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { UiService } from '../services/ui.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('foto') foto:IonImg;
  constructor(private loginS:LoginService,
    private uiS:UiService,
    private router:Router) {}

  ngOnInit(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
    }
  }

  ionViewDidEnter(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
    }
    else {
      this.loginS.user = JSON.parse(localStorage.getItem('login'));
      this.foto.src="";
      this.foto.src = JSON.parse(localStorage.getItem('imagen'));
    }
  }

  public async hazfoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let imageUrl = "data:image/"+image.format+";base64,"+image.base64String;
  
    // Can be set to the src of an image now

    this.foto.src = imageUrl;
    localStorage.setItem('imagen',JSON.stringify(imageUrl));
  }

  public tab1(){
    this.router.navigate(['tabs/tabs/tab1']);
  }

  public tab2(){
    if (localStorage.getItem('imagen') != null) {
      this.uiS.showToast("Imagen Guardada");
      this.router.navigate(['tabs/tabs/tab2']);
    }
    else {
      this.uiS.showToast("No existe la imagen","danger");
    }
  }

  public borrar(){
    if (localStorage.getItem('imagen') != null) {
      localStorage.removeItem('imagen');
      this.uiS.showToast("Imagen Borrada");
      this.router.navigate(['tabs/tabs/tab2']);
    }
    else {
      this.uiS.showToast("No existe la imagen","danger");
    }
  }

}
