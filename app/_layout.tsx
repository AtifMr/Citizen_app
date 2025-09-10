// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="AuthHome">
      <Stack.Screen
        name="AuthHome"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        options={{ title: 'Login', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="Register"
        options={{ title: 'Register', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="AdminLogin"
        options={{ title: 'Admin Login', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="index"
        options={{ title: 'Citizen App', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="MyReports"
        options={{ title: 'My Reports', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
      <Stack.Screen
        name="TrackReports"
        options={{ title: 'Track Reports', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }}
      />
    </Stack>
  );
}
