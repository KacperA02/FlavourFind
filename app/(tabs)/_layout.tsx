import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
     <Tabs.Screen
        name="(auth)/recipes/index"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,

        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="(auth)/recipes/[id]/index"
        options={{
          title:'Recipe Details',
          href:null
        }}
      />
      <Tabs.Screen
        name="(auth)/recipes/create"
        options={{
          title:'Recipe Create',
          href:null
        }}
      />
    </Tabs>
  );
}
