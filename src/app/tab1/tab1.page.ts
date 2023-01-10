import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Note } from '../model/note';
import { EditPage } from '../pages/edit/edit.page';
import { NotesService } from '../services/notes.service';
import { LoginService } from '../services/login.service';
import { UiService } from '../services/ui.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('infinitescroll') infinitescroll : ElementRef;
  public notes:Note[] =[];
  public results = this.notes;
  public query;
  constructor(private noteS:NotesService,
    private uiS:UiService,
    private modalCtrl: ModalController,
    private loginS:LoginService,
    private router:Router) {
  }
  handleChange(event) {
    if (event == null) return;
    const query = event.target.value.toLowerCase();
    this.query = event;
    if (event.target.value.length <= 0) {
      this.notes = this.results
    }
    else {
      this.notes = this.results.filter(d => d.title.toLowerCase().indexOf(query) > -1);
    }
  }
  async ngOnInit(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
      return;
    }
    else {
      this.loginS.user = JSON.parse(localStorage.getItem('login'));
    }
    await this.uiS.showLoading();
    this.results = await this.noteS.getNotes(true);
    this.notes = this.results;
    this.uiS.hideLoading();
  }
  async ionViewDidEnter(){  //ejecutado una vez la página está cargada
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
      return;
    }
    let n:Note[] = await this.noteS.getNotes(true);
    if (n.length != this.notes.length) {
      this.results = await this.noteS.getNotes(true);
      this.notes = this.results;
    }
  }
  public async editNote(note:Note){
    if (localStorage.getItem('imagen') == null) {
      localStorage.setItem('imagen',JSON.stringify(note.imagen));
    }
    const modal = await this.modalCtrl.create({
      component: EditPage,
      componentProps:{data:note}
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if(!role){
      //actualizar
      this.results=this.results.map((e)=>{
        if(e.id==data.id){
          return data;
        }else{
          return e;
        }
      })
      this.notes = this.results;
      this.handleChange(this.query);
    }
    localStorage.removeItem('imagen');
    console.log(data);
    

  }

  public tab2(){
    this.router.navigate(['tabs/tabs/tab2']);
  }

  public tab3(){
    this.router.navigate(['tabs/tabs/tab3']);
  }

  public tab4(){
    this.router.navigate(['tabs/tabs/tab4']);
  }

  public async logout(){
    await this.loginS.logout();
    this.router.navigate(['']);
  }

  public async loadNotes(event){
    this.results = await this.noteS.getNotes(true);
    this.notes = this.results;
    event.target.complete();
  }
  public async loadMoreNotes(event){
    let newNotes:Note[] = await this.noteS.getNotes();
    this.results=this.results.concat(newNotes);
    this.notes = this.results;
    (event as InfiniteScrollCustomEvent).target.complete();
  }
  public deleteNote(note){
    let c = confirm("Seguro que desea eliminar la nota?");
    if (!c) return;
    note.hided = true;
    
    const timeout = setTimeout(()=>{
      this.noteS.removeNote(note.id);
      this.results = this.results.filter(n=> n.id!=note.id);
    },3000);
    this.uiS.showToastOptions("Deshacer borrado",()=>{
      clearTimeout(timeout); //cancelada la cuenta atrás para el borrado en ddbb
      note.hided=undefined;
    });

  }


}
