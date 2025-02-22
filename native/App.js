import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import EditProfile from './Screens/EditProfile';
import MyProfile from './Screens/MyProfile';
import SignInScreen from './Screens/SignInScreen';
import SuccessScreen from './Screens/SigninSuceessScreen';
import SignupScreen from './Screens/SignupScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignIn">
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
                <Stack.Screen name="SignupScreen" component={SignupScreen} />
                <Stack.Screen name="MyProfile" component={MyProfile} />
                <Stack.Screen name="EditProfile" component={EditProfile} />

                
            </Stack.Navigator>
        </NavigationContainer>
    );
}
