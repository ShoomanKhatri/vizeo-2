import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Video } from '../types';
import { COLORS } from '../utils/colors';
import { toSentenceCase } from '../utils/helpers';
import { videoCardStyles } from '../styles/components';

interface VideoCardProps {
  item: Video;
  onCreatorPress: (creatorId: string) => void;
  onReport: (videoData: Video) => void;
  onRequestSimilar: (videoData: Video) => void;
  onRequesterPress: (requesterId: string) => void;
  onShowContextMenu: (videoData: Video) => void;
}

export function VideoCard({
  item,
  onCreatorPress,
  onRequesterPress,
  onShowContextMenu,
}: VideoCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Animation for the "Requested" badge pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (item.requested) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [item.requested, pulseAnim]);

  const onPressIn = useCallback(() => {
    Animated.spring(scale, { toValue: 1.01, useNativeDriver: true }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }, [scale]);

  const handleMorePress = useCallback(() => {
    onShowContextMenu(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [item, onShowContextMenu]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
    setImageError(true);
  }, []);

  return (
    <Animated.View style={[videoCardStyles.card, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityLabel={`View video details for ${toSentenceCase(item.title)}`}
      >
        <View style={videoCardStyles.thumbContainer}>
          {!imageLoaded && (
            <View style={videoCardStyles.thumbnailPlaceholder}>
              <ActivityIndicator size="large" color={COLORS.primaryAccent} />
            </View>
          )}
          {imageError ? (
            <Image
              source={{
                uri: `https://placehold.co/400x220/${COLORS.cardBackground.substring(1)}/${COLORS.primaryAccent.substring(1)}?text=Video+Error`,
              }}
              style={videoCardStyles.thumbnail}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <Image
              source={{ uri: item.thumbnail }}
              style={videoCardStyles.thumbnail}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={videoCardStyles.imageFog}
          />
          {item.requested && (
            <Animated.View
              style={[videoCardStyles.badge, { transform: [{ scale: pulseAnim }] }]}
            >
              <Feather
                name="edit-2"
                size={12}
                color={COLORS.cardBackground}
                style={videoCardStyles.badgeIcon}
              />
              <Text style={videoCardStyles.badgeText}>Requested</Text>
            </Animated.View>
          )}
          <View style={videoCardStyles.duration}>
            <Text style={videoCardStyles.durationText}>{item.duration}</Text>
          </View>
        </View>
      </Pressable>
      <View style={videoCardStyles.info}>
        <Text style={videoCardStyles.title}>{toSentenceCase(item.title)}</Text>
        <Text style={videoCardStyles.creator}>
          by{" "}
          <Text
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onCreatorPress(item.creator);
            }}
            style={videoCardStyles.creatorName}
            accessibilityLabel={`View profile of ${item.creator}`}
          >
            {item.creator}
          </Text>
        </Text>
        <View style={videoCardStyles.metaRow}>
          <Text style={videoCardStyles.metaText}>
            {item.time} · Requested by{" "}
            <Text
              onPress={() => {
                onRequesterPress(item.requestedBy);
              }}
              style={videoCardStyles.requesterNameLink}
              accessibilityLabel={`Requester: ${item.requestedBy}`}
            >
              {item.requestedBy}
            </Text>
          </Text>
          <Pressable
            onPress={handleMorePress}
            style={videoCardStyles.moreIconWrapper}
            accessibilityLabel="More options for this video"
          >
            <MaterialIcons
              name="more-vert"
              size={20}
              color={COLORS.textMediumGray}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}