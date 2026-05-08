import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, HelpCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export const AccountScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      icon: User,
      title: 'Profile',
      subtitle: 'Manage your profile settings',
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and notifications',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426908/avatar_otp3lc.png',
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>Guest User</Text>
        <Text style={styles.userEmail}>guest@movies.com</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIcon}>
                <item.icon color="#e50914" size={24} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut color="#ffffff" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dyx9u0bif/image/upload/v1657426908/Group_7399_rjlnzp.png',
            }}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>Movies App v1.0.0</Text>
          <View style={styles.socialLinks}>
            <Text style={styles.socialText}>Follow us on social media</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#e50914',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    color: '#888',
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerLogo: {
    width: 120,
    height: 40,
    marginBottom: 12,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
  },
  socialLinks: {
    alignItems: 'center',
  },
  socialText: {
    color: '#888',
    fontSize: 12,
  },
});
