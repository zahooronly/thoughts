import { useState, useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  
  const searchHeight = useSharedValue(0);
  const searchOpacity = useSharedValue(0);

  const handleSearchFocus = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const toggleSearch = () => {
    if (!isSearchExpanded) {
      searchHeight.value = withSpring(56, {
        damping: 15,
        stiffness: 150,
      });
      searchOpacity.value = 1;
      setTimeout(handleSearchFocus, 100);
    } else {
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

  return {
    searchQuery,
    setSearchQuery,
    searchInputRef,
    searchHeight,
    searchOpacity,
    handleSearchFocus,
    toggleSearch,
  };
}