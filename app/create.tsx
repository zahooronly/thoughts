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

const QUILL_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
  <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
  <style>
    body { 
      margin: 0; 
      padding: 8px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #editor {
      height: calc(100vh - 72px);
      font-size: 16px;
      border: none;
    }
    .ql-toolbar {
      position: sticky;
      top: 0;
      z-index: 1;
      background: inherit;
      border: none !important;
      border-bottom: 1px solid rgba(128,128,128,0.2) !important;
      padding: 8px 0;
    }
    .ql-container {
      border: none !important;
    }
    .ql-editor {
      padding: 12px 0;
    }
    
    /* Dark mode styles */
    body.dark {
      background-color: #1a1a1a;
      color: #ffffff;
    }
    body.dark .ql-toolbar .ql-stroke {
      stroke: #ffffff;
    }
    body.dark .ql-toolbar .ql-fill {
      fill: #ffffff;
    }
    body.dark .ql-toolbar .ql-picker {
      color: #ffffff;
    }
    body.dark .ql-toolbar .ql-picker-options {
      background-color: #1a1a1a;
    }
    body.dark .ql-snow.ql-toolbar button:hover,
    body.dark .ql-snow .ql-toolbar button:hover,
    body.dark .ql-snow.ql-toolbar button:focus,
    body.dark .ql-snow .ql-toolbar button:focus,
    body.dark .ql-snow.ql-toolbar button.ql-active,
    body.dark .ql-snow .ql-toolbar button.ql-active,
    body.dark .ql-snow.ql-toolbar .ql-picker-label:hover,
    body.dark .ql-snow .ql-toolbar .ql-picker-label:hover,
    body.dark .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    body.dark .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    body.dark .ql-snow.ql-toolbar .ql-picker-item:hover,
    body.dark .ql-snow .ql-toolbar .ql-picker-item:hover,
    body.dark .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    body.dark .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
      color: #69b4f1;
    }
    body.dark .ql-snow.ql-toolbar button:hover .ql-stroke,
    body.dark .ql-snow .ql-toolbar button:hover .ql-stroke,
    body.dark .ql-snow.ql-toolbar button:focus .ql-stroke,
    body.dark .ql-snow .ql-toolbar button:focus .ql-stroke,
    body.dark .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    body.dark .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    body.dark .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    body.dark .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    body.dark .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    body.dark .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
      stroke: #69b4f1;
    }
    body.dark .ql-snow.ql-toolbar button:hover .ql-fill,
    body.dark .ql-snow .ql-toolbar button:hover .ql-fill,
    body.dark .ql-snow.ql-toolbar button:focus .ql-fill,
    body.dark .ql-snow .ql-toolbar button:focus .ql-fill,
    body.dark .ql-snow.ql-toolbar button.ql-active .ql-fill,
    body.dark .ql-snow .ql-toolbar button.ql-active .ql-fill,
    body.dark .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
    body.dark .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
    body.dark .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    body.dark .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill {
      fill: #69b4f1;
    }
  </style>
</head>
<body>
  <div id="editor"></div>
  <script>
    var quill = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Write your thoughts here...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      }
    });
    
    quill.on('text-change', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'content',
        content: quill.root.innerHTML
      }));
    });

    window.addEventListener('message', function(event) {
      const data = JSON.parse(event.data);
      if (data.type === 'setContent') {
        quill.root.innerHTML = data.content;
      } else if (data.type === 'setTheme') {
        document.body.style.backgroundColor = data.backgroundColor;
        document.body.style.color = data.textColor;
        if (data.isDark) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }
    });
  </script>
</body>
</html>
`;

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

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "content") {
        setContent(data.content);
      }
    } catch (error) {
      console.error("Failed to parse WebView message:", error);
    }
  };

  // Update editor theme when app theme changes
  useEffect(() => {
    if (webViewRef.current) {
      (webViewRef.current as WebView).postMessage(
        JSON.stringify({
          type: "setTheme",
          backgroundColor: theme.dark ? COLORS.secondary : "#FFFFFF",
          textColor: theme.dark ? COLORS.text.dark : COLORS.text.light,
          isDark: theme.dark,
        })
      );
    }
  }, [theme.dark]);

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

        <WebView
          ref={webViewRef}
          source={{ html: QUILL_HTML }}
          style={styles.webview}
          onMessage={handleMessage}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
