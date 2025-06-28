import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Video } from '../../types';
import { COLORS } from '../../utils/colors';

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  videoData: Video | null;
}

const REPORT_REASONS = [
  { id: 'spam', label: 'Spam or misleading content', icon: 'report' },
  { id: 'harassment', label: 'Harassment or bullying', icon: 'person-remove' },
  { id: 'hate', label: 'Hate speech', icon: 'block' },
  { id: 'violence', label: 'Violence or graphic content', icon: 'warning' },
  {
    id: 'inappropriate',
    label: 'Inappropriate content',
    icon: 'remove-circle',
  },
  { id: 'copyright', label: 'Copyright infringement', icon: 'copyright' },
  { id: 'misinformation', label: 'False information', icon: 'info' },
  { id: 'other', label: 'Other', icon: 'more-horiz' },
];

export function ReportModal({
  isVisible,
  onClose,
  videoData,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      animatedOpacity.setValue(0);
      setSelectedReason(null);
    }
  }, [isVisible, animatedOpacity]);

  const handleSubmitReport = () => {
    if (!selectedReason) {
      Alert.alert(
        'Please select a reason',
        'You must select a reason for reporting this video.'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    console.log(
      `Reporting video ${videoData?.id} for reason: ${selectedReason}`
    );

    Alert.alert(
      'Report Submitted',
      'Thank you for your report. We will review this content and take appropriate action if necessary.',
      [{ text: 'OK', onPress: onClose }]
    );
  };

  if (!videoData) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <Animated.View
        style={[styles.centeredView, { opacity: animatedOpacity }]}
      >
        <BlurView intensity={80} tint="dark" style={styles.modalBlur}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              accessibilityLabel="Close report modal"
            >
              <MaterialIcons
                name="close"
                size={24}
                color={COLORS.textLightGray}
              />
            </Pressable>

            <Text style={styles.modalTitle}>Report Video</Text>

            <Text style={styles.modalSubtitle}>
              Why are you reporting "{videoData.title}"?
            </Text>

            <ScrollView
              style={styles.reasonsList}
              showsVerticalScrollIndicator={false}
            >
              {REPORT_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason.id}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason.id && styles.reasonItemSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedReason(reason.id);
                  }}
                  accessibilityLabel={`Report for ${reason.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selectedReason === reason.id }}
                >
                  <MaterialIcons
                    name={reason.icon as any}
                    size={20}
                    color={
                      selectedReason === reason.id
                        ? COLORS.primaryAccent
                        : COLORS.textLightGray
                    }
                    style={styles.reasonIcon}
                  />
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason.id && styles.reasonTextSelected,
                    ]}
                  >
                    {reason.label}
                  </Text>
                  {selectedReason === reason.id && (
                    <MaterialIcons
                      name="check"
                      size={20}
                      color={COLORS.primaryAccent}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                accessibilityLabel="Cancel report"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !selectedReason && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitReport}
                disabled={!selectedReason}
                accessibilityLabel="Submit report"
              >
                <Text
                  style={[
                    styles.submitButtonText,
                    !selectedReason && styles.submitButtonTextDisabled,
                  ]}
                >
                  Submit Report
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    width: '90%',
    maxWidth: 480,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 15,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 8,
    zIndex: 1,
  },
  modalTitle: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'Segoe UI Semilight',
  },
  modalSubtitle: {
    color: COLORS.textLightGray,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Segoe UI Semilight',
    lineHeight: 22,
  },
  reasonsList: {
    width: '100%',
    maxHeight: 300,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  reasonItemSelected: {
    backgroundColor: 'rgba(196, 167, 125, 0.1)',
    borderColor: COLORS.primaryAccent,
  },
  reasonIcon: {
    marginRight: 15,
    width: 20,
  },
  reasonText: {
    color: COLORS.textLightGray,
    fontSize: 16,
    fontFamily: 'Segoe UI Semilight',
    flex: 1,
  },
  reasonTextSelected: {
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
  },
  cancelButtonText: {
    color: COLORS.textLightGray,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Segoe UI Semilight',
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.primaryAccent,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textMediumGray,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: COLORS.cardBackground,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Segoe UI Semilight',
  },
  submitButtonTextDisabled: {
    color: COLORS.textLightGray,
  },
});
