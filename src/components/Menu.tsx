import React, {Component} from "react";
import ReactDOM from "react-dom";
import { menuController } from "@ionic/core";
import config from "../config";


import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  add, addOutline,
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp, listOutline,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  locateOutline
} from 'ionicons/icons';
import './Menu.css';
import api from "../api";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: config.new_tickets,
    url: '/page/new/New%20Ticket',
    iosIcon: add,
    mdIcon: add
  },
];


interface MenuState {
  overviews: any[]; //replace any with suitable type
  date: Date;
}

export default class Menu extends Component<{}, MenuState> {
   name1:any = ''
  constructor(props : any) {
    super(props)
    this.state = {
      date: new Date(),
      overviews: []
    }
  }

  async reloadList() {
    if(config.profile == 'CLIENT'){
      let overviews = [{
        "name": config.my_tickets,
        "prio": 1000,
        "link": "clientTickets",
        "count": 0
    }];
    this.setState({overviews});
    }else{
      let overviews = (await api.getOverviews()).data
      overviews.forEach((element:any) => {
        this.name1 = element.name.replace('&','_').replace(/ /g,"_");
        console.log(this.name1)
         {/*
              //@ts-ignore */}
        element.name = config[this.name1]
      });
      console.log(overviews);
      this.setState({overviews});
    }
    
  }

  async componentDidMount() {
    await this.reloadList();

  }

  componentWillUnmount() {

  }

  render() {

    // eslint-disable-next-line react-hooks/rules-of-hooks


    return (
        <IonMenu contentId="main" type="overlay">
          <IonContent>
            <IonList id="inbox-list">
              {config.profile == 'OPERATOR' ? (<>
               {/*
              //@ts-ignore */}
                <IonListHeader>{api.getMe().firstname} {api.getMe().lastname}</IonListHeader>
                 {/*
              //@ts-ignore */}
              <IonNote>{api.getMe().email}</IonNote>
              </>) : (<>
                <IonListHeader>{config.welcome_msg}</IonListHeader>
                 {/*
              //@ts-ignore */}
              <IonNote>{config.sub_title}</IonNote>
              </>)}
              {/*
              //@ts-ignore */}
              {/* <IonListHeader>{api.getMe().firstname} {api.getMe().lastname}</IonListHeader> */}
             
              {/*
              //@ts-ignore */}
              {/* <IonNote>{api.getMe().email}</IonNote> */}
              {appPages.map((appPage, index) => {
                return (
                    <IonMenuToggle key={index.toString()} autoHide={false}>
                      <IonItem routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                        <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                );
              })}
            </IonList>

            <IonList id="labels-list">
              <IonListHeader>Labels</IonListHeader>
              {this.state.overviews.map((overview: any) => (
                <>
                  {overview.link == 'clientTickets' ? (
                     <IonItem  routerLink={"/clientTickets"} onClick={()=>menuController.close()} lines="none" key={overview.name}>
                     <IonIcon slot="start" icon={listOutline} />
                     <IonLabel>{overview.name}</IonLabel>
                   </IonItem>
                  ) : (
                    <IonItem routerLink={"/overview/"+overview.link} onClick={()=>menuController.close()} lines="none" key={overview.name}>
                    <IonIcon slot="start" icon={listOutline} />
                    <IonLabel>{`${overview.name}`}</IonLabel>
                    </IonItem>
                  )}
                  
                </> 
                 
              ))} 
              <IonItem routerLink={"/horairis"} onClick={()=>menuController.close()} lines="none" key={"horairis"}>
                    <IonIcon slot="start" icon={locateOutline} />
                    <IonLabel>{config.map}</IonLabel>
                    </IonItem>
            </IonList>
          </IonContent>
        </IonMenu>
    );
  }
}


