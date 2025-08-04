import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

// Lazy load components for better performance
const Reception = React.lazy(() => import('./pages/Reception'));
const UserAccountSettings = React.lazy(() => import('./pages/UserAccountSettings'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const DentalRecords = React.lazy(() => import('./pages/DentalRecords'));
const Payments = React.lazy(() => import('./pages/Payments'));
const Appointments = React.lazy(() => import('./pages/Appointments'));
const SMSTextMessaging = React.lazy(() => import('./pages/SMSTextMessaging'));
const UserAccounts = React.lazy(() => import('./pages/UserAccounts'));
const TreatmentPlanning = React.lazy(() => import('./pages/TreatmentPlanning'));
const MedicalHistory = React.lazy(() => import('./pages/MedicalHistory'));
const Reports = React.lazy(() => import('./pages/Reports'));
const ServerConfigPage = React.lazy(() => import('./components/ServerConfig/ServerConfigPage'));

import { Provider } from "react-redux";
import store from "./redux/store";

import CustomLayout from "./containers/Layout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSkeleton from "./components/common/LoadingSkeleton";

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
				<Suspense fallback={<LoadingSkeleton type="dashboard" />}>
					<Routes location={location}>
						<Route path="/" element={<Dashboard />} />
						<Route path="/home" element={<Reception />} />
						<Route path="/settings" element={<UserAccountSettings />} />
						<Route path="/dentalrecords" element={<DentalRecords />} />
						<Route path="/dentalrecords/:id" element={<DentalRecords />} />
						<Route path="/treatments" element={<TreatmentPlanning />} />
						<Route path="/medical-history" element={<MedicalHistory />} />
						<Route path="/reports" element={<Reports />} />
						<Route path="/transactionlog" element={<Payments />} />
						<Route path="/appointments" element={<Appointments />} />
						<Route path="/sms" element={<SMSTextMessaging />} />
						<Route path="/useraccounts" element={<UserAccounts />} />
						<Route path="/useraccounts/:id" element={<UserAccounts />} />
						<Route path="/server-config" element={<ServerConfigPage />} />
					</Routes>
				</Suspense>
			</CSSTransition>
		</TransitionGroup>
	);
}

function App() {
	return (
		<ErrorBoundary>
			<Provider store={store}>
				<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
					<CustomLayout>
						<AppRoutes />
					</CustomLayout>
				</Router>
			</Provider>
		</ErrorBoundary>
	);
}


export default App;
