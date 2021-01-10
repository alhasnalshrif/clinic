import React from 'react';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

// MY COMPONENTS
// import SpinningComponent from './components/SpinningComponent';

// PAGES 
import Login from './pages/Login';
import PatientHomePage from './pages/PatientHomePage';
import PatientAccountSettings from './pages/PatientAccountSettings';
import Dashboard from './pages/Dashboard';
import DentalRecords from './pages/DentalRecords';
import Payments from './pages/Payments';
import Appointments from './pages/Appointments';
import SMSTextMessaging from './pages/SMSTextMessaging';
import UserAccounts from './pages/UserAccounts';

// import ResetPasswordLinkPage from './pages/ResetPasswordLinkPage';



import { Provider } from "react-redux";
import store from "./redux/store";

import CustomLayout from "./hocs/Layout";

function App() {



	return (
		<Provider store={store}>
			<Router>
				<CustomLayout>
					<Layout style={{ minHeight: '100vh' }}>

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
										<Route exact path="/home" component={PatientHomePage} />
										<Route exact path="/settings" component={PatientAccountSettings} />
										<Route exact path="/dentalrecords" component={DentalRecords} />

										<Route exact path="/dentalrecords/:id" component={DentalRecords} />
										
										<Route exact path="/transactionlog" component={Payments} />
										<Route exact path="/appointments" component={Appointments} />
										<Route exact path="/sms" component={SMSTextMessaging} />

										<Route exact path="/useraccounts" component={UserAccounts} />
										<Route exact path="/useraccounts/:id" component={UserAccounts} />

										<Route exact path="/login" component={Login} />
									</Switch>
								</CSSTransition>
							</TransitionGroup>
						)} />
					</Layout>
				</CustomLayout>
			</Router>
		</Provider>

	);

}


export default App;
