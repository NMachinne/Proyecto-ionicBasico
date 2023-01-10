import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonLabel } from '@ionic/angular';
import { LoginService } from '../services/login.service';
import { NotesService } from '../services/notes.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public imagen="";
  private todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private uiS:UiService,
    private loginS:LoginService,
    private router:Router
  ) {
    this.todo = this.formBuilder.group({
      title :['',[Validators.required,
                  Validators.minLength(5)]],
      description : ['']
    })
  }

  ngOnInit(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
    }
    else {
      this.loginS.user = JSON.parse(localStorage.getItem('login'));
    }
  }
  async ionViewDidEnter(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
      return;
    }
    try {
      let imagen = JSON.parse(localStorage.getItem('imagen'));
      if (imagen != null) {
        this.imagen = "Imagen: Con Imagen";
        return;
      }
    }
    catch(err) {

    }
    this.imagen = "Haz click para seleccionar o hacer una imagen";
  }
  public async logForm(){
    if(!this.todo.valid) return;
    await this.uiS.showLoading();
    let imagen = "";
    if (localStorage.getItem('imagen') != null) {
      imagen = JSON.parse(localStorage.getItem('imagen'));
      localStorage.removeItem('imagen');
      this.imagen = "Haz click para seleccionar o hacer una imagen";
    }
    try{
      await this.noteS.addNote({
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        email:this.loginS.user.email,
        imagen:imagen
      });
      this.todo.reset("");
      this.uiS.showToast("¡Nota insertada correctamente!");
    }catch(err){
      console.error(err);
      this.uiS.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.uiS.hideLoading();
    }
    
    
  }

  public tab1(){
    this.router.navigate(['tabs/tabs/tab1']);
  }

  public tab3(){
    this.router.navigate(['tabs/tabs/tab3']);
  }

}
