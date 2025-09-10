// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          title: 'Citizen App',          // <-- custom header title
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          
        }}
      />
      <Stack.Screen
        name="MyReports"
        options={{
          title: 'My Reports',
          headerStyle: { backgroundColor: '#3498db' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
