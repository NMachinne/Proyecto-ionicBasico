import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { NotesService } from 'src/app/services/notes.service';
import { LoginService } from '../../services/login.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  @Input('data') data:Note;
  public imagen="";
  private todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private loginS:LoginService,
    private uiS:UiService,
    private modalCTRL:ModalController
  ) {
   
  }
  ngOnInit() {
    if(!this.data){
      console.log("Crear nota");
    } else{
      this.todo = this.formBuilder.group({
        title :[this.data.title,[Validators.required,
                    Validators.minLength(5)]],
        description : [this.data.description]
      })
    }
  }

  async ionViewDidEnter(){
    try {
      let imagen = JSON.parse(localStorage.getItem('imagen'));
      if (imagen != this.data.imagen) {
        this.imagen = "Haz click para seleccionar o hacer una imagen";
        return;
      }
    }
    catch(err) {

    }
    this.imagen = "Haz click para seleccionar o hacer una imagen";
  }

  async logForm(){
    if(!this.todo.valid) return;
    await this.uiS.showLoading();
    let imagen = "";
    try {
    imagen = JSON.parse(localStorage.getItem('imagen'));
    }
    catch(err) {
      imagen = "";
    }
    try{
      if(!this.data){
        await this.noteS.addNote({
          title:this.todo.get('title').value,
          description:this.todo.get('description').value,
          email:this.loginS.user.email,
          imagen:imagen
        });
        this.todo.reset("");
        this.uiS.showToast("¡Nota insertada correctamente!");
      }else{
        await this.noteS.updateNote(
          {id:this.data.id,
           title:this.todo.get('title').value,
           description:this.todo.get('description').value,
           email:this.loginS.user.email,
           imagen:imagen
          }
        );
        this.uiS.showToast("¡Nota actualizada correctamente!");
      }
    }catch(err){
      console.error(err);
      this.uiS.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.uiS.hideLoading();
      this.modalCTRL.dismiss( {id:this.data.id,
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        imagen:imagen
       });
    }
  }
}
