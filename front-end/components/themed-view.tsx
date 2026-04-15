import { View, type ViewProps } from 'react-native';

import { usedisplayedThemeColor } from '@/hooks/use-displayedTheme-color';

export type displayedThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function displayedThemedView({ style, lightColor, darkColor, ...otherProps }: displayedThemedViewProps) {
  const backgroundColor = usedisplayedThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
