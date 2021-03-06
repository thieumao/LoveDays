import React, { useState, useEffect } from 'react';
import { Platform, Dimensions, StyleSheet, TouchableOpacity, Image,
  Modal, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackScreenProps } from '../types';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

enum PERSON {
  ONE = 'ONE',
  TWO = 'TWO',
  NONE = 'NONE',
}

export default function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const [modalVisible, setModalVisible] = useState(false);
  const [personType, setPersonType] = useState<PERSON>(PERSON.NONE);
  const [name1, setName1] = useState('Name 1');
  const [name2, setName2] = useState('Name 2');
  const [text, setText] = useState('');
  const [day, setDay] = useState(0);

  const [date, setDate] = useState(new Date());
  const onChangeDate = (event, selectedDate) => {

    const given = moment(selectedDate, "YYYY-MM-DD");
    const current = moment().startOf('day');
    setDate(selectedDate);

    //Difference in number of days
    const number = moment.duration(current.diff(given)).asDays();
    setDay(Math.floor(number) + 2);
  };

  useEffect(() => {
    (async () => {
      try {
        // save
        const savedName1 = await AsyncStorage.getItem('name1') || '';
        setName1(savedName1);
        const savedName2 = await AsyncStorage.getItem('name2') || '';
        setName2(savedName2);
        const savedDate = await AsyncStorage.getItem('date') || '';
        setDate(JSON.parse(savedDate));
        const savedDay = Number(await AsyncStorage.getItem('day') || 0);
        setDay(savedDay);

        const savedImage1 = await AsyncStorage.getItem('image1') || '';
        setImage1(JSON.parse(savedImage1));

        const savedImage2 = await AsyncStorage.getItem('image2') || '';
        setImage2(JSON.parse(savedImage2));
      } catch (e) { 
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // save
        await AsyncStorage.setItem('name1', name1);
        await AsyncStorage.setItem('name2', name2);
        await AsyncStorage.setItem('date', JSON.stringify(date));
        await AsyncStorage.setItem('day', JSON.stringify(day));
        await AsyncStorage.setItem('image1', JSON.stringify(image1));
        await AsyncStorage.setItem('image2', JSON.stringify(image2));
      } catch (e) { 
      }
    })();
  }, [name1, name2, date, day]);

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
        {/* <TouchableOpacity onPress={() => setShow(true)}>
          <Text style={styles.title}>From 04/03/2018</Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.title}>From</Text> */}
        <DateTimePicker
          style={styles.date}
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.twoPeople}>
          <View style={styles.people}>
            <TouchableOpacity onPress={() => pickImage(PERSON.ONE)}>
              {!image1 && <Image style={styles.avatar} source={require("../assets/images/avatar.png")} />}
              {image1 && <Image style={styles.avatar} source={{ uri: image1 }} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setText(name1);
              setPersonType(PERSON.ONE); setModalVisible(true);
            }}>
              <Text style={styles.name}>{name1 || 'Name 1'}</Text>  
            </TouchableOpacity>
          </View>
          <View style={styles.people}>
            <TouchableOpacity onPress={() => pickImage(PERSON.TWO)}>
              {!image2 && <Image style={styles.avatar} source={require("../assets/images/avatar.png")} />}
              {image2 && <Image style={styles.avatar} source={{ uri: image2 }} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setText(name2);
              setPersonType(PERSON.TWO); setModalVisible(true); 
            }}>
              <Text style={styles.name}>{name2 || 'Name 2'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.day}>{day} days</Text>  
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(!modalVisible); }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Name:</Text>
            <TextInput value={text} onChangeText={value => setText(value)}
              style={styles.textInput} placeholder='Type here...' />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (personType === PERSON.ONE) {
                  setName1(text);
                } else if (personType === PERSON.TWO) {
                  setName2(text);
                }
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Set Name</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBE8E6',
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    width: 0.6 * screenWidth,
    marginBottom: 12,
    padding: 12,
  },

  date: {
    width: '34%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBE8E6',
    alignSelf: 'center',
  },
});
