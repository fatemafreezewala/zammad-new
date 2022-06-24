import React, { useState,useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons, IonMenuButton, IonRefresher, IonRefresherContent
} from '@ionic/react';
import * as L from 'leaflet';
import "leaflet.markercluster";

import "leaflet.locatecontrol";

import config from '../config';
import './LeafletClustur.css';
import { useParams } from 'react-router';
import data from './../data.json'
const Horairis = () => { 
    //const map = L.Map; 
    const reload = useParams()
    useEffect(() => {

      makeMAp()
    }, []);
   
    const makeMAp = () =>{
     
      var base = {
        'Empty': L.tileLayer(''),
        'OpenStreetMap': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          'attribution': 'Map data &copy; SOS NDD contributors'
        })
      }; 

    let latlng = L.latLng(33.68491,  -7.3873137); 
      var map = L.map('map', {center: latlng, zoom: 15, layers: [base.OpenStreetMap],attributionControl:false,});
      var ifinit = map.hasLayer(base.OpenStreetMap)

      setTimeout(() => {map.invalidateSize(true)},1000);
          L.control.layers(base).addTo(map);
          L.control.attribution({});
          //L.attributionControl.addAttribution("SOS NDD");
          L.control.locate({
            
          }).addTo(map)
      var markers = L.markerClusterGroup();

      for (var i = 0; i < data.length; i++) {
        let a = data[i];
        let title = a[2];
              // @ts-ignore
        let marker = L.marker(new L.LatLng(a[0], a[1]), { title: title });
              // @ts-ignore
        marker.bindPopup(title);
        markers.addLayer(marker);
      }

      map.addLayer(markers);
    }
  return (
    <IonPage>
    <IonHeader>
      <IonToolbar> 
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{config.MAP}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent className="ion-padding">
       
        <div id="map" style={{height:'100%',width:'100%'}}>
   </div>
     
      </IonContent>
  </IonPage>
  );
};

export default Horairis;


