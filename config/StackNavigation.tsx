// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Signup from '../screens/Signup';
import Login from '../screens/Login';
import Map from '../screens/Map';
import LocationSharing from '../screens/LocationSharing';
import UserLists from '../screens/UserLists';

const Stack = createNativeStackNavigator();

function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Signup"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0096FF',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
          headerTitleAlign:'center',
        }}>
        <Stack.Screen options={{title:'Signup Screen'}} name="Signup"component={Signup} />
        <Stack.Screen  options={{title:'Login Screen'}} name="Login" component={Login} />
        <Stack.Screen  options={{title:'Map Screen'}} name="Map" component={Map} />
        <Stack.Screen  options={{title:'Location Screen'}} name="Location" component={LocationSharing} />
        <Stack.Screen  options={{title:'User List Screen'}} name="Users" component={UserLists} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
