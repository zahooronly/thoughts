import { View } from "react-native";
import { IconButton, Text, Surface } from "react-native-paper";
import Animated from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";
import { HomeStyles } from "@/styles/HomeScreen";
import { useTheme } from "react-native-paper";
import { themeEmitter } from "@/app/_layout";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface HeaderProps {
  headerAnimatedStyle: any;
  reloadIconStyle: any;
  onReload: () => void;
  onSearchToggle: () => void;
}

export function Header({
  headerAnimatedStyle,
  reloadIconStyle,
  onReload,
  onSearchToggle,
}: HeaderProps) {
  const theme = useTheme();

  return (
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
              onPress={onReload}
              iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
            />
          </Animated.View>
          <IconButton
            icon="magnify"
            size={24}
            onPress={onSearchToggle}
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
  );
}
