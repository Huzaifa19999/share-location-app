import {getDatabase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setUser} from '../store/reducers/userSlice';

function Login({navigation}: any) {
  const [model, setModel] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleInputChange = (field: string, value: string) => {
    setModel((prevModel: any) => ({...prevModel, [field]: value}));
  };

  const loginUser = () => {
    if (!model.email || !model.password) {
      Alert.alert('Error!', 'All fields are required!');
      return;
    }

    setLoading(true);

    auth()
      .signInWithEmailAndPassword(model.email, model.password)
      .then((res: any) => {
        const user = res.user;
        const reference = getDatabase().ref(`/users/${user.uid}`);
        reference.once('value', data => {
          const userData = data.val()
          dispatch(setUser({uid:user.uid,userName: userData.userName || 'User', email: user.email}));
          console.log(data.val());
        });
        setLoading(false);
        console.log('User signed in!');
        Alert.alert('Authentication', 'User signed in!');
        navigation.navigate('Location')
      })
      .catch(error => {
        setLoading(false);

        if (error.code === 'auth/user-not-found') {
          Alert.alert('Error', 'No user found for this email!');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Incorrect password!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        } else {
          Alert.alert('Error', error.message);
        }

        console.error(error);
      });
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_1920,c_limit/GoogleMapTA.jpg',
      }}
      style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Login</Text>

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
              <TouchableOpacity onPress={loginUser} style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            )}

            <Text
              style={styles.signuptitle}
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              Don't have an account? Click here to sign up
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
  signuptitle: {
    color: 'blue',
    fontWeight: 'bold',
    marginTop: 15,
  },
});

export default Login;
