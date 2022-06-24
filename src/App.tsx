import {IonApp, IonRouterOutlet, IonSplitPane} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import TicketsList from './pages/TicketsList';
import TicketsView from './pages/TicketsView';
import Login from './Login';
import storage from "./storage";
import {Component} from "react";
import api, {configureApi} from "./api";
import Loading from "./Loading";
import config from './config';
import ClientTickets from './pages/ClientTickets';
import Dashboard from './pages/Dashboard';
import Horairis from './pages/Horairis';
import ChangeTicketStatus from './pages/ChangeTicketStatus';
import Tabs from './pages/Tabs'
interface StateInterface{
    loaded: boolean;
    loggedIn: boolean;
    error?: Error
}

export default class App extends Component<{}, StateInterface> {

    constructor(props : any) {
        super(props);
      
        this.state = {
                    loaded:false,
                    loggedIn:false 
                }
        
    }

    componentDidMount() {
        this.startLogin();

    }

    async startLogin(){ 
        let apiKey =  await storage.get('token');
        console.log('key',config.profile);
        // if(config.profile == 'CLIENT'){
        //     await configureApi();
        //     //this.setState({loaded: true, loggedIn: true})
        // }else{
            if(!apiKey) return this.setState({loaded: true, loggedIn: false})
            try {
                await configureApi();
              
                this.setState({loaded: true, loggedIn: true})
            }catch(e){
                this.setState({loaded: true, loggedIn: false, error: e})
            }
        //}
        
    }


    render() {
        if (!this.state.loaded)
            return (<Loading />)
        if (!this.state.loggedIn)
            return (<Login/>)

        return (
            <IonApp>
                <IonReactRouter> 
                    <IonSplitPane contentId="main">
                        <Menu/>
                        <IonRouterOutlet id="main">
                            <Route key={'1'} path="/" exact={true} render={(location) => {
                                // @ts-ignore
                                console.log(location);
                                // @ts-ignore
                                return <Dashboard {...location.match.params} />
                            }}>
                                
                            </Route>
                            <Route key={'2'} path="/overview/:link" exact={false} render={(location) => {
                                // @ts-ignore
                                console.log(location);
                                // @ts-ignore
                                return <TicketsList {...location.match.params} />
                            }}/>
                            <Route key={'3'} path="/ticket/:id" exact={false} render={(location) => {
                                // @ts-ignore
                                // @ts-ignore
                                return <TicketsView {...location.match.params} />
                            }}/>
                            <Route key={'4'} path="/page/:name/:title" exact={true}>
                                <Page/>
                            </Route>
                            <Route key={'5'} path="/clientTickets" exact={true}>
                                <ClientTickets/>
                            </Route>
                            <Route key={'6'} path="/horairis" exact={true}>
                                <Horairis/>
                            </Route>
                            <Route key={'7'} path="/changeTicketStatus/:id/:state_id/:priority_id" exact={true}>
                                <ChangeTicketStatus/>
                            </Route>
                        </IonRouterOutlet>
                    </IonSplitPane>
                </IonReactRouter>
            </IonApp> 
        );
    }
};