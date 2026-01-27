import React, { Component, ReactNode } from 'react';
// Import des vrais composants natifs (indispensable pour que ça marche sur mobile)
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform 
} from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
   
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.errorContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#8B0000" />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.errorTitle}>Oups ! Erreur Détectée</Text>
            
            <View style={styles.card}>
              <Text style={styles.label}>LE PROBLÈME :</Text>
              <Text style={styles.errorText}>
                {this.state.error && this.state.error.toString()}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>OÙ (Composants) :</Text>
              <Text style={styles.stackTrace}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={this.resetError}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Relancer l'application</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      );
    }

    // Si tout va bien, on affiche l'application normalement
    // Le style flex: 1 est important pour que le contenu prenne tout l'écran
    return <View style={{ flex: 1 }}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#8B0000',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContent: { padding: 20 },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  stackTrace: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
  },
  retryButton: {
    backgroundColor: '#FFEB3B',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  retryButtonText: {
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
