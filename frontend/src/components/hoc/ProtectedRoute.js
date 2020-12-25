import React,{useState} from 'react';
import {Route, Redirect} from 'react-router-dom';
import axios from 'axios';


function ProtectedRoute(props) {

      const [state, setState] = useState({
         redirect: false,
      user: ''
      });



   // componentDidMount() {
   //    axios.get('users/')
   //    .then((response) => {
   //       if(response.status === 200) {
   //          setState({redirect: false, user:response.data.user});
   //       }
   //    }).catch((err) => {
   //       if(err)
   //          setState({redirect: true});
   //    });
   // }

   
      const {component: Component, user, ...rest} = props;
      // const {pathname} = props.location;
      return (
         <Route {...rest} render={(props) => {
           if(!state.redirect)
               return <Component user={user} {...props}/>
            return (
               <Redirect to={
                  {
                     pathname: "/",
                     state: {
                        from: props.location
                     }
                  }
               }/>
            );
         }}/>
      );
   
}

export default ProtectedRoute;

// if(!state.redirect 
//    && state.role === 'dentalaide' && 
//    (pathname === '/useraccounts' || pathname === '/dashboard' || pathname === '/transactionlog')) {
//       return (
//          <Redirect to={
//             {
//                pathname: "/",
//                state: {
//                   from: props.location
//                }
//             }
//          }/>
//       );
//    }
// else if(!state.redirect && state.role === 'patient' && 
// (pathname === '/useraccounts' || pathname === '/dashboard' || pathname === '/transactionlog' 
// || pathname === '/dentalrecords' || '/appointments' || '/sms' )) {
//    return (
//       <Redirect to={
//          {
//             pathname: "/",
//             state: {
//                from: props.location
//             }
//          }
//       }/>
//    );
// }
// else if(!state.redirect)
//    return <Component {...props}/>
// return (
//    <Redirect to={
//       {
//          pathname: "/",
//          state: {
//             from: props.location
//          }
//       }
//    }/>
// );