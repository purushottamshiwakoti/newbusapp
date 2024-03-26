import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

import AvailableBuses from "./src/components/AvailableBuses";
import BusList from "./src/components/BusList";
import LoginScreen from "./src/screens/auth/LoginScreen";
import RegisterScreen from "./src/screens/auth/RegisterScreen";
import HomeScreen from "./src/screens/user/HomeScreen";
import ProfileScreen from "./src/screens/user/ProfileScreen";
import BookingScreen from "./src/screens/user/BookingScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, [isAuth]);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log({ token });
      if (token) {
        setIsAuth(true);
        setToken(token);
      } else {
        setIsAuth(false);
        setToken(null);
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const handleLogout = async () => {
    try {
      alert("hello");
      await AsyncStorage.removeItem("token");
      setIsAuth(false);
      setToken(null);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };
  console.log(isAuth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <>
            {token&&<Stack.Group>
            <Stack.Screen name="Home">
              {(props) => <TabNav {...props} token={token} />}
            </Stack.Screen>
            <Stack.Screen name="AvailableBuses" component={AvailableBuses} />
            <Stack.Screen name="BusList" component={BusList} />
            <Stack.Screen name="Bookings" >
            {(props) => <BookingScreen {...props} token={token} />}
            </Stack.Screen>
         
          
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
            </Stack.Group>}
            <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Group>
          </>
       
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const TabNav = ({ token }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
