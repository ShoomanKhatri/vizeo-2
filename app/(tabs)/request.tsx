import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RequestVideoModal } from '../../components/modals/RequestVideoModal';
import { styles } from '../../styles';

export default function RequestScreen() {
  const [showRequestModal, setShowRequestModal] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          Request a Video
        </Text>
        <Text style={styles.emptyStateSubText}>
          Share your ideas with the community
        </Text>
      </View>

      <RequestVideoModal
        isVisible={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </SafeAreaView>
  );
}