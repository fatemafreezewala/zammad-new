

import React, {Component, useState,useEffect} from "react";
import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonCard,
    IonCardContent,
    IonButton, 
    IonPage,
    IonButtons, IonItemDivider, IonInput, useIonRouter,
    IonHeader,IonToolbar,IonMenuButton,IonTitle, IonAvatar, IonCardTitle, IonRow, IonCol
} from '@ionic/react';
import config from "../config";
import { CallNumber } from '@awesome-cordova-plugins/call-number';
import { call } from 'ionicons/icons';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
const Dashboard = () => {
  const ionRouter = useIonRouter();
  useEffect(() => {
    document.addEventListener('ionBackButton', (ev:any) => {
      ev.detail.register(-1, () => {
        if (!ionRouter.canGoBack()) {
          App.exitApp();
        }
      }); 
    });
  }, [])
  
  return ( 
    <IonPage>
        <IonHeader>
                    <IonToolbar>

                        <IonButtons slot="start">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle>Dashboard</IonTitle>
                    </IonToolbar> 
                </IonHeader>
                {config.profile == 'OPERATOR' ? ( <IonContent style={{flex:1,justifyContent:'center',alignItems:'center',background:'#000'}}>
        <p style={{fontSize:20,textAlign:'center',fontWeight:'bold'}}>{config.call_text}</p>
        <IonButton onClick={()=>{
            CallNumber.callNumber("0522755490", true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err))
        }} style={{width:'90%',alignSelf:'center',marginLeft:'5%'}} expand='full' color="secondary">{config.contact_button_text}
        <IonIcon slot="start" icon={call} />
        </IonButton>
        <IonList>
        <IonItem routerLink="/page/new/New%20Ticket">
            <IonAvatar slot="start">
              <img src="../../assets/essay.png" />
            </IonAvatar>
            <IonLabel>
              <h2>{config.new_tickets}</h2>
             
            </IonLabel>
          </IonItem>
          <IonItem routerLink='overview/my_assigned'>
            <IonAvatar slot="start">
              <img src="../../assets/paper.png" />
            </IonAvatar>
            <IonLabel>
              <h2>{config.my_tickets}</h2>
             
            </IonLabel>
          </IonItem>
          <IonItem routerLink={"/horairis"}>
            <IonAvatar slot="start">
              <img src="../../assets/map.png" />
            </IonAvatar>
            <IonLabel>
              <h2>{config.map}</h2>
             
            </IonLabel>
          </IonItem>
        </IonList>
    </IonContent>) : ( <IonContent style={{flex:1,justifyContent:'center',alignItems:'center',background:'#000'}}>
        <h4 style={{marginLeft:20}}>Welcome</h4>
        <IonRow>
          <IonCol>
          <IonCard style={{textAlign:'center'}} routerLink="/page/new/New%20Ticket">
          <IonCardContent>
              <img style={{width:100,height:100}} src="../../assets/essay.png" />
            <IonCardTitle>{config.new_tickets}</IonCardTitle>
          </IonCardContent>
        </IonCard>
          </IonCol>
          <IonCol>
          <IonCard style={{textAlign:'center'}} routerLink={"/clientTickets"}>
          <IonCardContent>

              <img style={{width:100,height:100}} src="../../assets/paper.png" />
           
            <IonCardTitle>{config.my_tickets}</IonCardTitle>
          </IonCardContent>
          
          
         
        </IonCard>
          </IonCol>
          <IonCol>
          <IonCard style={{textAlign:'center'}} routerLink={"/horairis"}>
          <IonCardContent>

              <img style={{width:100,height:100}} src="../../assets/map.png" />
           
            <IonCardTitle>{config.map}</IonCardTitle>
          </IonCardContent>
          
          
         
        </IonCard>
          </IonCol>
          <IonCol></IonCol>
        </IonRow>
        <p style={{fontSize:16,margin:20}}>{config.call_text}</p>
        <IonButton onClick={()=>{
            CallNumber.callNumber(config.support_phone, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err))
        }} style={{width:'90%',alignSelf:'center',marginLeft:'5%'}} expand='full' color="danger">{config.contact_button_text}
        <IonIcon slot="start" icon={call} />
        </IonButton>
    </IonContent>)}
       
    </IonPage>
    
  );
};

export default Dashboard;
