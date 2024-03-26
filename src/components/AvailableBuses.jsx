import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiUrl } from "../lib/url";
import { Appbar, Button } from 'react-native-paper';
import { Colors } from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";



const AvailableBuses = ({ navigation, route }) => {
  const { from, to, date } = route.params;
  const parsedDate= date.toISOString().split("T")[0]
  const [token, setToken] = useState(null);


  const[data,setData]=useState(null);
  const[user,setUser]=useState()
  useEffect(()=>{
    
    const getData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/search-bus?from=${from}&to=${to}&date=${parsedDate}`);
        const { bus } = res.data;
        setData(bus);
      } catch (error) {
        console.log("error is",error);
      }
    };
    const getMe = async () => {
      try {
        const res = await axios.get(`${apiUrl}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { userData } = res.data;
        setUser(userData);
      } catch (error) {
        console.log("error is",error);
      }
    };
    getMe();
    getData();
    checkAuthentication()
  },[from,to,parsedDate,data])
  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log({ token });
      if (token) {
        setToken(token);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };


  console.log("token is",token);
  // Dummy bus data

  const handleBook=async(id)=>{
   
   try {
    const res = await axios.post(`${apiUrl}/book`,{
      busId:id,
      userId:user.id
    });
    const { message } = res.data;
    Toast.show({
      type: "success",
      text1: message,
    });
    navigation.goBack()
   } catch (error) {
    console.log("lamo",error)
   }

  }
 

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView>
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {navigation.goBack()}} />
    <Appbar.Content title="Go Back" />
  </Appbar.Header>
      <Text style={styles.header}>Available Buses</Text>
      {data&&data.length>0?data.map((bus) => (
        <View key={bus.id} style={styles.card}>
          <Text style={styles.title}>Bus Name: {bus.name}</Text>
          <Text style={styles.info}>From: {bus.from}</Text>
          <Text style={styles.info}>To: {bus.to}</Text>
          <Text style={styles.info}>Date: {bus.date}</Text>
          <Button mode="outlined" style={{marginTop:5}} onPress={()=>handleBook(bus.id)}>Book Now</Button>
        </View>
      )):(
        <Text>No buses found</Text>
      )}
  </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f0f0f0",
  },
  header: {
    marginTop:10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.primary,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
});

export default AvailableBuses;
