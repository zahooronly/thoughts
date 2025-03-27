import { StyleSheet, Platform } from "react-native";
import { COLORS } from "@/constants/Colors";
import { SCREEN_WIDTH } from "@/constants/Dimensions";

export const HomeStyles = StyleSheet.create({
    cardContent: {
        padding: 16,
        paddingTop: 24,
        paddingBottom: 16,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    header: {
        paddingVertical: 16,
        marginBottom: 8,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    noteCard: {
        borderRadius: 16,
        elevation: 3,
        width: SCREEN_WIDTH - 32,
        overflow: "hidden",
        marginBottom: 16,
        ...(Platform.OS === 'web'
            ? {
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.15)'
            }
            : {
                shadowColor: COLORS.primary,
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            }
        ),
    },
    title: {
        paddingHorizontal: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    noteText: {
        flex: 1,
        marginRight: 8,
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    content: {
        marginBottom: 12,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    date: {
        opacity: 0.6,
    },
    separator: {
        height: 12,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 16,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    // New styles for search component
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 28,
        height: 56,
        paddingHorizontal: 8,
        ...(Platform.OS === 'web'
            ? {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
            }
            : {
                shadowColor: COLORS.primary,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 2,
            }
        ),
    },
    searchInput: {
        // flex: 1,
        backgroundColor: "transparent",
        // height: 56,
        fontSize: 16,
    },

});