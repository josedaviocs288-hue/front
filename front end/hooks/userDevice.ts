import { useWindowDimensions } from "react-native";

export function useDevice() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isPortrait: height >= width,
    isLandscape: width > height,
  };
}
