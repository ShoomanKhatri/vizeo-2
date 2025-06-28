import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../utils/colors';

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ProfileModal({ isVisible, onClose }: ProfileModalProps) {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animatedOpacity]);

  const getIcon = useCallback((item: string) => {
    switch (item) {
      case "Subscriptions":
        return "credit-card";
      case "Guidelines":
        return "book-open";
      case "Switch to Creator":
        return "user-plus";
      case "Logout":
        return "log-out";
      default:
        return "circle";
    }
  }, []);

  const menuItems = [
    {
      name: "Subscriptions",
      action: () => console.log("Go to Subscriptions"),
    },
    { name: "Guidelines", action: () => console.log("Go to Guidelines") },
    {
      name: "Switch to Creator",
      action: () => console.log("Switch to Creator mode"),
    },
    { name: "Logout", action: () => console.log("User Logout") },
  ];

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      // Only runs on iOS/Android - web doesn't support haptics
      // Could implement web alternative here (e.g., visual feedback)
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Premium Options Menu"
    >
      <Pressable
        style={styles.overlay}
        onPress={() => {
          triggerHaptic();
          onClose();
        }}
        accessibilityLabel="Close premium menu"
      >
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: animatedOpacity },
          ]}
        >
          <BlurView
            intensity={70}
            tint="dark"
            style={styles.blurContainer}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem,
                ]}
                onPress={() => {
                  triggerHaptic();
                  item.action();
                  onClose();
                }}
                accessibilityLabel={`${item.name} option`}
              >
                <Feather
                  name={getIcon(item.name) as any}
                  size={20}
                  color={COLORS.textWhite}
                />
                <Text style={styles.menuItemText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    position: "absolute" as const,
    bottom: Platform.OS === "android" ? 80 + 15 : 20 + 15,
    left: 25,
    right: 25,
    borderRadius: 20,
    overflow: "hidden" as const,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  blurContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "rgba(20, 20, 20, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    color: COLORS.textWhite,
    fontSize: 16,
    marginLeft: 18,
    fontWeight: "400" as const,
    fontFamily: "System",
  },
};