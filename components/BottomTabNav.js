import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../screens/Search";
import Transaction from "../screens/Transaction";
import Autodata from "../screens/Autodata";
import Ionicons from "react-native-vector-icons/ionicons";

const Tab = createBottomTabNavigator();

class BottomTabNav extends React.Component {
    render() { 
        return (
            <NavigationContainer>
                <Tab.Navigator screenOptions={({ route }) => ({
                    tabBarIcon: ({
                        focused, color, size
                    }) => {
                        if (route.name == "Transaction") {
                            iconName = "book";
                        } else if (route.name == "Search") {
                            iconName = "search";
                        }
                        return (
                            <Ionicons
                                name={iconName} 
                                size={size}
                                color={color}
                            />
                        )
                    }
                })}
                    tabBarOptions={{
                        activeTintColor: "#ffffff",
                        inactiveTintColor: "black",
                        style: {
                            height: 130,
                            borderTopWidth: 0,
                            backgroundColor: "#5653d4",
                        },
                        labelStyle: {
                            fontSize: 20,
                        },
                        labelPosition: "beside-icon",
                }} >
                    <Tab.Screen name="Transaction" component={Transaction} />
                    <Tab.Screen name="Search" component={Search} />
                    <Tab.Screen name="Autodata" component={Autodata} />
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}
 
export default BottomTabNav;
