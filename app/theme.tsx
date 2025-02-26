// app/theme.js
export const theme = {
  colors: {
    primary: "#121212", // Darker background like YouTube’s black
    secondary: "#1E1E1E", // Slightly lighter dark gray for containers
    accent: "#FFC107", // Vibrant yellow replacing YouTube’s red
    text: "#FFFFFF", // Bright white for primary text
    textSecondary: "#B0B0B0", // Light gray for secondary text
    placeholder: "#757575", // Mid-gray for placeholders
    inactiveTab: "#757575", // Muted gray for inactive tabs
    white: "#FFFFFF", // Pure white for inputs
    border: "#424242", // Dark gray for borders
    historyItem: "#282828", // Slightly lighter than secondary for history items
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24, // Slightly increased for a more spacious feel
  },
  typography: {
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    text: {
      fontSize: 16,
      color: "#FFFFFF",
    },
    tabText: {
      fontSize: 16,
      color: "#757575",
    },
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12, // For rounded corners like YouTube
  },
};
