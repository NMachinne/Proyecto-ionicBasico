import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UiService } from '../services/ui.service';
import { HttpClient } from '@angular/common/http';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page {
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  
  public tab4: mapboxgl.Map;
  public style = 'mapbox://styles/mapbox/streets-v11'; 
  public coordinates="";
  constructor(private loginS:LoginService,
    private uiS:UiService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,
    private router:Router,
    private http: HttpClient) {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
      this.autocomplete = { input: '' };
      this.autocompleteItems = [];
    }

  ngOnInit(){
    this.loadMap();
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
    }
  }

  ionViewDidEnter(){
    if(localStorage.getItem('login') == null) {
      this.router.navigate(['']);
    }
    else {
      this.coordinates="";
    }
  }

  loadMap() {
    
    //OBTENEMOS LAS COORDENADAS DESDE EL TELEFONO.
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      
      //CUANDO TENEMOS LAS COORDENADAS SIMPLEMENTE NECESITAMOS PASAR AL MAPA DE GOOGLE TODOS LOS PARAMETROS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      }); 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5    
    }; 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value); 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      }); 
  }

  //FUNCION DEL BOTON INFERIOR PARA QUE NOS DIGA LAS COORDENADAS DEL LUGAR EN EL QUE POSICIONAMOS EL PIN.
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
  }
  
  //AUTOCOMPLETE, SIMPLEMENTE ACTUALIZAMOS LA LISTA CON CADA EVENTO DE ION CHANGE EN LA VISTA.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  SelectSearchResult(item) {
    alert(JSON.stringify(item))      
    this.placeid = item.place_id
  }

  ClearAutocomplete(){
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }
 
  GoTo(){
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id='+this.placeid;
  }
  public tab1(){
    this.router.navigate(['tabs/tabs/tab1']);
  }

}
