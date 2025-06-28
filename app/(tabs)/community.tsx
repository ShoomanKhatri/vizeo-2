import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  ArrowDown,
  Lightbulb,
} from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { CommunityRequest } from '../../types';
import { COMMUNITY_REQUESTS } from '../../utils/mockData';
import { COLORS } from '../../utils/colors';
import { CommunityRequestCard } from '../../components/CommunityRequestCard';
import { CustomDropdown } from '../../components/common/CustomDropdown';
import { RequestVideoModal } from '../../components/modals/RequestVideoModal';
import { communityCardStyles } from '../../styles/components';

const { width, height } = Dimensions.get('window');

export default function CommunityScreen() {
  const [communitySearch, setCommunitySearch] = useState('');
  const [communityCategoryFilter, setCommunityCategoryFilter] = useState('All');
  const [communitySortBy, setCommunitySortBy] = useState('Newest');
  const [selectedCommunitySortChip, setSelectedCommunitySortChip] =
    useState('Newest');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  // Floating CTA animation
  const floatingCTAAnimatedValue = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let reappearInterval: NodeJS.Timeout;

    // Animate the FAB visibility
    Animated.timing(floatingCTAAnimatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Start FAB pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.03,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const showAndHideHint = () => {
      setShowHintText(true);
      Animated.timing(hintOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        hideTimer = setTimeout(() => {
          Animated.timing(hintOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setShowHintText(false));
        }, 10000);
      });
    };

    showAndHideHint();
    reappearInterval = setInterval(() => {
      showAndHideHint();
    }, 1800000);

    return () => {
      clearTimeout(hideTimer);
      clearInterval(reappearInterval);
    };
  }, [floatingCTAAnimatedValue, pulseAnimation, hintOpacity]);

  const handleBoost = useCallback((item: CommunityRequest) => {
    console.log('Boost request:', item.id);
    // TODO: Show boost modal
  }, []);

  const handleComment = useCallback((item: CommunityRequest) => {
    console.log('Comment on request:', item.id);
    // TODO: Show comment modal
  }, []);

  const filteredCommunityRequests = useMemo(() => {
    let requestsToFilter = [...COMMUNITY_REQUESTS];

    if (communitySearch) {
      requestsToFilter = requestsToFilter.filter(
        (request) =>
          request.title.toLowerCase().includes(communitySearch.toLowerCase()) ||
          request.description
            .toLowerCase()
            .includes(communitySearch.toLowerCase()) ||
          request.user.name
            .toLowerCase()
            .includes(communitySearch.toLowerCase()) ||
          request.tags.some((tag) =>
            tag.toLowerCase().includes(communitySearch.toLowerCase())
          )
      );
    }

    if (communityCategoryFilter !== 'All') {
      requestsToFilter = requestsToFilter.filter((request) =>
        request.tags.some((tag) =>
          tag.toLowerCase().includes(communityCategoryFilter.toLowerCase())
        )
      );
    }

    switch (selectedCommunitySortChip) {
      case 'Trending':
        requestsToFilter.sort(
          (a, b) => b.upvotes + b.boosts - (a.upvotes + a.boosts)
        );
        break;
      case 'Newest':
        requestsToFilter.sort((a, b) => {
          const timeA = parseInt(a.timestamp.match(/\d+/)?.[0] || '0');
          const timeB = parseInt(b.timestamp.match(/\d+/)?.[0] || '0');
          return timeA - timeB;
        });
        break;
      case 'Top Funded':
        requestsToFilter.sort((a, b) => b.boosts - a.boosts);
        break;
      case 'Urgent':
        requestsToFilter.sort((a, b) => a.comments - b.comments);
        break;
      default:
        break;
    }

    return requestsToFilter;
  }, [communitySearch, communityCategoryFilter, selectedCommunitySortChip]);

  const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;
  const communityCategories = [
    'All',
    'Technology',
    'Science',
    'Art',
    'Gaming',
    'Food',
    'History',
    'Finance',
    'Environment',
    'Sociology',
  ];
  const communitySortOptions = [
    'Newest',
    'Most Upvoted',
    'Most Tipped',
    'Most Commented',
  ];

  const floatingCTAStyle = {
    opacity: floatingCTAAnimatedValue,
  };

  return (
    <SafeAreaView style={communityCardStyles.container}>
      <StatusBar style="light" />

      <View style={communityCardStyles.stickyHeader}>
        <TextInput
          style={communityCardStyles.communitySearchInput}
          placeholder="Search requests by keywords, tags, or user..."
          placeholderTextColor={COLORS.textMediumGray}
          value={communitySearch}
          onChangeText={setCommunitySearch}
          keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
          accessibilityLabel="Search community requests"
          accessibilityHint="Search requests by keywords, tags, or user name"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={communityCardStyles.chipScrollViewContent}
        >
          {['Trending', 'Newest', 'Top Funded', 'Urgent'].map((chip) => (
            <TouchableOpacity
              key={chip}
              style={[
                communityCardStyles.filterChip,
                selectedCommunitySortChip === chip &&
                  communityCardStyles.filterChipSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCommunitySortChip(chip);
              }}
              accessibilityLabel={`Filter by ${chip}`}
              accessibilityRole="radio"
              accessibilityState={{
                checked: selectedCommunitySortChip === chip,
              }}
            >
              {chip === 'Trending' && (
                <TrendingUp
                  size={18}
                  color={
                    selectedCommunitySortChip === chip
                      ? COLORS.cardBackground
                      : COLORS.textLightGray
                  }
                  style={communityCardStyles.chipIcon}
                />
              )}
              {chip === 'Newest' && (
                <Clock
                  size={18}
                  color={
                    selectedCommunitySortChip === chip
                      ? COLORS.cardBackground
                      : COLORS.textLightGray
                  }
                  style={communityCardStyles.chipIcon}
                />
              )}
              {chip === 'Top Funded' && (
                <DollarSign
                  size={18}
                  color={
                    selectedCommunitySortChip === chip
                      ? COLORS.cardBackground
                      : COLORS.secondaryAccent
                  }
                  style={communityCardStyles.chipIcon}
                />
              )}
              {chip === 'Urgent' && (
                <Zap
                  size={18}
                  color={
                    selectedCommunitySortChip === chip
                      ? COLORS.cardBackground
                      : COLORS.textLightGray
                  }
                  style={communityCardStyles.chipIcon}
                />
              )}
              <Text
                style={[
                  communityCardStyles.filterChipText,
                  selectedCommunitySortChip === chip &&
                    communityCardStyles.filterChipTextSelected,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={communityCardStyles.dropdownWrapper}>
            <CustomDropdown
              label=""
              options={communityCategories}
              selectedValue={communityCategoryFilter}
              onSelect={setCommunityCategoryFilter}
              placeholder="Category"
              accessibilityLabel="Community category filter dropdown"
            />
          </View>
          <View style={communityCardStyles.dropdownWrapper}>
            <CustomDropdown
              label=""
              options={communitySortOptions}
              selectedValue={communitySortBy}
              onSelect={setCommunitySortBy}
              placeholder="Sort By"
              accessibilityLabel="Community sort by dropdown"
            />
          </View>
        </ScrollView>
      </View>

      {filteredCommunityRequests.length === 0 ? (
        <View style={communityCardStyles.emptyStateContainer}>
          <Text style={communityCardStyles.emptyStateText}>
            No requests found matching your criteria.
          </Text>
          <Text style={communityCardStyles.emptyStateSubText}>
            Be the first to make a request!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCommunityRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommunityRequestCard
              item={item}
              onBoost={handleBoost}
              onComment={handleComment}
            />
          )}
          numColumns={numColumns}
          contentContainerStyle={communityCardStyles.cardGridContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}

      <Animated.View
        style={[communityCardStyles.floatingCTA, floatingCTAStyle]}
      >
        {showHintText && (
          <Animated.View
            style={[
              communityCardStyles.hintContainer,
              { opacity: hintOpacity },
            ]}
          >
            <BlurView
              intensity={80}
              tint="dark"
              style={communityCardStyles.hintBlurBackground}
            >
              <Text style={communityCardStyles.hintText}>
                Any videos you'd like to see?
              </Text>
              <View style={communityCardStyles.hintArrowContainer}>
                <Text style={communityCardStyles.hintText}>
                  Request it now!
                </Text>
                <ArrowDown
                  size={24}
                  color={COLORS.primaryAccent}
                  style={communityCardStyles.hintArrow}
                />
              </View>
            </BlurView>
          </Animated.View>
        )}
        <TouchableOpacity
          style={[
            communityCardStyles.floatingCTAButton,
            {
              transform: [
                {
                  scale: pulseAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.03],
                  }),
                },
              ],
            },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            setShowRequestModal(true);
          }}
          accessibilityLabel="Make a new video request"
        >
          <Lightbulb size={26} color={COLORS.cardBackground} />
        </TouchableOpacity>
      </Animated.View>

      <RequestVideoModal
        isVisible={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </SafeAreaView>
  );
}
