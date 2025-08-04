import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

import CustomLayout from "./containers/Layout";

function AppRoutes() {
	const location = useLocation();

	return (
		<TransitionGroup>
			<CSSTransition
				onEnter={() => {
					window.scrollTo(0, 0);
				}}
				key={location.key}
				timeout={500}
				classNames="move"
			>
				<Routes location={location}>
					<Route path="/" element={<Dashboard />} />
					<Route path="/home" element={<Reception />} />
					<Route path="/settings" element={<UserAccountSettings />} />
					<Route path="/dentalrecords" element={<DentalRecords />} />
					<Route path="/dentalrecords/:id" element={<DentalRecords />} />
					<Route path="/transactionlog" element={<Payments />} />
					<Route path="/appointments" element={<Appointments />} />
					<Route path="/sms" element={<SMSTextMessaging />} />
					<Route path="/useraccounts" element={<UserAccounts />} />
					<Route path="/useraccounts/:id" element={<UserAccounts />} />
				</Routes>
			</CSSTransition>
		</TransitionGroup>
	);
}

function App() {
	return (
		<Provider store={store}>
			<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<CustomLayout>
					<AppRoutes />
				</CustomLayout>
			</Router>
		</Provider>
	);
}


export default App;
