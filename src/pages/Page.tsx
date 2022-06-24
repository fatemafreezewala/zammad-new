import { IonItem,
  IonLabel,
  IonInput,
  IonButtons,
  IonToast,
  IonMenuButton,IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
  IonLoading, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState,useEffect } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import storage from "../storage";
import { Capacitor } from "@capacitor/core";

import { Geolocation } from '@capacitor/geolocation';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as L from 'leaflet';
import api from "../api";
import Location from './Location'
import config from '../config';
const Page: React.FC = () => {

  const { name,title } = useParams<{ name: string;title:string; }>();
  const [phone, setPhone] = useState({});
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [format, setFormat] = useState('jpeg');
  const [imagebase, setImage] = useState(null);
  const [error, seterror] = useState('')
  const [showLoading, setShowLoading] = useState(false);

  let str:any;

  
  
  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType:CameraResultType.Base64,
      source: CameraSource.Camera
    });
    str = image.base64String;
    setImage(str)
    setFormat(image.format)
  };

  const getLocation = async () => {
    if(imagebase == null || text == ''){
      alert('Image and Title is required.')
      
    }else{
      try {
        const hasPermission = await Geolocation.checkPermissions();
        if(hasPermission.location == "granted"){
          const coordinates = await Geolocation.getCurrentPosition();
          addTicket(coordinates.coords.latitude,coordinates.coords.longitude)
        }else{
          const requestPermission = await Geolocation.requestPermissions();
          if(requestPermission.location == 'granted'){
            const coordinates = await Geolocation.getCurrentPosition();
            addTicket(coordinates.coords.latitude,coordinates.coords.longitude)
          }
        }
          
        
          console.log('Current position:', hasPermission);
        
      } catch (e) {
        
        console.log(e)
      }
    }
    
}
const isMarkerInsidePolygon = (lat:any, long:any) => {
  var latlngs:any = config.city_coordinates;
  var polygon = L.polygon(latlngs)
  var result = polygon.getBounds().contains({lat:lat,lng:long});
  return result
  
};
const checkPermissions = async () => {
  console.log('called')
  const hasPermission = await Location.checkGPSPermission();
  if (hasPermission) {
      if (Capacitor.isNativePlatform()) {
          const canUseGPS = await Location.askToTurnOnGPS();
          postGPSPermission(canUseGPS);
      }
      else {
        postGPSPermission(true);
      }
  }
  else {
      
      const permission = await Location.requestGPSPermission();
      if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
          if (Capacitor.isNativePlatform()) {
              const canUseGPS = await Location.askToTurnOnGPS();
              postGPSPermission(canUseGPS);
          }
          else {
            postGPSPermission(true);
          }
      }
      else {
        alert('User denied location permission')
          
      }
  }
}
const postGPSPermission = async (canUseGPS: boolean) => {
  if (canUseGPS) {
    getLocation()
  }
  else {
     alert('Please turn on GPS to get location')
        
  } 
}
  const addTicket = async(lat:any,long:any) => {
 
    var ifinside  = isMarkerInsidePolygon(lat,long)
    console.log(ifinside)
    if(ifinside == true){
      setShowLoading(true)
      let data = (await api.createTicketClient({
      "title": text,
      "group": config.profile == 'CLIENT' ? config.client_group : config.operator_group,
      "article": {
          "subject":text,
          "body": config.profile == 'CLIENT' ? "APP SOS NADAFA": "created by IVRAgent",
          "type": "note",
          "internal":false,
          "content_type": "text/plain",
            "attachments":[{
              "filename": `image.${format}`,
               "data": imagebase,
               "mime-type": `image/${format}`
            }]
      },
      "customer":phone, 
      "note": message,
      "coordinates":lat+','+long
      }
     )).data
     if(data.id){
      setShowLoading(false)
      setMessage('')
      seterror(`Ticket Created successfully. Your ticket number is ${data.number}`)
      setText('')
      setImage(null)
      
     }else{
      setShowLoading(false)
      seterror('Error creating tickets.')
     }
    }else{
      alert('Cannot create ticket for this area.')
    }
}



const onClear = ()=>{
  setText('')
  setImage(null)
}
React.useEffect(() => {
  getUser()

}, [])
const getUser = async()=>{
  let obj = await storage.get('user')
  obj = JSON.parse(obj)
  console.log(obj)
  setPhone(obj)
}
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar> 
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{config.new_tickets}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
          {/* <IonImg style={{ 'border': '1px solid black', 'minHeight': '100px' }} src={photo} ></IonImg> */}
         <img style={{width:150,height:150}} src='assets/technical-support.png'></img>
          <IonItem>
            <IonLabel position="floating">{config.title}</IonLabel>
            <IonInput onIonChange={e => setText(e.detail.value!)}  value={text}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Message</IonLabel>
            <IonInput onIonChange={e => setMessage(e.detail.value!)}  value={message}></IonInput>
          </IonItem>
         {imagebase && ( <img src={`data:image/${format};base64, ${imagebase}`} style={{width:60,height:60}}></img>)}
          <IonButton onClick={takePicture} color="primary" expand="full">{config.upload_image}</IonButton>
          <IonButton onClick={checkPermissions} expand='full' color="secondary">{config.SUBMIT}</IonButton>
          <IonButton onClick={onClear} expand='full' color="light">{config.Clear}</IonButton>
          <IonToast
                        isOpen={error != ''}
                        message={error}
                        position="top"
                        duration={5000}
                    />
                      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
        //duration={5000}
      />
        </IonContent>
    </IonPage>
  );
};

export default Page;
