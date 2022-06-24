import axios from 'axios';
import storage from "./storage";
//import { HTTP } from '@ionic-native/http';
import config from "./config";
export let api = axios.create({
})

export let configureApi = async ()=>{
    console.log(config.profile)
    api.defaults.baseURL = 'http://support.sos-ndd.com' + "/api/v1/"
   
    if(config.profile == 'CLIENT'){
        api.defaults.headers["Authorization"] = "Token token=" + config.client_token
        //api.defaults.headers["Authorization"] = "Token token=" + "AI72zBOA9O78Lu1sVWgHTRwr75XVwdEBb3oCPLFqJBpGt1jokt2MdUpEG4_IwKVR"
    }else{
        api.defaults.headers["Authorization"] = "Token token=" + atob(await storage.get("token"))
   // api.defaults.headers["Authorization"] = "Token token=" + "AI72zBOA9O78Lu1sVWgHTRwr75XVwdEBb3oCPLFqJBpGt1jokt2MdUpEG4_IwKVR"
    }
    
} 

api.interceptors.response.use(
    (response) => {
        //return response.data
        return response
    },
    (error) => {
        console.error(error);
        throw error;
        return Promise.reject({...error})
    }
)

/**
 let http = HTTP;
 let api = {
    get: (key : string) => {
        const url = env.url+"/api/v1/"+key;
        const params = {};
        const headers = {"Authorization": "Token token="+env.apikey};

        return http.get(url, params, headers);
    }
}
 */

class API {

    constructor(){
       
        //this.getMe()
    }

    getMe(){
        return api.get("users/me").then(res=>{
            this.getMe = ()=>res.data;
            return res
        }); 
    }

    /**
     * @returns Promise<Object>
     */
    getOverviews() {
        return api.get("ticket_overviews?_=123")
    }

    getOverviewTickets(link: string) {
        return api.get("ticket_overviews?view=" + link)
    }

    getTickets() {
        return api.get("tickets")
    }

    updateTicket(data: any) {
        return api.put("tickets/"+data.id, data)
    }
    updateTicketPriorityState(data: any) {
        return api.put("tickets/"+data.id, data)
    }
    getTicket(id: number) {
        return api.get("tickets/" + id + "?all=true")
    }

    createTicketArticle(article: {
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
     }
        ) {
        return api.post("ticket_articles", article)
    }


    getApiTokens() {
        return api.get("user_access_token")
    }

    createApiToken(data : {
        "label": string,
        "permission": [string],
        "expires_at"?: string
    }) {
        return api.post("user_access_token", data)
    }

    getStates(){
        return api.get("ticket_states")
    }
    createNewUser(data:{
        "phone": string,
        "roles": string
      }){
        return api.post("users", data)
    }
    createNewUser1(data:{
        "firstname": string,
        "lastname":string,
        "email": string,
        "login": string,
        "organization": null,
        "phone":string,
        "roles": any
      }){
        return api.post("users", data)
    }
   
    createTicketOperator(data :  {
        "title": any,
       "group":string,
        "customer": string,
        "article": {
           "subject": string,
           "body": string,
           "type": string,
           "internal": boolean,
           "content_type": "text/plain",
            "attachments":any
        }
     }) {
        return api.post("tickets", data)
    }
    createTicketClient(data : {
    "title": string,
    "group": string,
    "article": {
        "subject":string,
        "body": string,
        "type": "note",
        "internal":false,
        "content_type": "text/plain",
        "attachments":any
    },
    "customer":any,
    "note": string,
    "coordinates"?:string
    }) {
        return api.post("tickets", data)
    }
    checkIfUserExist (data:{
        phone:string
    }){
        console.log(api.defaults.baseURL)
        return api.get(`users/search?query=${data.phone}`)
    }
    getAllTicketsForClient (data:{
        phone:string
    }){
        return api.get(`tickets/search?query=${data.phone}`)
    }
    Uploadattachments(data : {
        form_id:any,
        file:any
    }) {
        return api.post("attachments", data)
    }
}


let apiInstance = new API();

export default apiInstance;