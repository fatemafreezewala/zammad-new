import React, {Component, useState} from "react";
import ReactDOM from "react-dom";
import { Camera, CameraResultType,CameraSource } from '@capacitor/camera';

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
    IonButton,
    IonButtons, IonMenuButton, IonItemDivider, IonInput, IonToggle
} from '@ionic/react';
// @ts-ignore
import { CKEditor } from "@ckeditor/ckeditor5-react";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CreateTicketAttachment.css"
import { attachOutline } from "ionicons/icons";
import api from "../api";
import config from "../config";

interface StateInterface {
    record: {
        ticket_id: number,
        to: string,
        cc?: string,
        subject?: string,
        body: string,
        content_type: string,
        type?: string,
        type_id?: number,
        internal: boolean,
        time_unit?: string 
        attachments?:any
    };
    date: Date;
    clicked: Array<string>;
    imageBase64?:string
    ifattachment:boolean
}
interface PropsInterface {
    ticketId: number,
    to: string,
    typeId: number,
    onSubmit?: Function,
    state_id:string,
    priority:string
}

export default class Menu extends Component<PropsInterface, StateInterface> {



    constructor(props : any) {
        super(props)
        this.state = this.getResetState();
         
    }

    getResetState(){
        return {
            date: new Date(),
            clicked: [],
            imageBase64:"",
            ifattachment:false,
            record: {
                ticket_id: this.props.ticketId,
                to: this.props.to,
                body: "",
                content_type: "text/plain",
                internal: false,
                attachments:[]
            }
        }
    }

    handleInputChange(name: string, value: any, record : Object) {
        // @ts-ignore
        record[name] = value;

        this.setState({
            record: this.state.record
        });
        console.log(this.state)
    }

    getProps(name : string, required : boolean, record : Object){
        if(!record) record = this.state.record;
        if(name.includes(".")){
            let parts=name.split(".");
            while(parts.length > 1){
                // @ts-ignore
                record=record[parts.shift()];
            }
            name=parts.shift() as string;
        }


        return {
            // @ts-ignore
            value: record[name]===undefined?"":record[name],
            onChange: (e : React.ChangeEvent<HTMLInputElement>)=>this.handleInputChange(name, e.target.value, record),
            onIonChange: (e : any)=>this.handleInputChange(name, e.detail.value,record),
            name: name,
            // @ts-ignore
            valid: (!required||record[name]) && (this.state.clicked.includes(name)),
            // @ts-ignore
            invalid: required&&!record[name] && (this.state.clicked.includes(name) || this.state.submitAttempted),
            required,
            onClick: ()=>{
                // @ts-ignore
                this.state.clicked.includes(name) || this.state.clicked.push(name);
                // @ts-ignore
                this.setState({clicked: this.state.clicked})
            }
        }
    }

    async componentDidMount() {

        this.setState(this.getResetState())

    }

    componentDidUpdate(prevProps: Readonly<PropsInterface>, prevState: Readonly<StateInterface>, snapshot?: any) {
        let updated : any = false;
        if(prevProps.ticketId !== this.props.ticketId) this.state.record.ticket_id = updated = this.props.ticketId;
        if(prevProps.to !== this.props.to) this.state.record.to = updated = this.props.to;
        if(updated) this.setState({record:this.state.record})
    }

    componentWillUnmount() {

    }

    async submit(){
        let data = this.state.record;
        if(data.internal){
            data.type="note"
        }else{
            data.type="email"
            data.type_id = this.props.typeId;
        }
        if(this.state.imageBase64 != ""){
            this.state.record.attachments = [{"filename": "img.png","data":this.state.imageBase64, "mime-type": "image/png"}]
        }
        let article = await api.createTicketArticle(this.state.record)
        if(this.props.onSubmit) this.props.onSubmit(article.data);
        this.setState(this.getResetState())
    }
   
    async uploadImage (record : Object)  {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType:CameraResultType.Base64,
        source:CameraSource.Camera 
      });
      let str:any;
     str = image.base64String;
      // @ts-ignore
      record['attachments'] = [{"filename": "img.png","data":str, "mime-type": "image/png"}]
     this.setState({record:this.state.record})
   
    };
    render() {

        // eslint-disable-next-line react-hooks/rules-of-hooks


        let data = this.state.record;

        return (


            <IonList>
                {config.profile == 'OPERATOR' && (<>
                    <IonListHeader>
                    <IonLabel><h4>New Reply</h4></IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel> To</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("to")}></IonInput>
                </IonItem>
                </>)}
               

                {!!this.props.ticketId || (
                <IonItem>
                    <IonLabel position="floating">{config.title}</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("title")}></IonInput>
                </IonItem>
                )}
                {config.profile == 'OPERATOR' && (<IonItem>
                    <IonLabel>{this.state.record.internal?"Internal Note":"Public Message"}</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonToggle checked={!this.state.record.internal} onIonChange={e => this.state.record.internal = e.detail.checked} />
                </IonItem>)}
                

                
                {config.profile == 'OPERATOR' ? (<>
                    <IonItemDivider>Message</IonItemDivider>
                    <CKEditor
                    style={{outerHeight:300,innerHeight:300}}
                    editor={ ClassicEditor }
                    data={this.state.record.body}
                    onReady={ (editor: any) => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event: any, editor: { getData: () => any; } ) => {
                        this.handleInputChange("body",editor.getData(),this.state.record);
                    } }
                />
                </> ) : (<IonItem>
                    <IonLabel position="floating">Message</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("body")}></IonInput>
                    <IonButtons slot="end">
                            <IonButton onClick={()=>{this.uploadImage(this.state.record)}}>
                                <IonIcon slot="end" icon={attachOutline} />
                            </IonButton>
                        </IonButtons>
                </IonItem>)}
                {this.state.record.attachments.length != 0  && ( <img src={`data:image/png;base64, ${this.state.record.attachments[0].data}`} style={{width:60,height:60}}></img>)}
                
                {config.profile == 'OPERATOR' && (<>
                    
                <IonItem>
                    <IonLabel position="floating">Account Time</IonLabel>
                    {/*
                    // @ts-ignore */}
                    <IonInput {...this.getProps("time_unit")}></IonInput>
                </IonItem></>)}
                {this.state.imageBase64 && ( <img src={`data:image/png;base64, ${this.state.imageBase64}`} style={{width:60,height:60}}></img>)}
          {/* <IonButton onClick={this.takePicture} expand="full">Upload Image</IonButton> */}
                <IonButton expand="full" onClick={this.submit.bind(this)}>{config.SEND_MESSAGE}</IonButton>
                 {config.profile == 'OPERATOR' && ( <IonButton color="primary" expand="full" routerLink={"/changeTicketStatus/" + this.props.ticketId+'/'+this.props.state_id+'/'+this.props.priority}>Change Status</IonButton>)}   
            </IonList>

        );
    }
}


