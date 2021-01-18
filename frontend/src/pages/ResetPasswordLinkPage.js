import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
// import SpinningComponent from '../components/SpinningComponent';

function ResetPasswordLinkPage(props) {

   const [state, setState] = useState({
      resetPasswordStatus: undefined,
   });



   // componentDidMount() {
   //    const {token} = this.props.match.params;
   //    axios.post(`users/${token}/resetPassword`, {token})
   //    .then((response) => {
   //       if(response.status === 200) {
   //          this.setState({resetPasswordStatus: true});
   //       }
   //    }).catch((err) => {
   //       this.setState({resetPasswordStatus: false});
   //    });
   // }


   if (state.resetPasswordStatus === undefined)
      // return <SpinningComponent message="Resetting password..." />
   return <Redirect to={{
      pathname: '/login',
      state: { resetPasswordStatus: state.resetPasswordStatus }
   }} />

}

export default ResetPasswordLinkPage;