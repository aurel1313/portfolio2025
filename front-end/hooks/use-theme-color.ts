/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/displayedTheme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function usedisplayedThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const displayedTheme = useColorScheme() ?? 'light';
  const colorFromProps = props[displayedTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[displayedTheme][colorName];
  }
}
