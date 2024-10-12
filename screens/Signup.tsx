import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useDispatch} from 'react-redux';
import { setUser } from '../store/reducers/userSlice';

function Signup({navigation}: any) {
  const [model, setModel] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleInputChange = (field: string, value: string) => {
    setModel((prevModel: any) => ({...prevModel, [field]: value}));
  };

  const signUpUser = () => {
    if (!model.email || !model.password || !model.userName) {
      Alert.alert('Error!', 'All fields are required!');
      return;
    }

    setLoading(true);

    auth()
      .createUserWithEmailAndPassword(model.email, model.password)
      .then((res: any) => {
        dispatch(setUser({uid:res.user.uid,userName:model.userName,email:model.email}))
        const reference = database().ref(`/users/${res.user.uid}`);
        reference.set({
          userName: model.userName,
          email: model.email,
          id:res.user.uid
        });
        setLoading(false);
        console.log('User account created & signed in!');
        Alert.alert('Success', 'User account created & signed in!');
        navigation.navigate('Location');
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert('Error!', 'That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('Error!', 'That email address is invalid!');
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_1920,c_limit/GoogleMapTA.jpg',
      }}
      style={styles.background}
      imageStyle={{opacity: 0.7}}
    >
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Signup</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              placeholderTextColor={'black'}
              value={model.userName}
              onChangeText={(text: any) => handleInputChange('userName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor={'black'}
              value={model.email}
              onChangeText={(text: any) => handleInputChange('email', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor={'black'}
              value={model.password}
              onChangeText={(text: any) => handleInputChange('password', text)}
              secureTextEntry={true}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#0096FF" />
            ) : (
              <TouchableOpacity onPress={signUpUser} style={styles.button}>
                <Text style={styles.buttonText}>Signup</Text>
              </TouchableOpacity>
            )}

            <Text
              style={styles.logintitle}
              onPress={() => {
                navigation.navigate('Login');
              }}>
              Already have an Account? Click here for Login
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    color: 'black',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 6,
    width: '80%',
    marginBottom: 12,
    paddingLeft: 15,
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#0096FF',
    color: 'white',
    width: '80%',
    height: 38,
    borderRadius: 4,
    padding: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  logintitle: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 15,
  },
});

export default Signup;
