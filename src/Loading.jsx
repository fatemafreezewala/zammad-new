import {Component} from "react";
import {IonPage, IonContent, IonSpinner} from "@ionic/react";

export default class Loading extends Component{
    render() {
        return (
            <IonPage>
                <IonContent style={{"textAlign":"center"}}>
                    <IonSpinner style={{"paddingTop":"100%"}} />
                </IonContent>
            </IonPage>
        )
    }
}