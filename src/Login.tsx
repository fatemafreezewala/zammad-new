import React, {Component} from "react";
import ReactDOM from "react-dom";

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
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardHeader, 
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonButton, IonFooter,
    IonButtons, IonLoading,NavContext, IonBackButton, IonGrid, IonRow, IonCol, IonInput, IonToast,useIonRouter,IonRouterContext
} from '@ionic/react';

import {arrowBack, shapesOutline} from "ionicons/icons";
import apiHandler,{api} from "./api";
import storage from "./storage";
import FormComponent, {FormComponentState} from "./FormComponent";
 import APP from './App'
import config from "./config";
import { Plugins } from '@capacitor/core';
import { Keyboard } from '@awesome-cordova-plugins/keyboard';
const { App } = Plugins;

 
const Login: React.FC = () => {
    const [url, setUrl] = React.useState("http://support.sos-ndd.com")
    const [error, setError] = React.useState("")
    const [username, setusername] = React.useState("")
    const [password, setpassword] = React.useState("")
    const router = useIonRouter();
    const {navigate} = React.useContext(NavContext);
    const ionRouterContext = React.useContext(IonRouterContext);
    const [showLoading, setShowLoading] = React.useState(false);
    const ionRouter = useIonRouter();
    const [hidden, setHiddden] = React.useState(false)
    React.useEffect(() => {
      document.addEventListener('ionBackButton', (ev:any) => {
        ev.detail.register(-1, () => {
          if (!ionRouter.canGoBack()) {
            App.exitApp();
          }
        }); 
      });
      window.addEventListener('keyboardWillShow', () => {
        
        setHiddden(true)
      });
      window.addEventListener('keyboardDidShow', () => {
        
        setHiddden(true)
      });
      window.addEventListener('keyboardWillHide', () => {
        setHiddden(false)
      });
      window.addEventListener('keyboardDidHide', () => {
        setHiddden(false)
      });
    }, [])
    React.useEffect(() => {
                if(config.profile == 'CLIENT'){
            api.defaults.baseURL = url + "/api/v1/"
            api.defaults.headers["Authorization"] = "Token token=" + "AI72zBOA9O78Lu1sVWgHTRwr75XVwdEBb3oCPLFqJBpGt1jokt2MdUpEG4_IwKVR"
        }
       
    }, [])
    const redirect = React.useCallback(
        () => navigate('/'),
        [navigate]
      );
        const createNewUser = async()=>{
          setShowLoading(true)
        let data = (await apiHandler.createNewUser({ 
          "phone":username,
          "roles":"Customer"
        })).data
        if(data.id){
          storage.set('user',JSON.stringify(data))
          storage.set('url', "http://support.sos-ndd.com/api/v1/");
          storage.set('token', config.token);
          setShowLoading(false)
          redirect()
         
        }else{
          setShowLoading(false)
          alert('Something went wrong')
        }
      }
      const checkIfUserExistFunc = async()=>{
        setShowLoading(true)
        if(username != ""){
          let data = (await apiHandler.checkIfUserExist({
            "phone":username
          })).data
          if(data.length > 0){
            storage.set('user',JSON.stringify(data[0]))
            storage.set('url', "http://support.sos-ndd.com/api/v1/");
            storage.set('token', config.token);
            setShowLoading(false)
            redirect()
          }else{
            createNewUser()
          }
        }else{
          alert('Phone number is required')
        }
        
      }
    const login = async()=> {
      setShowLoading(true)
        try{  
            api.defaults.baseURL = url + "/api/v1/"
            api.defaults.headers['Authorization'] = `Basic ${btoa(username+":"+password)}`;

            let {permissions, tokens} = (await apiHandler.getApiTokens()).data;

            let token = await apiHandler.createApiToken({
                label: "app_login",
                permission: permissions.map((p : any)=>p.name),
            })

            storage.set('url', url);
            storage.set('token', btoa(token.data.name));
            redirect()

        }catch(e){
            console.error(e)
           setError(e.message)
        }finally{
          setShowLoading(false)
        }
        // First API request to get API Keys
        // Then let's create a key
        // Finally store it

    }
  return (
    <IonPage>
    <IonHeader>

 
    <IonToolbar>

        <IonButtons slot="start">
            <IonBackButton icon={arrowBack} text="" className="custom-back"/>
        </IonButtons>
        <IonTitle>
            {/* <img style={{height:24,width:35}} src={config.logo_icon} />  */}
            Login
        </IonTitle>
    </IonToolbar>
</IonHeader>
    {config.profile == 'CLIENT' ? (<IonContent fullscreen> 
    <IonGrid className="ion-padding">
        <IonRow>
            <IonCol className="align-items-center" size="12">
            <img  style={{width: 155,height: 190}} src={config.login_logo_top} />
          
           
                <h5>{config.login_title}</h5>
               
            </IonCol>
        </IonRow>

        <IonRow className="ion-margin-top ion-padding-top">
            <IonCol size="12">

                <IonList>
                    
                    {config.profile == 'CLIENT' ? (<>
                        <IonItem>
                        <IonLabel>Phone Number</IonLabel>
                       
                        <IonInput onIonChange={e => setusername(e.detail.value!)}></IonInput>
                    </IonItem>
                    </>) : (<>
                        <IonItem>
                        <IonLabel>Username</IonLabel>
                       
                        
                        <IonInput onIonChange={e => setusername(e.detail.value!)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Password</IonLabel>
                      
                        <IonInput onIonChange={e => setpassword(e.detail.value!)}></IonInput>
                    </IonItem>
                    </>)}
                    
                </IonList>

                <IonButton color="primary" expand="full" onClick={()=>{
                    if(config.profile == 'CLIENT'){
                        checkIfUserExistFunc()
                    }else{
                        login()
                    }
                }}>Login</IonButton>

            </IonCol>
        </IonRow>
    </IonGrid>
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
</IonContent>) : ( <IonContent fullscreen> 
    <IonGrid className="ion-padding">
        <IonRow>
            <IonCol className="align-items-center" size="12">
            <img  style={{width: 226}} src="assets/img1.png" />
                <h5>{config.login_title}</h5>
               
            </IonCol>
        </IonRow>

        <IonRow className="ion-margin-top ion-padding-top">
            <IonCol size="12">

                <IonList>
                    
                    {config.profile == 'CLIENT' ? (<>
                        <IonItem>
                        <IonLabel>Phone Number</IonLabel>
                       
                        <IonInput onIonChange={e => setusername(e.detail.value!)}></IonInput>
                    </IonItem>
                    </>) : (<>
                        <IonItem>
                        <IonLabel>Username</IonLabel>
                       
                        
                        <IonInput onIonChange={e => setusername(e.detail.value!)}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Password</IonLabel>
                      
                        <IonInput onIonChange={e => setpassword(e.detail.value!)}></IonInput>
                    </IonItem>
                    </>)}
                    
                </IonList>
                    
                <IonButton style={{background:'#000'}} expand="full" onClick={()=>{
                    if(config.profile == 'CLIENT'){
                        checkIfUserExistFunc()
                    }else{
                        login()
                    }
                }}>Login</IonButton>

            </IonCol>
        </IonRow>
    </IonGrid>
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
</IonContent>)}
   {hidden == false && (<IonFooter>
    <IonGrid className="ion-no-margin ion-no-padding">

        <IonRow className="ion-text-center ion-justify-content-center">
            <IonCol size="12">
                <p>
                   {config.company_name} Copyright © 2021 {config.company_name}
                </p>
            </IonCol>
        </IonRow>
        <svg style={{marginBottom: "-0.5rem"}} xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 1440 320">
            <path fill={config.theme} fillOpacity="1"
                  d="M0,288L40,277.3C80,267,160,245,240,224C320,203,400,181,480,176C560,171,640,181,720,181.3C800,181,880,171,960,144C1040,117,1120,75,1200,58.7C1280,43,1360,53,1400,58.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>

    </IonGrid>
</IonFooter>)}


</IonPage>
  );
};
export default Login;


