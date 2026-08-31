import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const API_URL =
  'https://83fu4h6opd.execute-api.ap-southeast-1.amazonaws.com/prod/votes';

export default function VoteScreen() {
  const params = useLocalSearchParams();

  const candidateId = String(
    params.candidate_id ?? ''
  );

  const constituencyId = String(
    params.constituency_id ?? ''
  );

  const candidateName = String(
    params.candidate_name ??
      `Candidate ${candidateId}`
  );

  const partyName = String(
    params.party_name ?? ''
  );

  const partyShortName = String(
    params.party_short_name ?? ''
  );

  const allianceName = String(
    params.alliance_name ?? ''
  );

  const [votes, setVotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const numericVotes = Number(votes);

  const isValid =
    Number.isInteger(numericVotes) &&
    numericVotes >= 1 &&
    numericVotes <= 10000;

  const submitVote = () => {
    if (!isValid) {
      Alert.alert(
        'Invalid vote count',
        'Please enter between 1 and 10,000 votes.'
      );
      return;
    }

    Alert.alert(
      'Confirm Vote',
      `Add ${numericVotes.toLocaleString()} simulated votes to ${candidateName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: sendVote,
        },
      ]
    );
  };

  const sendVote = async () => {
    try {
      setSubmitting(true);

      const votePayload = {
        candidate_id: Number(candidateId),
        constituency_id: Number(constituencyId),
        votes_to_add: numericVotes,
      };

      console.log(
        'Sending vote:',
        votePayload
      );

      const response = await fetch(API_URL, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(votePayload),
      });

      const data = await response.json();

      console.log(
        'API response:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Vote submission failed'
        );
      }

      Alert.alert(
        'Vote Submitted',
        `${numericVotes.toLocaleString()} votes were successfully queued for ${candidateName}.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error) {
      console.error(
        'Vote submission error:',
        error
      );

      Alert.alert(
        'Submission Failed',
        error instanceof Error
          ? error.message
          : 'Unable to submit vote. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.backArrow}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Add Votes
            </Text>

            <Text style={styles.subtitle}>
              Constituency {constituencyId}
            </Text>
          </View>
        </View>

        {/* MAIN CONTENT */}

        <View style={styles.content}>

          {/* CANDIDATE CARD */}

          <View style={styles.candidateCard}>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {candidateId}
              </Text>
            </View>

            <View style={styles.candidateInfo}>

              <Text style={styles.candidateLabel}>
                SELECTED CANDIDATE
              </Text>

              <Text style={styles.candidateName}>
                {candidateName}
              </Text>

              {partyName !== '' && (
                <Text style={styles.partyText}>
                  {partyName}
                  {partyShortName
                    ? ` (${partyShortName})`
                    : ''}
                </Text>
              )}

              {allianceName !== '' && (
                <Text style={styles.allianceText}>
                  {allianceName}
                </Text>
              )}

              <Text style={styles.candidateIdText}>
                Candidate ID: {candidateId}
              </Text>

            </View>
          </View>

          {/* VOTE INPUT */}

          <View style={styles.inputSection}>

            <Text style={styles.inputLabel}>
              VOTES TO ADD
            </Text>

            <TextInput
              value={votes}
              onChangeText={(value) => {
                const cleaned =
                  value.replace(
                    /[^0-9]/g,
                    ''
                  );

                setVotes(cleaned);
              }}
              placeholder="Enter number of votes"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={5}
              editable={!submitting}
              style={styles.input}
            />

            <View style={styles.limitRow}>

              <Text style={styles.limitText}>
                Minimum: 1
              </Text>

              <Text style={styles.limitText}>
                Maximum: 10,000
              </Text>

            </View>
          </View>

          {/* INVALID MESSAGE */}

          {votes.length > 0 &&
            !isValid && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  Enter a whole number between
                  1 and 10,000.
                </Text>
              </View>
            )}

          {/* VALID MESSAGE */}

          {isValid && (
            <View style={styles.validBox}>
              <Text style={styles.validText}>
                ✓{' '}
                {numericVotes.toLocaleString()}{' '}
                votes ready to submit
              </Text>
            </View>
          )}

          {/* INFORMATION */}

          <View style={styles.infoCard}>

            <Text style={styles.infoTitle}>
              Live simulation
            </Text>

            <Text style={styles.infoText}>
              Submitted votes are sent through
              the election backend and added to
              the candidate's live vote count.
            </Text>

          </View>

          {/* SUBMIT BUTTON */}

          <Pressable
            disabled={
              !isValid || submitting
            }
            style={({ pressed }) => [
              styles.submitButton,

              (!isValid || submitting) &&
                styles.submitButtonDisabled,

              pressed &&
                isValid &&
                !submitting &&
                styles.submitButtonPressed,
            ]}
            onPress={submitVote}
          >

            <Text style={styles.submitText}>
              {submitting
                ? 'SUBMITTING...'
                : 'CONFIRM VOTE'}
            </Text>

            {!submitting && (
              <Text style={styles.submitArrow}>
                →
              </Text>
            )}

          </Pressable>

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            TN Election Live Simulation
          </Text>

          <Text style={styles.footerSubtext}>
            Simulation only
          </Text>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 30,
    lineHeight: 32,
    color: '#111827',
  },

  headerText: {
    marginLeft: 13,
  },

  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },

  candidateInfo: {
    flex: 1,
    marginLeft: 14,
  },

  candidateLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#6B7280',
  },

  candidateName: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  partyText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  allianceText: {
    marginTop: 3,
    fontSize: 11,
    color: '#6B7280',
  },

  candidateIdText: {
    marginTop: 4,
    fontSize: 10,
    color: '#9CA3AF',
  },

  inputSection: {
    marginTop: 25,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: '#374151',
  },

  input: {
    height: 58,
    marginTop: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    fontSize: 18,
    color: '#111827',
  },

  limitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  limitText: {
    fontSize: 11,
    color: '#6B7280',
  },

  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    fontSize: 12,
    color: '#B91C1C',
  },

  validBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  validText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },

  infoCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  infoText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: '#111827',
  },

  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  submitButtonPressed: {
    opacity: 0.75,
  },

  submitText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#FFFFFF',
  },

  submitArrow: {
    marginLeft: 12,
    fontSize: 22,
    color: '#FFFFFF',
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 18,
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