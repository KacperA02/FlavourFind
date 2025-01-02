import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import { useLocalSearchParams } from 'expo-router'; 
export default function TabLayout() {
  const { session, user } = useSession();
  const { section } = useLocalSearchParams();
  // redirects to login page if user isn't logged in
  if (!session) {
    return <LoginForm />;
  }
  const isAdmin = (user?.roles?.some(role => role.name === 'admin'))
  
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
{/* recipe tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
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
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
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
        name="(auth)/recipes/[id]/edit"
        options={{
          title:'Recipe Edit',
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
      {/* admin tabs */}
     {isAdmin && (
        <Tabs.Screen
          name="(admin)/index"  
          options={{
            title: 'Admin Panel',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="shield" color={color} />,
          }}
        />
      )}
       {isAdmin && (
        <Tabs.Screen
          name="(admin)/[section]"  
          options={{
            title:`Admin ${section} Page`,
            href:null
          }}
        />
      )}
       {isAdmin ? (
        <Tabs.Screen
          name="(admin)/ingredients/edit"
          options={{
            title: 'Ingredient Edit',
            href: null,
          }}
        />
      ) : (
        <Tabs.Screen
          name="(admin)/ingredients/edit"
          options={{
            title: 'Ingredient Edit',
            href: null,
          }}
        />
      )}
       {!isAdmin && (
        <Tabs.Screen
          name="(admin)/index"  
          options={{
            title:'Admin Panel',
            href:null
          }}
        />
      )}
       {!isAdmin && (
        <Tabs.Screen
          name="(admin)/[section]"  
          options={{
            title:'Admin Panel',
            href:null
          }}
        />
      )}
    </Tabs>
  );
}
