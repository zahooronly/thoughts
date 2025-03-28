import { View, StyleSheet, StatusBar } from "react-native";
import { Text, useTheme, IconButton } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { loadNotes, deleteNote } from "@/utils/storage";
import { Note } from "@/utils/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import HTMLView from "react-native-htmlview";
import { SCREEN_WIDTH } from "@/constants/Dimensions";
import { COLORS } from "@/constants/Colors";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadNotes().then((notes) => {
      const foundNote = notes.find((n) => n.id === id);
      setNote(foundNote || null);
    });
  }, [id]);

  const handleDelete = async () => {
    if (note) {
      await deleteNote(note.id);
      router.back();
    }
  };

  if (!note) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <IconButton icon="delete" size={24} onPress={handleDelete} />
      </View>

      <Animated.View style={styles.content} entering={FadeIn}>
        <Text variant="headlineMedium" style={styles.title}>
          {note.title || "Untitled Note"}
        </Text>
        <Text variant="bodySmall" style={styles.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </Text>
        {/* <Text variant="bodyLarge" style={styles.noteContent}>
          {note.content}
        </Text> */}
        <HTMLView
          value={note.content}
          stylesheet={{
            p: {
              color: theme.dark ? COLORS.text.dark : COLORS.text.light,
              fontSize: 16,
              lineHeight: 24,
            },
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
  date: {
    opacity: 0.6,
    marginBottom: 16,
  },
  noteContent: {
    lineHeight: 24,
  },
});
