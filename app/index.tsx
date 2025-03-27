import { View, FlatList, StatusBar } from "react-native";
import { FAB, TextInput } from "react-native-paper";
import { router } from "expo-router";
import Animated, {
  SlideInRight,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";
import { HomeStyles } from "@/styles/HomeScreen";
import { NoteCard } from "@/components/Home/NoteCard";
import { Header } from "@/components/Home/Header";
import { SearchBar } from "@/components/Home/SearchBar";
import { useNotes } from "@/hooks/useNotes";
import { useSearch } from "@/hooks/useSearch";
import { useHomeAnimations } from "@/hooks/useHomeAnimations";
import { Note } from "@/utils/types";
import { useCallback, useEffect } from "react";

const AnimatedFAB = Animated.createAnimatedComponent(FAB);

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const {
    notes,
    filteredNotes,
    setFilteredNotes,
    handleDeleteNote,
    handleReloadNotes,
  } = useNotes();

  const {
    searchQuery,
    setSearchQuery,
    searchInputRef,
    searchHeight,
    searchOpacity,
    handleSearchFocus,
    toggleSearch,
  } = useSearch();

  const {
    handleHeaderScale,
    handleRotateAnimation,
    headerAnimatedStyle,
    reloadIconStyle,
  } = useHomeAnimations();
  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      height: searchHeight.value,
      opacity: searchOpacity.value,
    };
  });
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
  }, [searchQuery, notes, setFilteredNotes]);

  const handleReload = useCallback(() => {
    handleRotateAnimation();
    handleReloadNotes();
  }, [handleRotateAnimation, handleReloadNotes]);

  const renderItem = ({ item, index }: { item: Note; index: number }) => (
    <NoteCard
      item={item}
      index={index}
      onHeaderScale={handleHeaderScale}
      onDelete={() => handleDeleteNote(item.id)}
    />
  );

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

      <Header
        headerAnimatedStyle={headerAnimatedStyle}
        reloadIconStyle={reloadIconStyle}
        onReload={handleReload}
        onSearchToggle={toggleSearch}
      />

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
