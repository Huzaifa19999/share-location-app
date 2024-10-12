import React, { useEffect, useState } from 'react';
import database from '@react-native-firebase/database';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Map({ navigation }: any) {
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    const onValueChange = database()
      .ref(`users`)
      .on('value', snapshot => {
        const users = snapshot.val();
        // Filter users who have location data
        const usersWithLocation = Object.keys(users)
          .map(key => ({
            id: key,
            ...users[key], // Spread user details (email, username)
          }))
          .filter(user => user.location); // Only keep users with location

        setLocationData(usersWithLocation);
      });

    // Cleanup the listener
    return () => database().ref(`users`).off('value', onValueChange);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Location')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
      {locationData ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: locationData[0]?.location?.latitude || 37.78825, // Default if no data
            longitude: locationData[0]?.location?.longitude || -122.4324, // Default if no data
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {locationData.map((user: any) => (
            <Marker
              key={user.id}
              coordinate={{
                latitude: user.location.latitude,
                longitude: user.location.longitude,
              }}
              title={user.userName}
              description={`Lat: ${user.location.latitude}, Lon: ${user.location.longitude}`}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading location data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonText: {
    color: 'blue',
    fontSize: 18,
    padding: 10,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
});

export default Map;
