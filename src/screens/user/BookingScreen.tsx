import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Button, Card, Title, Paragraph } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { apiUrl } from "../../lib/url";
import { Colors } from "../../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BookingScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState(null);
  const[token,setToken]=useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${apiUrl}/book`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.Bus);
        console.log(res.data)
        const { bokings } = res.data;
        setBookings(bokings);
      } catch (error) {
        console.log("Error fetching bookings:", error);
      }
    };
    checkAuthentication()

    if (token) {
      fetchBookings();
    }
  },[token]);
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

  console.log(token )

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Bookings" />
      </Appbar.Header>
      <ScrollView>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Title>Bus Name:{booking.Bus.name}</Title>
                <Paragraph>
                  From: {booking.Bus.from} - To: {booking.Bus.to}
                </Paragraph>
                <Paragraph>Date: {booking.Bus.date.split("T")[0]}</Paragraph>
              </Card.Content>
             
            </Card>
          ))
        ) : (
          <Text>No bookings yet</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default BookingScreen;
