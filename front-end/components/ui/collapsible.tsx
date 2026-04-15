import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { displayedThemedText } from '@/components/displayedThemed-text';
import { displayedThemedView } from '@/components/displayedThemed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/displayedTheme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const displayedTheme = useColorScheme() ?? 'light';

  return (
    <displayedThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={displayedTheme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <displayedThemedText type="defaultSemiBold">{title}</displayedThemedText>
      </TouchableOpacity>
      {isOpen && <displayedThemedView style={styles.content}>{children}</displayedThemedView>}
    </displayedThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
