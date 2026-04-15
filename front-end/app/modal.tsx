import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { displayedThemedText } from '@/components/displayedThemed-text';
import { displayedThemedView } from '@/components/displayedThemed-view';

export default function ModalScreen() {
  return (
    <displayedThemedView style={styles.container}>
      <displayedThemedText type="title">This is a modal</displayedThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <displayedThemedText type="link">Go to home screen</displayedThemedText>
      </Link>
    </displayedThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
