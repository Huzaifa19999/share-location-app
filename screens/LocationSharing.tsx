import React, {useEffect} from 'react';
import {View, Button, Alert, Platform, Text} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch, useSelector} from 'react-redux';
import {setLocation} from '../store/reducers/userSlice';
import firebase from '@react-native-firebase/app';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Map from './Map';

const LocationSharing = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      if (result === RESULTS.GRANTED) {
        handleShareLocation();
      } else {
        Alert.alert('Location permission not granted');
      }
    } catch (error) {
      console.error('Failed to request location permission', error);
    }
  };

  const handleShareLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        dispatch(setLocation({latitude, longitude}));

        if (user.isAuthenticated) {
          firebase.database().ref(`users/${user.uid}/location`).set({
            latitude,
            longitude,
          });
        }
      },
      (error: any) => {
        console.error(error);
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  const userList = () => {
    navigation.navigate('Users');
  };

  const logOut = () => {
    navigation.navigate('Signup');
  };
  const goToBack = () => {
    navigation.navigate('Map');
  };

  return (
    <View>
      <Button title="Share Location" onPress={requestLocationPermission} />
      <Button title="Users Location List" onPress={userList} />
      <Button title="Go to Map" onPress={goToBack} />
      <Button title="Logout" onPress={logOut} />
      <Text style={{textAlign:'center',marginTop:150,fontSize:30,fontWeight:'bold'}}>Welcome</Text>
      <Text style={{textAlign:'center',marginTop:10,fontSize:30,fontWeight:'bold'}}>{user.userName}</Text>
    </View>
  );
};

export default LocationSharing;