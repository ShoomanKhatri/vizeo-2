import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../utils/colors';
import { dropdownStyles, modalStyles } from '../../styles/modals';
import { usePressableAnimation } from '../../hooks/usePressableAnimation';

interface CustomDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder: string;
  accessibilityLabel?: string;
}

export function CustomDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder,
  accessibilityLabel,
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const animatedRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedRotation, {
      toValue: modalVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  const arrowRotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={modalStyles.inputGroup}>
      <Text style={modalStyles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={dropdownStyles.dropdownButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(true);
        }}
        accessibilityLabel={accessibilityLabel || `Select ${label}`}
        accessibilityHint={`Current selection: ${selectedValue || "None"}`}
        accessibilityRole="button"
      >
        <Text
          style={[
            dropdownStyles.dropdownButtonText,
            !selectedValue && dropdownStyles.dropdownPlaceholderText,
          ]}
        >
          {selectedValue || placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <ChevronDown size={20} color={COLORS.textMediumGray} />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessibilityViewIsModal={true}
      >
        <Pressable
          style={dropdownStyles.dropdownOverlay}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(false);
          }}
          accessibilityLabel="Close dropdown menu"
        >
          <View
            style={dropdownStyles.dropdownModalView}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              style={dropdownStyles.dropdownScrollView}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option, index) => {
                const optionProps = usePressableAnimation(() => {
                  onSelect(option);
                  setModalVisible(false);
                });
                return (
                  <Animated.View
                    key={index}
                    style={[
                      dropdownStyles.dropdownOption,
                      optionProps.animatedStyle,
                      { borderRadius: 8 },
                      index === options.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <Pressable
                      onPressIn={optionProps.onPressIn}
                      onPressOut={optionProps.onPressOut}
                      onPress={optionProps.onPress}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                      }}
                      accessibilityLabel={`Select ${option}`}
                      accessibilityRole="menuitem"
                    >
                      <Text style={dropdownStyles.dropdownOptionText}>
                        {option}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}