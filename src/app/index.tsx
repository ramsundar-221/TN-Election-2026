import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>TAMIL NADU</Text>
            <Text style={styles.subtitle}>ELECTION 2026</Text>
          </View>

          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <Text style={styles.voteIcon}>✓</Text>
          </View>

          <Text style={styles.heading}>Cast Your Vote</Text>

          <Text style={styles.description}>
            Select your constituency, choose a candidate and add simulated
            votes to see the election results update.
          </Text>
        </View>

        {/* Election stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>234</Text>
            <Text style={styles.statLabel}>Constituencies</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>703</Text>
            <Text style={styles.statLabel}>Candidates</Text>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Select constituency
              </Text>

              <Text style={styles.stepDescription}>
                Choose one of the 234 Tamil Nadu constituencies.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Choose candidate
              </Text>

              <Text style={styles.stepDescription}>
                View candidates, parties and alliances.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                Add simulated votes
              </Text>

              <Text style={styles.stepDescription}>
                Add between 1 and 10,000 votes.
              </Text>
            </View>
          </View>
        </View>

        {/* Start button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/constituency')}
        >
          <Text style={styles.buttonText}>START VOTING</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>
            SIMULATION ONLY
          </Text>

          <Text style={styles.disclaimerText}>
            This application is an educational election simulation.
            It does not represent official election results.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            TN Election Live Simulation
          </Text>

          <Text style={styles.footerSubtext}>
            Powered by AWS
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  scrollContent: {
    paddingBottom: 25,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#111827',
  },

  subtitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#6B7280',
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    marginRight: 7,
  },

  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B91C1C',
    letterSpacing: 0.5,
  },

  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 35,
  },

  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  voteIcon: {
    fontSize: 38,
    fontWeight: '800',
    color: '#111827',
  },

  heading: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },

  description: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 23,
    color: '#6B7280',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 25,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },

  infoCard: {
    marginHorizontal: 24,
    marginTop: 22,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 17,
  },

  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  stepContent: {
    flex: 1,
    marginLeft: 12,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  stepDescription: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },

  button: {
    marginHorizontal: 24,
    marginTop: 22,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  arrow: {
    marginLeft: 12,
    fontSize: 22,
    color: '#FFFFFF',
  },

  disclaimer: {
    marginHorizontal: 24,
    marginTop: 18,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },

  disclaimerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C2410C',
    letterSpacing: 0.7,
  },

  disclaimerText: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: '#9A3412',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },

  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },

  footerSubtext: {
    marginTop: 3,
    fontSize: 10,
    color: '#9CA3AF',
  },
});