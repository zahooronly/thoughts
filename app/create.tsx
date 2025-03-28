import { useCallback, useState, useRef, useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import { TextInput, Button, useTheme, IconButton } from "react-native-paper";
import { router } from "expo-router";
import { saveNote } from "@/utils/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { COLORS } from "@/constants/Colors";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function CreateNoteScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef(null);

  const handleSave = useCallback(async () => {
    if (content) {
      await saveNote({
        title: title.trim() || "Untitled Note",
        content: content,
      });
      router.back();
    }
  }, [title, content]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF",
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          iconColor={theme.dark ? COLORS.primary : COLORS.secondary}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!content.trim()}
          style={[styles.saveButton, { backgroundColor: COLORS.primary }]}
          contentStyle={styles.saveButtonContent}
          labelStyle={{
            color: COLORS.secondary,
            fontWeight: "600",
            letterSpacing: 0.5,
          }}
        >
          Save Note
        </Button>
      </View>

      <AnimatedView
        style={styles.content}
        entering={FadeIn.delay(150).duration(400)}
      >
        <TextInput
          style={[
            styles.titleInput,
            {
              color: theme.dark ? COLORS.text.dark : COLORS.text.light,
              borderBottomColor: theme.dark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
              borderBottomWidth: 1,
            },
          ]}
          mode="flat"
          placeholder="Note Title"
          placeholderTextColor={
            theme.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
          }
          value={title}
          onChangeText={setTitle}
          underlineStyle={{ display: "none" }}
        />

        <TextInput
          style={[styles.contentInput]}
          multiline={true}
          mode="flat"
          placeholder="Start writing..."
          placeholderTextColor={
            theme.dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
          }
          value={content}
          onChangeText={setContent}
          underlineStyle={{ display: "none" }}
        />
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    borderRadius: 20,
    marginRight: 8,
    elevation: 0,
  },
  saveButtonContent: {
    paddingHorizontal: 16,
    height: 40,
  },
  titleInput: {
    backgroundColor: "transparent",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  contentInput: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    paddingHorizontal: 4,
    minHeight: 200,
  },
  placeholder: {
    position: "absolute",
    top: 0,
    left: 4,
    right: 4,
    pointerEvents: "none",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 16,
  },
});
