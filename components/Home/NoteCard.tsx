import { Card, IconButton, Text } from "react-native-paper";
import { View } from "react-native";
import Animated, { FadeInUp, FadeOut, Layout } from "react-native-reanimated";
import { Note } from "@/utils/types";
import { useTheme } from "react-native-paper";
import { COLORS } from "@/constants/Colors";
import { HomeStyles } from "@/styles/HomeScreen";
import { router } from "expo-router";

const AnimatedCard = Animated.createAnimatedComponent(Card);

interface NoteCardProps {
  item: Note;
  index: number;
  onHeaderScale: () => void;
  onDelete: () => void;
}

export function NoteCard({ item, index, onHeaderScale, onDelete }: NoteCardProps) {
  const theme = useTheme();

  return (
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
        onHeaderScale();
        router.push(`/${item.id}`);
      }}
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
            onPress={onDelete}
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
}