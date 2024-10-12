import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import {View, Text, ScrollView} from 'react-native';

function UserLists({userId}: any) {
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    const onValueChange = database()
      .ref(`users`)
      .on('value', snapshot => {
        const users = snapshot.val();
        const usersWithLocation = Object.keys(users)
          .map(key => ({
            id: key,
            ...users[key],
          }))
          .filter(user => user.location);

        setLocationData(usersWithLocation);
      });

    return () => database().ref(`users`).off('value', onValueChange);
  }, []);

  return (
    <View>
      {locationData ? (
        <ScrollView>
          <View style={{padding: 10}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 24,
                marginBottom: 40,
                textAlign: 'center',
              }}>
              Users with Location Data
            </Text>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text style={{fontWeight: 'bold', flex: 1, fontSize: 18 , textAlign:'center'}}>
                User Name
              </Text>
              <Text style={{fontWeight: 'bold', flex: 1, fontSize: 18 , textAlign:'center'}}>
                Latitude
              </Text>
              <Text style={{fontWeight: 'bold', flex: 1, fontSize: 18 , textAlign:'center'}}>
                Longitude
              </Text>
            </View>
            {locationData.map((user: any) => (
              <View
                key={user.id}
                style={{
                  flexDirection: 'row',
                  marginBottom: 5,
                  borderColor: 'black',
                }}>
                <Text style={{flex: 1, borderColor: 'black', borderWidth: 1 , textAlign:'center'}}>
                  {user.userName}
                </Text>
                <Text style={{flex: 1, borderColor: 'black', borderWidth: 1 , textAlign:'center'}}>
                  {user.location.latitude}
                </Text>
                <Text style={{flex: 1, borderColor: 'black', borderWidth: 1 , textAlign:'center'}}>
                  {user.location.longitude}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Loading location data...</Text>
      )}
    </View>
  );
}

export default UserLists;
