import React from 'react';
import { Switch, Route, Redirect }  from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import ShopPage from './pages/shop/shop.component'
import HomePage from './pages/homepage/homepage.component';
import Header from  './components/header/header.component'
import SingInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import {auth, createUserProfileDocument} from './firebase/firebase.utils';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
 
  unsubscribeFromAuth = null;

  componentDidMount()  {


    const { setCurrentUser } = this.props;
   

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
   

      if(userAuth) {
                    const userRef = await createUserProfileDocument(userAuth);
                    userRef.onSnapshot(snapShot=>{
                                      // now we can use the action code instead of set state
                                      this.props.setCurrentUser( {  id: snapShot.id, ...snapShot.data() });
                                      });

                    }

          // action code instead of set state
          this.props.setCurrentUser( userAuth );
   
     });
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth();
  }


  render(){
    return (
      <div>
        <Header  />
        <Switch>
          <Route   exact path ="/" component = {HomePage } />
          <Route path='/shop' component = {ShopPage} />
          <Route exact path ='/signIn' render={
                ()=> this.props.currentUser ? 
                      ( <Redirect to='/' /> )
                    : ( <SignInAndSignUpPage /> )
                
                }
          />
      </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});


const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});


export default connect( mapStateToProps, mapDispatchToProps) (App);
