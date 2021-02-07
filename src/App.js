import React from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'


// PAGES 
import Reception from './pages/Reception';
import UserAccountSettings from './pages/UserAccountSettings';
import Dashboard from './pages/Dashboard';
import DentalRecords from './pages/DentalRecords';
import Payments from './pages/Payments';
import Appointments from './pages/Appointments';
import SMSTextMessaging from './pages/SMSTextMessaging';
import UserAccounts from './pages/UserAccounts';




import { Provider } from "react-redux";
import store from "./redux/store";

import CustomLayout from "./hocs/Layout";

function App() {



	return (
		<Provider store={store}>
			<Router>
				<CustomLayout>

					<Route render={({ location }) => (
						<TransitionGroup>
							<CSSTransition
								onEnter={() => {
									window.scrollTo(0, 0);
								}}
								key={location.key}
								timeout={500}
								classNames="move"
							>
								<Switch location={location}>
									<Route exact path="/" component={Dashboard} />
									<Route exact path="/home" component={Reception} />

									<Route exact path="/settings" component={UserAccountSettings} />

									<Route exact path="/dentalrecords" component={DentalRecords} />

									<Route exact path="/dentalrecords/:id" component={DentalRecords} />

									<Route exact path="/transactionlog" component={Payments} />
									<Route exact path="/appointments" component={Appointments} />
									<Route exact path="/sms" component={SMSTextMessaging} />

									<Route exact path="/useraccounts" component={UserAccounts} />
									<Route exact path="/useraccounts/:id" component={UserAccounts} />

								</Switch>
							</CSSTransition>
						</TransitionGroup>
					)} />
				</CustomLayout>
			</Router>
		</Provider>

	);

}


export default App;
