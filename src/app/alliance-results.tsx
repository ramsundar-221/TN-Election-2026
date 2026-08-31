import React, { useEffect, useMemo, useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { constituencies } from '../constants/constituencies';

const API_BASE_URL =
  'https://83fu4h6opd.execute-api.ap-southeast-1.amazonaws.com/prod';

type ElectionResult = {
  constituency_id: number;

  winner_alliance_id?: number;
  winner_alliance_name?: string;

  winner_candidate_id?: number;
  winner_candidate_name?: string;

  winner_party_id?: number;
  winner_party_name?: string;
  winner_party_short_name?: string;
};

type ConstituencyResult = {
  constituency_id: number;
  constituency_name: string;

  winner_candidate_name?: string;

  winner_party_name?: string;
  winner_party_short_name?: string;

  winner_alliance_name?: string;
};

/*
==================================================
CM / PARTY INFORMATION

The navigation still sends alliance_id.

We use that ID only to identify which party
the user selected.

1 = DMK
2 = ADMK
3 = TVK
4 = NTK
==================================================
*/

const ALLIANCE_INFO: Record<
  string,
  {
    party: string;
    alliance: string;
    shortName: string;
    partyIds: number[];
    accent: string;
  }
> = {
  '1': {
    party: 'DMK',
    alliance: 'Secular Progressive Alliance',
    shortName: 'SPA',

    // DMK + VCK + IUML + CPI + CPM + INC + DMDK
    partyIds: [1, 3, 5, 6, 7, 2, 4],

    accent: '#9D174D',
  },

  '2': {
    party: 'ADMK',
    alliance: 'National Democratic Alliance',
    shortName: 'NDA',

    // ADMK + BJP + AMMK + PMK
    partyIds: [8, 9, 11, 10],

    accent: '#DC2626',
  },

  '3': {
    party: 'TVK',
    alliance: 'Tamizhaga Vetri Kazhagam',
    shortName: 'TVK',

    // TVK only
    partyIds: [12],

    accent: '#238636',
  },

  '4': {
    party: 'NTK',
    alliance: 'Naam Tamizhar Katchi',
    shortName: 'NTK',

    // NTK only
    partyIds: [13],

    accent: '#111111',
  },
};

export default function AllianceResultsScreen() {
  const params = useLocalSearchParams<{
    alliance_id?: string;
  }>();

  const allianceId = String(
    params.alliance_id ?? ''
  );

  const allianceInfo =
    ALLIANCE_INFO[allianceId];

  const [results, setResults] = useState<
    ConstituencyResult[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [progress, setProgress] =
    useState(0);

  /*
  ==================================================
  LOAD RESULTS
  ==================================================
  */

  useEffect(() => {
    loadAllianceResults();
  }, [allianceId]);

  const loadAllianceResults = async () => {
  if (!allianceId) {
    setError('Alliance ID is missing');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError('');
    setResults([]);
    setProgress(0);

    console.log(
      `Loading alliance ${allianceId} results...`
    );

    const response = await fetch(
      `${API_BASE_URL}/results/alliances/${allianceId}`
    );

    console.log(
      `Alliance API status: ${response.status}`
    );

    if (!response.ok) {
      throw new Error(
        `API returned ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      'Alliance API response:',
      data
    );

    const apiResults =
      data.results ?? [];

    const mappedResults: ConstituencyResult[] =
      apiResults.map(
        (result: ElectionResult) => {

          const constituency =
            constituencies.find(
              (c) =>
                Number(c.id) ===
                Number(
                  result.constituency_id
                )
            );

          return {
            constituency_id:
              Number(
                result.constituency_id
              ),

            constituency_name:
              constituency?.name ??
              `Constituency ${
                result.constituency_id
              }`,

            winner_candidate_name:
              result.winner_candidate_name,

            winner_party_name:
              result.winner_party_name,

            winner_party_short_name:
              result.winner_party_short_name,

            winner_alliance_name:
              result.winner_alliance_name,
          };
        }
      );

    mappedResults.sort(
      (a, b) =>
        a.constituency_id -
        b.constituency_id
    );

    setProgress(
      mappedResults.length
    );

    console.log(
      `Final alliance results: ${mappedResults.length}`
    );

    setResults(mappedResults);

  } catch (err) {

    console.error(
      'Alliance result error:',
      err
    );

    setError(
      'Unable to load constituency results'
    );

  } finally {

    setLoading(false);
  }
};

 

  /*
  ==================================================
  TITLE
  ==================================================
  */

  const title = allianceInfo
    ? `${allianceInfo.shortName} Winning Constituencies`
    : 'Alliance Results';

  /*
  ==================================================
  IMPORTANT

  The top number must match the actual number
  of winning constituencies.

  Therefore we use:

  results.length

  NOT allianceInfo.expectedSeats.
  ==================================================
  */

  const seatCount = results.length;

  const subtitle = useMemo(() => {
    if (!allianceInfo) {
      return '';
    }

    return `${allianceInfo.alliance} (${allianceInfo.shortName})`;
  }, [allianceInfo]);

  /*
  ==================================================
  INVALID PARTY
  ==================================================
  */

  if (!allianceInfo) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" />

        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Invalid party selection
          </Text>

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text
              style={styles.backButtonText}
            >
              Go Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  /*
  ==================================================
  MAIN SCREEN
  ==================================================
  */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.header}>
        <Pressable
          style={styles.backCircle}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {title}
          </Text>

          <Text
            style={styles.headerSubtitle}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      {/* ==================================================
          SUMMARY CARD
      ================================================== */}

      <View
        style={[
          styles.summaryCard,
          {
            borderColor:
              allianceInfo.accent,
          },
        ]}
      >
        <View>
          <Text
            style={styles.summaryParty}
          >
            {allianceInfo.party}
          </Text>

          <Text
            style={styles.summaryAlliance}
          >
            {allianceInfo.alliance}
          </Text>
        </View>

        <View style={styles.seatBox}>
          <Text
            style={[
              styles.seatNumber,
              {
                color:
                  allianceInfo.accent,
              },
            ]}
          >
            {seatCount}
          </Text>

          <Text style={styles.seatLabel}>
            SEATS WON
          </Text>
        </View>
      </View>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={
              allianceInfo.accent
            }
          />

          <Text
            style={styles.loadingText}
          >
            Loading winning constituencies...
          </Text>

          <Text
            style={styles.progressText}
          >
            {progress} constituencies loaded
          </Text>

          <View
            style={styles.loadingTrack}
          >
            <View
              style={[
                styles.loadingFill,
                {
                  width: `${
                    (progress / 234) *
                    100
                  }%`,
                  backgroundColor:
                    allianceInfo.accent,
                },
              ]}
            />
          </View>
        </View>
      ) : error ? (
        /*
        ==================================================
        ERROR
        ==================================================
        */

        <View style={styles.center}>
          <Text
            style={styles.errorTitle}
          >
            {error}
          </Text>

          <Pressable
            style={[
              styles.retryButton,
              {
                backgroundColor:
                  allianceInfo.accent,
              },
            ]}
            onPress={
              loadAllianceResults
            }
          >
            <Text
              style={styles.retryText}
            >
              Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        /*
        ==================================================
        RESULTS
        ==================================================
        */

        <FlatList
          data={results}
          keyExtractor={(item) =>
            String(
              item.constituency_id
            )
          }
          contentContainerStyle={
            styles.list
          }
          showsVerticalScrollIndicator={
            false
          }

          /*
          ==================================================
          LIST HEADER
          ==================================================
          */

          ListHeaderComponent={
            <View
              style={styles.listHeader}
            >
              <View>
                <Text
                  style={styles.listTitle}
                >
                  Winning Constituencies
                </Text>

                <Text
                  style={styles.listSubtitle}
                >
                  Constituencies won by{' '}
                  {allianceInfo.shortName}
                </Text>
              </View>

              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor:
                      allianceInfo.accent,
                  },
                ]}
              >
                <Text
                  style={styles.countText}
                >
                  {results.length}
                </Text>
              </View>
            </View>
          }

          /*
          ==================================================
          CONSTITUENCY CARD
          ==================================================
          */

          renderItem={({
            item,
            index,
          }) => (
            <View
              style={
                styles.constituencyCard
              }
            >
              {/* SERIAL NUMBER */}

              <View
                style={[
                  styles.numberCircle,
                  {
                    backgroundColor:
                      allianceInfo.accent,
                  },
                ]}
              >
                <Text
                  style={styles.numberText}
                >
                  {index + 1}
                </Text>
              </View>

              {/* DETAILS */}

              <View
                style={styles.cardContent}
              >
                <Text
                  style={
                    styles.constituencyId
                  }
                >
                  CONSTITUENCY NO.{' '}
                  {item.constituency_id}
                </Text>

                <Text
                  style={
                    styles.constituencyName
                  }
                >
                  {item.constituency_name}
                </Text>

                <Text
                  style={styles.winnerText}
                >
                  Winner:{' '}
                  {item.winner_candidate_name ??
                    'Winner unavailable'}
                </Text>

                <Text
                  style={styles.partyText}
                >
                  {item.winner_party_short_name ??
                    item.winner_party_name ??
                    allianceInfo.party}{' '}
                  •{' '}
                  {allianceInfo.shortName}
                </Text>
              </View>
            </View>
          )}

          /*
          ==================================================
          EMPTY RESULT
          ==================================================
          */

          ListEmptyComponent={
            <View style={styles.empty}>
              <Text
                style={styles.emptyTitle}
              >
                No winning constituencies
                found
              </Text>

              <Text
                style={styles.emptyText}
              >
                No constituencies were won
                by {allianceInfo.shortName}.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

/*
==================================================
STYLES
==================================================
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrow: {
    fontSize: 30,
    lineHeight: 32,
    color: '#111827',
  },

  headerText: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  summaryParty: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },

  summaryAlliance: {
    marginTop: 5,
    fontSize: 12,
    color: '#6B7280',
    maxWidth: 220,
  },

  seatBox: {
    alignItems: 'center',
    minWidth: 80,
  },

  seatNumber: {
    fontSize: 34,
    fontWeight: '900',
  },

  seatLabel: {
    marginTop: -2,
    fontSize: 8,
    fontWeight: '800',
    color: '#6B7280',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },

  progressText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },

  loadingTrack: {
    width: 220,
    height: 6,
    marginTop: 12,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },

  loadingFill: {
    height: 6,
    borderRadius: 3,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 10,
  },

  listTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },

  listSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#6B7280',
  },

  countBadge: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  constituencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 88,
    marginBottom: 10,
    padding: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  numberCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  constituencyId: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '700',
  },

  constituencyName: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },

  winnerText: {
    marginTop: 4,
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },

  partyText: {
    marginTop: 3,
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B91C1C',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 15,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  backButton: {
    marginTop: 15,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#111827',
  },

  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});