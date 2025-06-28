import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { ArrowUp, MessageCircle, DollarSign, Heart, Bookmark, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { CommunityRequest } from '../types';
import { COLORS } from '../utils/colors';
import { toSentenceCase } from '../utils/helpers';
import { communityCardStyles } from '../styles/components';

interface CommunityRequestCardProps {
  item: CommunityRequest;
  onBoost: (item: CommunityRequest) => void;
  onComment: (item: CommunityRequest) => void;
}

export function CommunityRequestCard({ item, onBoost, onComment }: CommunityRequestCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [upvotesCount, setUpvotesCount] = useState(item.upvotes);
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
  const [isTipped, setIsTipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const onPressIn = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 1.01, useNativeDriver: true }).start();
  }, [scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  }, [scale]);

  const upvoteScale = useRef(new Animated.Value(1)).current;
  const handleUpvote = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(upvoteScale, {
        toValue: 1.1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }),
      Animated.spring(upvoteScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }),
    ]).start();
    setUpvotesCount((prev) => prev + 1);
  }, [upvoteScale]);

  const handleComment = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComment(item);
  }, [item, onComment]);

  const handleTip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTipped((prev) => !prev);
  }, []);

  const handleBookmark = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsBookmarked(!isBookmarked);
  }, [isBookmarked]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoaded(true);
    setImageError(true);
  }, []);

  const truncatedDescription = item.description.length > 100
    ? item.description.substring(0, 97) + "..."
    : item.description;

  return (
    <Animated.View style={[communityCardStyles.card, { transform: [{ scale }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        accessibilityLabel={`View community request: ${toSentenceCase(item.title)}`}
      >
        <View style={communityCardStyles.cardHeader}>
          <Image
            source={{ uri: item.user.avatar }}
            style={communityCardStyles.userAvatar}
            accessibilityLabel={`${item.user.name}'s avatar`}
          />
          <View style={communityCardStyles.userInfo}>
            <Text style={communityCardStyles.username}>{item.user.name}</Text>
            <Text style={communityCardStyles.timestamp}>{item.timestamp}</Text>
          </View>
          {item.tags && item.tags.length > 0 && (
            <View style={communityCardStyles.tagBadge}>
              <Text style={communityCardStyles.tagText}>{item.tags[0]}</Text>
            </View>
          )}
        </View>

        <View style={communityCardStyles.cardBody}>
          <Text style={communityCardStyles.cardTitle}>
            {toSentenceCase(item.title)}
          </Text>
          <Text style={communityCardStyles.cardDescription}>
            {truncatedDescription}
          </Text>
          {item.attachments &&
            item.attachments.length > 0 &&
            item.attachments[0].type === "image" && (
              <>
                {!imageLoaded && (
                  <View style={communityCardStyles.attachedImagePlaceholder}>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primaryAccent}
                    />
                  </View>
                )}
                {imageError ? (
                  <Image
                    source={{
                      uri: `https://placehold.co/200x120/${COLORS.cardBackground.substring(1)}/${COLORS.primaryAccent.substring(1)}?text=Image+Error`,
                    }}
                    style={communityCardStyles.attachedImage}
                    resizeMode="cover"
                    onError={handleImageError}
                  />
                ) : (
                  <Image
                    source={{ uri: item.attachments[0].uri }}
                    style={communityCardStyles.attachedImage}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
              </>
            )}
          {item.visibility === "Sponsored Opportunity" && (
            <View style={communityCardStyles.sponsoredBadge}>
              <Award size={14} color={COLORS.cardBackground} />
              <Text style={communityCardStyles.sponsoredText}>
                Sponsored Opportunity
              </Text>
            </View>
          )}
        </View>

        <View style={communityCardStyles.interactionRow}>
          <TouchableOpacity
            onPress={handleUpvote}
            style={communityCardStyles.interactionButton}
            accessibilityLabel={`Upvote this request, currently ${upvotesCount} upvotes`}
          >
            <Animated.View style={{ transform: [{ scale: upvoteScale }] }}>
              <ArrowUp size={18} color={COLORS.primaryAccent} />
            </Animated.View>
            <Text style={communityCardStyles.interactionCount}>{upvotesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleComment}
            style={communityCardStyles.interactionButton}
            accessibilityLabel={`View comments, currently ${item.comments} comments`}
          >
            <MessageCircle size={18} color={COLORS.textLightGray} />
            <Text style={communityCardStyles.interactionCount}>
              {item.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onBoost(item);
            }}
            style={communityCardStyles.interactionButton}
            accessibilityLabel={`Boost this request, currently ${item.boosts} boosts`}
          >
            <DollarSign size={18} color={COLORS.secondaryAccent} />
            <Text style={communityCardStyles.interactionCount}>{item.boosts}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleTip}
            style={communityCardStyles.interactionButton}
            accessibilityLabel={
              isTipped
                ? `Untip this request`
                : `Tip this request, currently ${item.tips} tips`
            }
          >
            <Heart
              size={18}
              color={isTipped ? "#FF6347" : COLORS.textLightGray}
              fill={isTipped ? "#FF6347" : "none"}
            />
            <Text style={communityCardStyles.interactionCount}>{item.tips}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBookmark}
            style={communityCardStyles.interactionButton}
            accessibilityLabel={
              isBookmarked ? "Remove bookmark" : "Bookmark this request"
            }
          >
            <Bookmark
              size={18}
              color={isBookmarked ? COLORS.primaryAccent : COLORS.textLightGray}
              fill={isBookmarked ? COLORS.primaryAccent : "none"}
            />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Animated.View>
  );
}