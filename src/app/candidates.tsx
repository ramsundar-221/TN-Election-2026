import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const API_BASE_URL =
  'https://83fu4h6opd.execute-api.ap-southeast-1.amazonaws.com/prod';

type Candidate = {
  candidate_id: number;
  candidate_name: string;
  party_id: number;
  party_name: string;
  party_short_name: string;
  alliance_id: number | null;
  alliance_name: string | null;
};

export default function CandidatesScreen() {
  const params = useLocalSearchParams();

  const constituencyId = String(
    params.constituency_id ?? ''
  );

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCandidates();
  }, [constituencyId]);

  const loadCandidates = async () => {
    if (!constituencyId) {
      setError('Constituency ID is missing.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const url =
        `${API_BASE_URL}/results/constituency/` +
        `${constituencyId}/candidates`;

      console.log(
        'Loading candidates:',
        url
      );

      const response = await fetch(url);

      const data = await response.json();

      console.log(
        'Candidates API response:',
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to retrieve candidates.'
        );
      }

      setCandidates(
        data.candidates ?? []
      );
    } catch (err) {
      console.error(
        'Candidate loading error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load candidates.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectCandidate = (
    candidate: Candidate
  ) => {
    router.push({
      pathname: '/vote',
      params: {
        candidate_id:
          String(candidate.candidate_id),

        candidate_name:
          candidate.candidate_name,

        party_name:
          candidate.party_name,

        party_short_name:
          candidate.party_short_name,

        alliance_name:
          candidate.alliance_name ?? '',

        constituency_id:
          constituencyId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Select Candidate
          </Text>

          <Text style={styles.subtitle}>
            Constituency {constituencyId}
          </Text>
        </View>
      </View>

      {/* Information */}

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>
          CONSTITUENCY
        </Text>

        <Text style={styles.infoValue}>
          Constituency {constituencyId}
        </Text>

        <Text style={styles.infoDescription}>
          {loading
            ? 'Loading candidates...'
            : `${candidates.length} candidates contesting`}
        </Text>
      </View>

      {/* Loading */}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#111827"
          />

          <Text style={styles.loadingText}>
            Loading candidates...
          </Text>
        </View>
      )}

      {/* Error */}

      {!loading && error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            Unable to load candidates
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadCandidates}
          >
            <Text style={styles.retryText}>
              TRY AGAIN
            </Text>
          </Pressable>
        </View>
      )}

      {/* Candidate list */}

      {!loading &&
        error === '' && (
          <FlatList
            data={candidates}
            keyExtractor={(item) =>
              String(item.candidate_id)
            }
            contentContainerStyle={
              styles.list
            }
            showsVerticalScrollIndicator={
              false
            }
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.candidateCard,
                  pressed &&
                    styles.cardPressed,
                ]}
                onPress={() =>
                  selectCandidate(item)
                }
              >
                {/* Candidate ID */}

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.candidate_id}
                  </Text>
                </View>

                {/* Candidate details */}

                <View
                  style={
                    styles.candidateInfo
                  }
                >
                  <Text
                    style={
                      styles.candidateName
                    }
                  >
                    {item.candidate_name}
                  </Text>

                  <Text
                    style={styles.partyName}
                  >
                    {item.party_name}
                  </Text>

                  <View
                    style={styles.badgeRow}
                  >
                    <View
                      style={
                        styles.partyBadge
                      }
                    >
                      <Text
                        style={
                          styles.partyBadgeText
                        }
                      >
                        {
                          item.party_short_name
                        }
                      </Text>
                    </View>

                    {item.alliance_name && (
                      <Text
                        style={
                          styles.allianceName
                        }
                      >
                        {item.alliance_name}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Arrow */}

                <Text style={styles.arrow}>
                  ›
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text
                  style={styles.emptyTitle}
                >
                  No candidates found
                </Text>

                <Text
                  style={styles.emptyText}
                >
                  No candidates are available
                  for this constituency.
                </Text>
              </View>
            }
          />
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
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

  infoCard: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#6B7280',
  },

  infoValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  infoDescription: {
    marginTop: 5,
    fontSize: 12,
    color: '#6B7280',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
  },

  errorContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B91C1C',
  },

  errorText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: '#6B7280',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#111827',
  },

  retryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 25,
  },

  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardPressed: {
    opacity: 0.7,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },

  candidateInfo: {
    flex: 1,
    marginLeft: 14,
  },

  candidateName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },

  partyName: {
    marginTop: 4,
    fontSize: 12,
    color: '#374151',
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  partyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },

  partyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#374151',
  },

  allianceName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 10,
    color: '#6B7280',
  },

  arrow: {
    fontSize: 28,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: '#6B7280',
  },
});