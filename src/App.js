import React from 'react';
import { Switch, Route }  from 'react-router-dom';
import ShopPage from './pages/shop/shop.component'
import './App.css';
import HomePage from './pages/homepage/homepage.component';
import Header from  './components/header/header.component'
import SingInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import {auth, createUserProfileDocument} from './firebase/firebase.utils';

class App extends React.Component {
 constructor() {
   super();

   this.state = {
      currentUser : null
   }
  }

  unsubscribeFromAuth = null;

  componentDidMount()  {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      //this.setState({currentUser:user}); //old lesson to show signout
     //createUserProfileDocument(user);   //lesson 87 Storing user data in firebase 

      if(userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapShot=>{
           this.setState({
             currentUser: {
               id:snapShot.id,
               ...snapShot.data() //spread all other data
             }
           }
           )
        })
      }
      else
      {
        this.setState({currentUser:userAuth});
      }
   
     })
  }

  componentWillUnmount(){
    this.unsubscribeFromAuth();
  }


  render(){
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route   exact path ="/" component = {HomePage } />
          <Route path='/shop' component = {ShopPage} />
          <Route path ='/signIn' component = {SingInAndSignUp} />
      </Switch>
      </div>
    );
  }
}

export default App;
