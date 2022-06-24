
import React from 'react'
import {
    IonContent,
    IonToast,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons, IonMenuButton
} from '@ionic/react';
import  api  from '../api';
import { useParams } from 'react-router';
export default function ChangeTicketStatus() {
    const [showLoading, setShowLoading] = React.useState(false);
    const [error, seterror] = React.useState('')
    // @ts-ignore
    const {id,state_id,priority_id} = useParams()
   
    const [priority, setPriority] = React.useState(priority_id)
    const [status, setStatus] = React.useState(state_id)
    const updateTicket = async() => {
       console.log(id)
          setShowLoading(true)
          let data = (await api.updateTicket({
            "id": id,
            "state_id": status,
            "priority": priority_id
         })).data
         if(data.id){
          setShowLoading(false)
         
          seterror(`Ticket Number ${data.number} Updated successfully.`)
         
          
         }else{
          setShowLoading(false)
          seterror('Error Updating tickets.')
         }
        
    }
    const handleDropdownChangePriority = (e:any)=> {
      console.log(e.target.value)
      setStatus(e.target.value)
    }
    const handleDropdownChangeStatus = (e:any)=> {
      setPriority(e.target.value)
    }
  return (
    <IonPage>
    <IonHeader>
        <IonToolbar>

            <IonButtons slot="start">
                <IonMenuButton/>
            </IonButtons>
            <IonTitle>Change Ticket Status</IonTitle>
            
        </IonToolbar>
    </IonHeader>
    <IonContent style={{padding:60}}>
      <IonItem style={{margin:10}}>
                    <IonLabel>Status</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <select  defaultValue={state_id} onChange={handleDropdownChangeStatus}>
                   
                        <option selected={status == '4' ? true : false} value="4">closed</option>

                        <option selected={status == '2' ? true : false} value="2" >open</option>

                        <option selected={status == '7' ? true : false} value="7">pending close</option> 

                        <option selected={status == '3' ? true : false} value="3">pending reminder</option>
                </select>
                </IonItem>
                <IonItem style={{margin:10}}>
                    <IonLabel>Priority</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <select defaultValue={priority_id} onChange={handleDropdownChangePriority}>
                    <option value="1">1 low</option>
                    <option  value="2">2 normal</option>
                    <option value="3">3 high</option>
                </select>
                </IonItem>
                <IonButton style={{margin:10}} expand="full" onClick={updateTicket}>Submit</IonButton>
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
  )
}
