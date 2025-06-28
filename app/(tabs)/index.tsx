import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Menu, X } from 'lucide-react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Video, Creator, Requester, FilterOptions } from '../../types';
import { VIDEOS, CREATORS, REQUESTERS } from '../../utils/mockData';
import { COLORS } from '../../utils/colors';
import { VideoCard } from '../../components/VideoCard';
import { VideoContextMenu } from '../../components/modals/VideoContextMenu';
import { RequestVideoModal } from '../../components/modals/RequestVideoModal';
import { ReportModal } from '../../components/modals/ReportModal';
import { RequestSimilarVideoModal } from '../../components/modals/RequestSimilarVideoModal';
import { styles } from '../../styles';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('recent');
  const [showMainSearchBar, setShowMainSearchBar] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuVideo, setContextMenuVideo] = useState<Video | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportVideo, setReportVideo] = useState<Video | null>(null);
  const [showRequestSimilarModal, setShowRequestSimilarModal] = useState(false);
  const [requestSimilarVideo, setRequestSimilarVideo] = useState<Video | null>(
    null
  );

  // Search bar animations
  const searchInputWidth = useRef(new Animated.Value(0)).current;
  const searchInputOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showMainSearchBar) {
      Animated.parallel([
        Animated.timing(searchInputWidth, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchInputOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(searchInputWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(searchInputOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setSearch(''));
    }
  }, [showMainSearchBar, searchInputWidth, searchInputOpacity]);

  const handleCreatorPress = useCallback((creatorId: string) => {
    Alert.alert('Creator Profile', `Opening profile for: ${creatorId}`);
    console.log('Creator pressed:', creatorId);
    // TODO: Navigate to creator profile
  }, []);

  const handleRequesterPress = useCallback((requesterId: string) => {
    Alert.alert('Requester Profile', `Opening profile for: ${requesterId}`);
    console.log('Requester pressed:', requesterId);
    // TODO: Navigate to requester profile
  }, []);

  const handleShowContextMenu = useCallback((videoData: Video) => {
    setContextMenuVideo(videoData);
    setShowContextMenu(true);
  }, []);

  const handleReportVideo = useCallback((videoData: Video) => {
    console.log('Opening report modal for video:', videoData.id);
    setReportVideo(videoData);
    setShowReportModal(true);
  }, []);

  const handleRequestSimilar = useCallback((videoData: Video) => {
    console.log('Opening request similar modal for video:', videoData.id);
    setRequestSimilarVideo(videoData);
    setShowRequestSimilarModal(true);
  }, []);

  const filteredVideos = useMemo(() => {
    let videosToFilter = [...VIDEOS];

    if (search) {
      videosToFilter = videosToFilter.filter(
        (video) =>
          video.title.toLowerCase().includes(search.toLowerCase()) ||
          video.creator.toLowerCase().includes(search.toLowerCase()) ||
          (video.requestedBy &&
            video.requestedBy.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (activeFilter === 'requested') {
      videosToFilter = videosToFilter.filter((video) => video.requested);
    } else if (activeFilter === 'popular') {
      videosToFilter.sort((a, b) => b.title.length - a.title.length);
    } else {
      videosToFilter.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
    }

    return videosToFilter;
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Menu', 'Main menu coming soon!');
          }}
          accessibilityLabel="Open main menu"
        >
          <Menu
            size={18}
            color={COLORS.textLightGray}
            strokeWidth={1.5}
            style={styles.iconSpacing}
          />
        </Pressable>

        {!showMainSearchBar ? (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowMainSearchBar(true);
            }}
            style={styles.searchIconContainer}
            accessibilityLabel="Activate search bar"
          >
            <MaterialIcons
              name="search"
              size={20}
              color={COLORS.textMediumGray}
            />
          </Pressable>
        ) : (
          <Animated.View
            style={[
              styles.searchBarExpanded,
              {
                width: searchInputWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '70%'],
                }),
                opacity: searchInputOpacity,
              },
            ]}
          >
            <TextInput
              style={styles.searchInputExpanded}
              placeholder="Search videos..."
              placeholderTextColor={COLORS.textMediumGray}
              value={search}
              onChangeText={setSearch}
              keyboardAppearance={Platform.OS === 'ios' ? 'dark' : 'default'}
              accessibilityLabel="Search videos"
              accessibilityHint="Search for videos by title, creator, or requester"
              autoFocus={true}
            />
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowMainSearchBar(false);
              }}
              style={styles.searchBarCloseIcon}
              accessibilityLabel="Close search bar"
            >
              <X size={18} color={COLORS.textMediumGray} />
            </Pressable>
          </Animated.View>
        )}

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Filters', 'Filter modal coming soon!');
          }}
          accessibilityLabel="Open filter and sort options"
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
          <Feather
            name="sliders"
            size={18}
            color={COLORS.primaryAccent}
            style={styles.filterButtonIcon}
          />
        </Pressable>
      </View>

      <View style={styles.filterBar}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveFilter('recent');
          }}
          style={[
            styles.filterOption,
            activeFilter === 'recent' && styles.filterOptionSelected,
          ]}
          accessibilityLabel="Show recent videos"
          accessibilityRole="radio"
          accessibilityState={{ checked: activeFilter === 'recent' }}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'recent' && styles.filterTextSelected,
            ]}
          >
            Recent
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveFilter('popular');
          }}
          style={[
            styles.filterOption,
            activeFilter === 'popular' && styles.filterOptionSelected,
          ]}
          accessibilityLabel="Show popular videos"
          accessibilityRole="radio"
          accessibilityState={{ checked: activeFilter === 'popular' }}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'popular' && styles.filterTextSelected,
            ]}
          >
            Popular
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveFilter('requested');
          }}
          style={[
            styles.filterOption,
            activeFilter === 'requested' && styles.filterOptionSelected,
          ]}
          accessibilityLabel="Show requested videos only"
          accessibilityRole="radio"
          accessibilityState={{ checked: activeFilter === 'requested' }}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'requested' && styles.filterTextSelected,
            ]}
          >
            Requested Only
          </Text>
        </Pressable>
      </View>

      {filteredVideos.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No videos found matching your criteria.
          </Text>
          <Text style={styles.emptyStateSubText}>
            Try adjusting your search or filters.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VideoCard
              item={item}
              onCreatorPress={handleCreatorPress}
              onReport={handleReportVideo}
              onRequestSimilar={handleRequestSimilar}
              onRequesterPress={handleRequesterPress}
              onShowContextMenu={handleShowContextMenu}
            />
          )}
          style={styles.flatListStyle}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}

      <VideoContextMenu
        isVisible={showContextMenu}
        onClose={() => setShowContextMenu(false)}
        videoData={contextMenuVideo}
        onReport={handleReportVideo}
        onRequestSimilar={handleRequestSimilar}
      />

      <RequestVideoModal
        isVisible={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />

      <ReportModal
        isVisible={showReportModal}
        onClose={() => setShowReportModal(false)}
        videoData={reportVideo}
      />

      <RequestSimilarVideoModal
        isVisible={showRequestSimilarModal}
        onClose={() => setShowRequestSimilarModal(false)}
        originalVideoData={requestSimilarVideo}
      />
    </SafeAreaView>
  );
}
