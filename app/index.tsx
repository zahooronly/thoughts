import { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  StatusBar,
  TextInput as RNTextInput,
} from "react-native";
import {
  FAB,
  Card,
  Text,
  useTheme,
  Surface,
  IconButton,
  TextInput,
} from "react-native-paper";
import { router } from "expo-router";
import Animated, {
  FadeInUp,
  Layout,
  FadeOut,
  SlideInRight,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
  withRepeat,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { loadNotes } from "@/utils/storage";
import { Note } from "@/utils/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteNote } from "@/utils/storage";
import { themeEmitter } from "./_layout";
import { COLORS } from "@/constants/Colors";
import { HomeStyles } from "@/styles/HomeScreen";

const AnimatedCard = Animated.createAnimatedComponent(Card);
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedFAB = Animated.createAnimatedComponent(FAB);
// Change this line - use React Native's TextInput instead of Paper's TextInput
// const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);
const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerScale = useSharedValue(1);
  const rotateAnimation = useSharedValue(0);
  const searchHeight = useSharedValue(0);
  const searchWidth = useSharedValue(56);
  const searchOpacity = useSharedValue(0);
  const searchInputRef = useRef<RNTextInput>(null);

  const loadAllNotes = useCallback(async () => {
    const savedNotes = await loadNotes();
    setNotes(savedNotes);
    setFilteredNotes(savedNotes);
  }, []);

  useEffect(() => {
    loadAllNotes();
  }, [loadAllNotes]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(headerScale.value) }],
  }));

  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(searchHeight.value, {
        damping: 15,
        stiffness: 150,
      }),
      opacity: withTiming(searchOpacity.value, { duration: 200 }),
    };
  });

  const searchInputStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(searchOpacity.value, { duration: 200 }),
      flex: searchOpacity.value > 0 ? 1 : 0,
    };
  });

  const clearButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(searchOpacity.value, { duration: 200 }),
      transform: [
        {
          scale: interpolate(
            searchOpacity.value,
            [0, 1],
            [0.5, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const handleSearchFocus = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      // Expand search
      searchHeight.value = withSpring(56, {
        damping: 15,
        stiffness: 150,
      });
      searchOpacity.value = 1;
      setTimeout(handleSearchFocus, 100);
    } else {
      // Collapse search
      searchOpacity.value = 0;
      setTimeout(() => {
        searchHeight.value = withSpring(0, {
          damping: 15,
          stiffness: 150,
        });
        setSearchQuery("");
      }, 100);
    }
    setIsSearchExpanded(!isSearchExpanded);
  };

  const renderItem = ({ item, index }: { item: Note; index: number }) => (
    <AnimatedCard
      style={[
        HomeStyles.noteCard,
        {
          backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF",
          borderLeftWidth: 3,
          borderLeftColor: COLORS.primary,
        },
      ]}
      onPress={() => {
        headerScale.value = withSequence(
          withTiming(0.97, { duration: 150 }),
          withSpring(1, { damping: 12 })
        );
        router.push(`/${item.id}`);
      }}
      // Modified entering animation configuration
      entering={FadeInUp.delay(index * 60)
        .springify()
        .withInitialValues({
          transform: [{ translateY: 20 }, { scale: 0.95 }],
          opacity: 0,
        })}
      exiting={FadeOut.duration(200)}
      layout={Layout.springify().damping(12)}
    >
      <Card.Content style={HomeStyles.cardContent}>
        <View style={HomeStyles.cardHeader}>
          <Text
            variant="titleMedium"
            style={[
              HomeStyles.noteText,
              { color: theme.dark ? COLORS.text.dark : COLORS.text.light },
            ]}
            numberOfLines={2}
          >
            {item.title || "Untitled Note"}
          </Text>
          <IconButton
            icon="delete-outline"
            size={20}
            iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
            onPress={async () => {
              await deleteNote(item.id);
              loadAllNotes();
            }}
          />
        </View>
        <Text
          variant="bodyMedium"
          numberOfLines={3}
          style={[
            HomeStyles.content,
            { color: theme.dark ? COLORS.text.dark : COLORS.text.light },
          ]}
        >
          {item.content}
        </Text>
        <Text
          variant="bodySmall"
          style={[
            HomeStyles.date,
            {
              color: theme.dark ? COLORS.text.dark : COLORS.text.light,
              opacity: 0.7,
            },
          ]}
        >
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </AnimatedCard>
  );

  const handleReload = useCallback(async () => {
    // Reset all animations
    // headerScale.value = 0;
    rotateAnimation.value = withSequence(
      withTiming(360, { duration: 1000 }),
      withTiming(0, { duration: 0 })
    );

    // Reset notes to trigger entrance animations
    setNotes([]);
    setFilteredNotes([]);

    // Restore header scale with spring animation
    // headerScale.value = withSpring(1);

    // Load notes after a small delay to ensure animations are visible
    setTimeout(async () => {
      const savedNotes = await loadNotes();
      setNotes(savedNotes);
      setFilteredNotes(savedNotes);
    }, 300);
  }, []);

  const reloadIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnimation.value}deg` }],
  }));

  return (
    <View
      style={[
        HomeStyles.container,
        {
          backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF",
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.dark ? COLORS.secondary : "#FFFFFF"}
      />

      <AnimatedSurface
        style={[HomeStyles.header, headerAnimatedStyle]}
        elevation={0}
      >
        <View style={HomeStyles.headerContent}>
          <Text
            variant="headlineMedium"
            style={[
              HomeStyles.title,
              { color: theme.dark ? COLORS.text.dark : COLORS.text.light },
            ]}
          >
            Thoughts
          </Text>
          <View style={HomeStyles.headerActions}>
            <Animated.View style={reloadIconStyle}>
              <IconButton
                icon="reload"
                size={24}
                onPress={handleReload}
                iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
              />
            </Animated.View>
            <IconButton
              icon="magnify"
              size={24}
              onPress={toggleSearch}
              iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
            />
            <IconButton
              icon={theme.dark ? "white-balance-sunny" : "moon-waning-crescent"}
              onPress={() => themeEmitter.emit("toggleTheme")}
              size={24}
              iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
            />
          </View>
        </View>
      </AnimatedSurface>

      <Animated.View
        style={[
          HomeStyles.searchContainer,
          { backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF" },
          searchContainerStyle,
        ]}
      >
        <TextInput
          ref={searchInputRef}
          style={[
            HomeStyles.searchInput,
            { color: theme.dark ? COLORS.text.dark : COLORS.text.light },
          ]}
          placeholder="Search notes..."
          placeholderTextColor={
            theme.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="flat"
          left={<TextInput.Icon icon="magnify" />}
          right={
            searchQuery ? (
              <TextInput.Icon
                icon="close"
                onPress={() => {
                  setSearchQuery("");
                  handleSearchFocus();
                }}
              />
            ) : null
          }
        />
      </Animated.View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={HomeStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={HomeStyles.separator} />}
      />

      <AnimatedFAB
        icon="plus"
        style={[HomeStyles.fab, { backgroundColor: COLORS.primary }]}
        onPress={() => router.push("/create")}
        animated={true}
        entering={SlideInRight.springify().damping(12)}
        customSize={56}
        mode="elevated"
        color={COLORS.secondary}
      />
    </View>
  );
}
