import { IonItem,IonLabel,NavContext,
  IonInput,IonButtons,IonToast,IonMenuButton,
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonButton,IonActionSheet } from '@ionic/react';
import { useParams } from 'react-router';
import React, { useState,useEffect } from 'react';
import './Page.css';

import storage from "../storage";
import { appsOutline } from "ionicons/icons";
import api from "../api";
import config from '../config';
const Page: React.FC = () => {
  const {navigate} = React.useContext(NavContext); 
  const [data, setDATA] = useState([]);
  const [compData, setCompleteDATA] = useState([]);
  const [stateOptions, setstateOptions] = useState([]);
  
  const [showStateChange, setshowStateChange] = useState(false);
  const [readyForRender, setReadyForRender] = React.useState(false); 
   const id = useParams()
    useEffect(() => { 
        getAllClientTickets()
        setReadyForRender(true);
    },[id])
   
    const getAllClientTickets = async() =>{
        let user = await  storage.get('user')
        user = JSON.parse(user)
        console.log(user.phone)
        let overviewData = (await api.getAllTicketsForClient({phone:user.phone})).data
        if(overviewData.assets.Ticket){
            let allTickets = overviewData.assets.Ticket
            let ticketData:any = []
            for (var key in allTickets) {
                if (allTickets.hasOwnProperty(key)) {
                    ticketData.push(allTickets[key])
                }
            }
            ticketData = ticketData.reverse()
            setCompleteDATA(ticketData)
            setDATA(ticketData)

        }
        
        
    }
  
  {/*
       //@ts-ignore */}
  const sortData = (id) =>{
    console.log(id)
    if(id == 'all'){
      setDATA([...compData])
    }else{
{/*
       //@ts-ignore */}
       let temp = [];
       compData.forEach(element => {
         {/*
          //@ts-ignore */}
         if(element.state_id == id){
           temp.push(element)
         }
       });
       {/*
          //@ts-ignore */}
       setDATA([...temp])
    }
    
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar> 
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{config.my_tickets}</IonTitle>
          <IonButtons slot="end">
                            <IonButton onClick={()=>setshowStateChange(true)}>
                                <IonIcon slot="end" icon={appsOutline} />
                            </IonButton>
                        </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
         {data.map((element:any)=>{
             return <IonItem key={element.id} routerLink={"/ticket/" + element.id}>
            
             <IonLabel>
                 <div style={{flexDirection:'row',display:'flex'}}>
                 {element.state_id == '1' && (<div style={{width:9,height:9,borderRadius:10,background:'#3f93c5'}}></div>)}
                 {element.state_id == '4' && (<div style={{width:9,height:9,borderRadius:10,background:'#4ec53f'}}></div>)}
                 {element.state_id == '2' && (<div style={{width:9,height:9,borderRadius:10,background:'#ffa02a'}}></div>)}
                 <h2 style={{marginLeft:10}}>{element.title}</h2>
                 <h2 style={{position:'absolute',right:10,fontWeight:'bold',fontSize:14}}>No. {element.number}</h2>
                   </div>
                 <p>{element.note}</p>
                 
             </IonLabel>
             
             {/* <IonCardContent>
         Keep close to Nature's heart... and break clear away, once in awhile,
         and climb a mountain or spend a week in the woods. Wash your spirit clean.
     </IonCardContent> */}
         </IonItem>
         })}
         <IonActionSheet
            isOpen={showStateChange}
            onDidDismiss={() => setshowStateChange(false)}
            cssClass='my-custom-class'
            buttons={[{
              text:config.New,
              role: "",
              handler: () => sortData('1')
                },{
                  text:config.Open,
                  role: "",
                  handler: () => sortData('2')
              },{
                text:config.Closed,
                role: "",
                handler: () => sortData('4')
            },{
              text:config.All,
              role: "",
              handler: () => sortData('all')
          }]}>
          </IonActionSheet>
        </IonContent>
    </IonPage>
  );
};

export default Page;
