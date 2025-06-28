import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Video } from '../../types';
import { COLORS } from '../../utils/colors';

interface RequestSimilarVideoModalProps {
  isVisible: boolean;
  onClose: () => void;
  originalVideoData: Video | null;
}

export function RequestSimilarVideoModal({
  isVisible,
  onClose,
  originalVideoData,
}: RequestSimilarVideoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (originalVideoData) {
        setTitle(`Similar to: ${originalVideoData.title}`);
        setDescription(
          `I would like to request a video similar to "${originalVideoData.title}" by ${originalVideoData.creator}. `
        );
      }
    } else {
      animatedOpacity.setValue(0);
      setTitle('');
      setDescription('');
    }
  }, [isVisible, originalVideoData, animatedOpacity]);

  const handleSubmitRequest = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        'Missing Information',
        'Please provide both a title and description for your video request.'
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    console.log('Submitting similar video request:', {
      title: title.trim(),
      description: description.trim(),
      originalVideo: originalVideoData?.id,
    });

    Alert.alert(
      'Request Submitted',
      "Your video request has been submitted successfully! We'll notify you when a creator picks it up.",
      [{ text: 'OK', onPress: onClose }]
    );
  };

  if (!originalVideoData) return null;

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
              accessibilityLabel="Close request modal"
            >
              <MaterialIcons
                name="close"
                size={24}
                color={COLORS.textLightGray}
              />
            </Pressable>

            <Text style={styles.modalTitle}>Request Similar Video</Text>

            <Text style={styles.modalSubtitle}>
              Request a video similar to "{originalVideoData.title}"
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Video Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your video title..."
                placeholderTextColor={COLORS.textMediumGray}
                value={title}
                onChangeText={setTitle}
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                accessibilityLabel="Video title input"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe what you'd like to see in this video..."
                placeholderTextColor={COLORS.textMediumGray}
                value={description}
                onChangeText={setDescription}
                multiline
                keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
                accessibilityLabel="Video description input"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                accessibilityLabel="Cancel request"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!title.trim() || !description.trim()) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitRequest}
                disabled={!title.trim() || !description.trim()}
                accessibilityLabel="Submit video request"
              >
                <Text
                  style={[
                    styles.submitButtonText,
                    (!title.trim() || !description.trim()) &&
                      styles.submitButtonTextDisabled,
                  ]}
                >
                  Submit Request
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
  inputGroup: {
    marginBottom: 25,
    width: '100%',
  },
  inputLabel: {
    color: COLORS.textLightGray,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Segoe UI Semilight',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: COLORS.textWhite,
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    fontFamily: 'Segoe UI Semilight',
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
