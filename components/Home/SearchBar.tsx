import { TextInput } from "react-native-paper";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";
import { HomeStyles } from "@/styles/HomeScreen";
import { useTheme } from "react-native-paper";
import { RefObject } from "react";
import { TextInput as RNTextInput } from "react-native";

interface SearchBarProps {
  searchHeight: number;
  searchOpacity: number;
  searchInputRef: RefObject<RNTextInput>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
}

export function SearchBar({
  searchHeight,
  searchOpacity,
  searchInputRef,
  searchQuery,
  onSearchChange,
  onSearchClear,
}: SearchBarProps) {
  const theme = useTheme();

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: searchHeight,
      opacity: searchOpacity,
    };
  });

  return (
    <Animated.View
      style={[
        HomeStyles.searchContainer,
        { backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF" },
        animatedContainerStyle,
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
        onChangeText={onSearchChange}
        mode="flat"
        left={<TextInput.Icon icon="magnify" />}
        right={
          searchQuery ? (
            <TextInput.Icon
              icon="close"
              onPress={() => {
                onSearchClear();
              }}
            />
          ) : null
        }
      />
    </Animated.View>
  );
}
