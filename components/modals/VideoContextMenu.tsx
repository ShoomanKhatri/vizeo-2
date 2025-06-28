import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Video } from '../../types';
import { COLORS } from '../../utils/colors';
import { contextMenuStyles } from '../../styles/modals';

interface VideoContextMenuProps {
  isVisible: boolean;
  onClose: () => void;
  videoData: Video | null;
  onReport: (videoData: Video) => void;
  onRequestSimilar: (videoData: Video) => void;
}

export function VideoContextMenu({
  isVisible,
  onClose,
  videoData,
  onReport,
  onRequestSimilar,
}: VideoContextMenuProps) {
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      animatedOpacity.setValue(0);
    }
  }, [isVisible, animatedOpacity]);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(
      `Video ${videoData?.id} ${isBookmarked ? 'unbookmarked' : 'bookmarked'}`
    );
    setIsBookmarked(!isBookmarked);
    onClose();
  }, [isBookmarked, videoData, onClose]);

  const handleFollow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(
      `Creator ${videoData?.creator} ${isFollowing ? 'unfollowed' : 'followed'}`
    );
    setIsFollowing(!isFollowing);
    onClose();
  }, [isFollowing, videoData, onClose]);

  const handleRequestSimilar = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Request similar video to: ${videoData?.title}`);
    if (videoData) {
      onRequestSimilar(videoData);
    }
    onClose();
  }, [onRequestSimilar, videoData, onClose]);

  const handleReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Opening report modal for video: ${videoData?.title}`);
    if (videoData) {
      onReport(videoData);
    }
    onClose();
  }, [onReport, videoData, onClose]);

  if (!videoData) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
      accessibilityLabel="Video Context Menu"
    >
      <View style={contextMenuStyles.overlay}>
        <Pressable
          style={contextMenuStyles.overlayTouchArea}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
          }}
          accessibilityLabel="Close context menu"
        />

        <Animated.View
          style={[
            contextMenuStyles.menuContainer,
            { opacity: animatedOpacity },
          ]}
        >
          <TouchableOpacity
            onPress={handleBookmark}
            style={contextMenuStyles.menuItem}
            activeOpacity={0.7}
            accessibilityLabel={
              isBookmarked ? 'Remove bookmark from video' : 'Bookmark video'
            }
          >
            <MaterialIcons
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={20}
              color={COLORS.textLightGray}
              style={contextMenuStyles.menuItemIcon}
            />
            <Text style={contextMenuStyles.menuItemText}>
              {isBookmarked ? 'Remove Bookmark' : 'Bookmark Video'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFollow}
            style={contextMenuStyles.menuItem}
            activeOpacity={0.7}
            accessibilityLabel={
              isFollowing
                ? `Unfollow ${videoData.creator}`
                : `Follow ${videoData.creator}`
            }
          >
            <MaterialIcons
              name={isFollowing ? 'person' : 'person-add'}
              size={20}
              color={COLORS.textLightGray}
              style={contextMenuStyles.menuItemIcon}
            />
            <Text style={contextMenuStyles.menuItemText}>
              {isFollowing ? 'Unfollow Creator' : 'Follow Creator'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRequestSimilar}
            style={contextMenuStyles.menuItem}
            activeOpacity={0.7}
            accessibilityLabel="Request a similar video"
          >
            <MaterialIcons
              name="add-comment"
              size={20}
              color={COLORS.textLightGray}
              style={contextMenuStyles.menuItemIcon}
            />
            <Text style={contextMenuStyles.menuItemText}>
              Request Similar Video
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReport}
            style={[contextMenuStyles.menuItem, contextMenuStyles.menuItemLast]}
            activeOpacity={0.7}
            accessibilityLabel="Report this video"
          >
            <MaterialIcons
              name="flag"
              size={20}
              color={COLORS.secondaryAccent}
              style={contextMenuStyles.menuItemIcon}
            />
            <Text
              style={[
                contextMenuStyles.menuItemText,
                contextMenuStyles.reportText,
              ]}
            >
              Report
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
