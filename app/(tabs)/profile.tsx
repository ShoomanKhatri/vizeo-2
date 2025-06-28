import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ProfileModal } from '../../components/modals/ProfileModal';
import { styles } from '../../styles';
import { COLORS } from '../../utils/colors';

export default function ProfileScreen() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      // Only runs on iOS/Android - web doesn't support haptics
      // Could implement web alternative here (e.g., visual feedback)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Profile & Settings
        </Text>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            setShowProfileModal(true);
          }}
          style={profileStyles.openMenuButton}
        >
          <Text style={profileStyles.openMenuButtonText}>
            Open Menu
          </Text>
        </TouchableOpacity>
      </View>

      <ProfileModal
        isVisible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </SafeAreaView>
  );
}

const profileStyles = {
  openMenuButton: {
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginTop: 20,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  openMenuButtonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
};