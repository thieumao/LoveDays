import React, { FC, useState, useEffect } from 'react';
import { Platform, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { RootStackScreenProps } from '../types';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

enum PERSON {
  ONE = 'ONE',
  TWO = 'TWO',
}

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const pickImage = async (person: PERSON) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled && result.uri) {
      if (person === PERSON.ONE) {
        setImage1(result.uri);
      } else if (person === PERSON.TWO) {
        setImage2(result.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image style={styles.container} source={require("../assets/images/banner.png")} />
        <Text style={styles.title}>From 04/03/2018</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.twoPeople}>
          <View style={styles.people}>
            <TouchableOpacity onPress={() => pickImage(PERSON.ONE)}>
              {!image1 && <Image style={styles.avatar} source={require("../assets/images/avatar.png")} />}
              {image1 && <Image style={styles.avatar} source={{ uri: image1 }} />}
            </TouchableOpacity>
            <Text style={styles.name}>Person 1</Text>  
          </View>
          <View style={styles.people}>
            <TouchableOpacity onPress={() => pickImage(PERSON.TWO)}>
              {!image2 && <Image style={styles.avatar} source={require("../assets/images/avatar.png")} />}
              {image2 && <Image style={styles.avatar} source={{ uri: image2 }} />}
            </TouchableOpacity>
            <Text style={styles.name}>Person 2</Text>  
          </View>
        </View>
        <Text style={styles.day}>2000 days</Text>  
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: '100%',
    height: '40%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  content: {
    width: '100%',
    height: '60%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FBE8E6',
  },
  twoPeople: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: '32%',
    backgroundColor: '#FBE8E6',
  },
  people: {
    width: '40%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FBE8E6',
  },
  avatar: {
    width: 0.32 * screenWidth,
    height: 0.32 * screenWidth,
    borderRadius: 0.32 * screenWidth / 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#FBE8E6',
    width: '100%',
    textAlign: 'center',
    color: 'pink',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'pink',
  },
  day: {
    marginTop: '12%',
    fontWeight: 'bold',
    fontSize: 24,
    color: 'red',
  },
});
