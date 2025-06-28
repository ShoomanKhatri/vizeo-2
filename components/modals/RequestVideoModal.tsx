import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../utils/colors';
import { toSentenceCase } from '../../utils/helpers';
import { modalStyles } from '../../styles/modals';

interface RequestVideoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function RequestVideoModal({ isVisible, onClose }: RequestVideoModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (!title.trim() || !description.trim()) {
      alert("Please fill in both video title and description.");
      return;
    }
    console.log("New Video Request Submitted:", { title, description });
    alert(`Your request for "${toSentenceCase(title)}" has been submitted!`);
    setTitle("");
    setDescription("");
    onClose();
  }, [title, description, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Request a Video Modal"
    >
      <View style={modalStyles.centeredView}>
        <BlurView
          intensity={80}
          tint="dark"
          style={modalStyles.modalBlur}
        >
          <ScrollView
            contentContainerStyle={modalStyles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={modalStyles.closeButton}
              accessibilityLabel="Close request modal"
            >
              <X size={20} color={COLORS.textLightGray} />
            </TouchableOpacity>

            <Text style={modalStyles.modalTitle}>Request A Video</Text>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>
                Title <Text style={modalStyles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[
                  modalStyles.textInput,
                  modalStyles.goldBorder,
                ]}
                placeholder="A concise title for your video idea"
                placeholderTextColor={COLORS.textMediumGray}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Video Title input"
                accessibilityHint="Enter a concise title for your video request"
              />
            </View>

            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>
                Description{" "}
                <Text style={modalStyles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={[
                  modalStyles.textInput,
                  modalStyles.multilineInput,
                  modalStyles.goldBorder,
                ]}
                placeholder="Explain the context, purpose, or outcome you imagine..."
                placeholderTextColor={COLORS.textMediumGray}
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                keyboardAppearance={Platform.OS === "ios" ? "dark" : "default"}
                accessibilityLabel="Video Description input"
                accessibilityHint="Provide detailed context for your video request"
              />
            </View>

            <TouchableOpacity
              style={modalStyles.submitButton}
              onPress={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              accessibilityLabel="Submit video request"
              accessibilityHint="Submits your video request after reviewing details"
            >
              <Text style={modalStyles.submitButtonText}>
                Submit Request
              </Text>
              <MaterialIcons
                name="send"
                size={20}
                color={COLORS.cardBackground}
                style={modalStyles.submitButtonIcon}
              />
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
}