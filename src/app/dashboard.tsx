import React, { useCallback, useEffect, useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  RefreshControl,
  StatusBar,
  useWindowDimensions,
} from 'react-native';

import { router } from 'expo-router';
import SeatMeter from '../components/SeatMeter';


// ============================================================
// API
// ============================================================

const API_BASE_URL =
  'https://83fu4h6opd.execute-api.ap-southeast-1.amazonaws.com/prod';


// ============================================================
// LOCAL CM CANDIDATE IMAGES
// ============================================================
//
// dashboard.tsx
//      ↓
// src/app/dashboard.tsx
//
// Images:
// src/assets/candidates/stalin.jpg
// src/assets/candidates/eps.jpg
// src/assets/candidates/vijay.jpg
// src/assets/candidates/seeman.jpg
//
// Therefore ../assets/candidates/... is the correct path.
// ============================================================

const STALIN_IMAGE = require('../assets/candidates/stalin.jpg');
const EPS_IMAGE = require('../assets/candidates/eps.jpg');
const VIJAY_IMAGE = require('../assets/candidates/vijay.jpg');
const SEEMAN_IMAGE = require('../assets/candidates/seeman.jpg');


// ============================================================
// CM CANDIDATES
// ============================================================

const CM_CANDIDATES = [
  {
    id: '1',
    name: 'M. K. Stalin',
    party: 'DMK',
    alliance: 'SPA',
    allianceId: '1',
    partyColor: '#8B1E3F',
    image: STALIN_IMAGE,
  },

  {
    id: '2',
    name: 'Edappadi K. Palaniswami',
    party: 'ADMK',
    alliance: 'NDA',
    allianceId: '2',
    partyColor: '#C62828',
    image: EPS_IMAGE,
  },

  {
    id: '3',
    name: 'C. Joseph Vijay',
    party: 'TVK',
    alliance: 'TVK',
    allianceId: '3',
    partyColor: '#2E7D32',
    image: VIJAY_IMAGE,
  },

  {
    id: '4',
    name: 'Seeman',
    party: 'NTK',
    alliance: 'NTK',
    allianceId: '4',
    partyColor: '#111111',
    image: SEEMAN_IMAGE,
  },
];


// ============================================================
// TYPES
// ============================================================

type Party = {
  party_id: string;
  party_name: string;
  party_short_name: string;
  alliance_id: string;
  alliance_name: string;
  seat_count: string;
};


type Alliance = {
  alliance_id: string;
  alliance_name: string;
  seat_count: string;
};


type FinalResult = {
  winning_alliance_id: string;
  winning_alliance_name: string;
  result_id: string;
  majority_required: string;
  winning_seat_count: string;
  final_message: string;
  majority_status: string;
};


type ConstituencyResult = {
  constituency_id: number;

  winner_candidate_id: number;
  winner_candidate_name: string;
  winner_vote_count: number;

  winner_party_id: number;
  winner_party_name: string;
  winner_party_short_name: string;

  winner_alliance_id: number | null;
  winner_alliance_name: string | null;

  runner_up_candidate_id: number;
  runner_up_candidate_name: string;
  runner_up_vote_count: number;

  runner_up_party_id: number;
  runner_up_party_name: string;
  runner_up_party_short_name: string;

  runner_up_alliance_id: number | null;
  runner_up_alliance_name: string | null;
};


// ============================================================
// DASHBOARD
// ============================================================

export default function DashboardScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < 650;


  // ==========================================================
  // STATE
  // ==========================================================

  const [parties, setParties] = useState<Party[]>([]);

  const [alliances, setAlliances] = useState<Alliance[]>([]);

  const [finalResult, setFinalResult] =
    useState<FinalResult | null>(null);

  const [constituencyResult, setConstituencyResult] =
    useState<ConstituencyResult | null>(null);

  const [constituencySearch, setConstituencySearch] =
    useState('');

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [searching, setSearching] = useState(false);

  const [error, setError] = useState('');



  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError('');


        const [
          partiesResponse,
          alliancesResponse,
          finalResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/results/parties`
          ),

          fetch(
            `${API_BASE_URL}/results/alliances`
          ),

          fetch(
            `${API_BASE_URL}/results/final`
          ),
        ]);


        const partiesData =
          await partiesResponse.json();

        const alliancesData =
          await alliancesResponse.json();

        const finalData =
          await finalResponse.json();


        if (!partiesResponse.ok) {
          throw new Error(
            partiesData?.message ||
              'Failed to load party results.'
          );
        }


        if (!alliancesResponse.ok) {
          throw new Error(
            alliancesData?.message ||
              'Failed to load alliance results.'
          );
        }


        if (!finalResponse.ok) {
          throw new Error(
            finalData?.message ||
              'Failed to load final result.'
          );
        }


        setParties(
          partiesData.parties ?? []
        );


        setAlliances(
          alliancesData.alliances ?? []
        );


        setFinalResult(
          finalData.result ?? null
        );


      } catch (err) {
        console.error(
          'Dashboard loading error:',
          err
        );


        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load election results.'
        );


      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  // ==========================================================
  // REFRESH
  // ==========================================================

  const refreshDashboard = () => {
    setRefreshing(true);
    loadDashboard(false);
  };


  // ==========================================================
  // CONSTITUENCY SEARCH
  // ==========================================================

  const searchConstituency = async () => {
    const id = Number(
      constituencySearch.trim()
    );


    if (
      !Number.isInteger(id) ||
      id < 1 ||
      id > 234
    ) {
      setError(
        'Enter a constituency number from 1 to 234.'
      );

      return;
    }


    try {
      setSearching(true);

      setError('');


      const response = await fetch(
        `${API_BASE_URL}/results/constituency/${id}`
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error(
          data?.message ||
            'Failed to load constituency result.'
        );
      }


      setConstituencyResult(
        data.result ?? data
      );


    } catch (err) {
      console.error(
        'Constituency search error:',
        err
      );


      setConstituencyResult(null);


      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load constituency result.'
      );


    } finally {
      setSearching(false);
    }
  };


  // ==========================================================
  // HELPERS
  // ==========================================================

  const getSeatNumber = (
    value: string
  ) => Number(value || 0);


  const leadingAlliance =
    alliances.length > 0
      ? alliances.reduce(
          (leader, current) =>
            getSeatNumber(
              current.seat_count
            ) >
            getSeatNumber(
              leader.seat_count
            )
              ? current
              : leader
        )
      : null;


  const majorityRequired =
    getSeatNumber(
      finalResult?.majority_required ?? '118'
    );


  const leadingSeats =
    getSeatNumber(
      leadingAlliance?.seat_count ?? '0'
    );

  const winnerCandidate = CM_CANDIDATES.find(
    (candidate) =>
      candidate.allianceId ===
      String(leadingAlliance?.alliance_id)
      );

  const winnerMessage = winnerCandidate
    ? `${winnerCandidate.name} wins the election`
    : 'Election winner not determined yet';  


  const majorityStatus =
    finalResult?.majority_status ===
    'MAJORITY';


  const progressWidth =
    majorityRequired > 0
      ? Math.min(
          (leadingSeats /
            majorityRequired) *
            100,
          100
        )
      : 0;



  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
      >
        <StatusBar
          barStyle="dark-content"
        />

        <ActivityIndicator
          size="large"
          color="#111827"
        />

        <Text style={styles.loadingText}>
          Loading election dashboard...
        </Text>
      </SafeAreaView>
    );
  }



  // ==========================================================
  // MAIN DASHBOARD
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="dark-content"
      />


      <ScrollView
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshDashboard}
          />
        }

        contentContainerStyle={
          styles.scrollContent
        }
      >


        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>

          <View>

            <Text style={styles.overline}>
              TN ELECTION LIVE
            </Text>


            <Text style={styles.headerTitle}>
              Election Dashboard
            </Text>


            <Text
              style={styles.headerSubtitle}
            >
              Live results from the election
              backend
            </Text>

          </View>


          <View style={styles.liveBadge}>

            <View
              style={styles.liveDot}
            />

            <Text style={styles.liveText}>
              LIVE
            </Text>

          </View>

        </View>

      {leadingAlliance && (
  <View
    style={[
      styles.winnerBanner,
      {
        borderColor:
          winnerCandidate?.partyColor ?? '#111827',
      },
    ]}
  >
    <Text style={styles.winnerBannerLabel}>
      ELECTION LEADER
    </Text>

    <Text style={styles.winnerBannerText}>
      🏆 {winnerMessage}
    </Text>

    <Text style={styles.winnerBannerSubtext}>
      {leadingAlliance.alliance_name} • {leadingSeats} seats
    </Text>
  </View>
)}


        {/* ==================================================
            ERROR
        ================================================== */}

        {error !== '' && (
          <View style={styles.errorBox}>

            <Text style={styles.errorTitle}>
              Unable to load some data
            </Text>


            <Text style={styles.errorText}>
              {error}
            </Text>

          </View>
        )}



        {/* ==================================================
            CM CANDIDATES
        ================================================== */}

        <View style={styles.cmSection}>


          {/* ELECTION HERO */}

          <View style={styles.cmHero}>

            <View style={styles.cmHeroTop}>

              <View style={styles.cmLivePill}>

                <View
                  style={styles.cmLiveDot}
                />

                <Text
                  style={styles.cmLiveText}
                >
                  LIVE
                </Text>

              </View>


              <Text
                style={styles.cmHeroBrand}
              >
                TN ELECTION 2026
              </Text>

            </View>


            <Text
              style={styles.cmHeroTitle}
            >
              ELECTION RESULTS
            </Text>


            <Text
              style={styles.cmHeroSubtitle}
            >
              TAMIL NADU • 234 SEATS
            </Text>

          </View>



          {/* SECTION HEADING */}

          <View
            style={styles.cmSectionHeading}
          >

            <View>

              <Text
                style={styles.cmSectionTitle}
              >
                Party/Alliance Winning Position
              </Text>



            </View>


            <View
              style={styles.cmCountBadge}
            >

  

            </View>

          </View>



          {/* CANDIDATE GRID */}

          <View style={styles.cmGrid}>

            {CM_CANDIDATES.map(
              (candidate, index) => {

                const candidateAlliance =
                  alliances.find(
                    (alliance) =>
                      String(
                        alliance.alliance_id
                      ) ===
                      candidate.allianceId
                  );


                const seatsWon =
                  candidateAlliance
                    ? getSeatNumber(
                        candidateAlliance.seat_count
                      )
                    : 0;


                return (

                  <Pressable
  key={candidate.id}
  onPress={() =>
    router.push({
      pathname: '/alliance-results',
      params: {
        alliance_id: candidate.allianceId,
        alliance_name: candidate.alliance,
      },
    })
  }
  style={({ pressed }) => [
    styles.cmCard,
    {
      width: isMobile
        ? '48.5%'
        : '23.5%',
      opacity: pressed ? 0.88 : 1,
      transform: [
        {
          scale: pressed ? 0.98 : 1,
        },
      ],
    },
  ]}
>


                    {/* IMAGE */}

                    <View
                      style={
                        styles.cmImageWrap
                      }
                    >

                      <Image
                        source={
                          candidate.image
                        }
                        style={
                          styles.cmImage
                        }
                        resizeMode="cover"
                      />



                      {/* PARTY BAND */}

                      <View
                        style={[
                          styles.cmPartyBand,
                          {
                            backgroundColor:
                              candidate.partyColor,
                          },
                        ]}
                      >

                        <Text
                          style={
                            styles.cmPartyBandText
                          }
                        >
                          {candidate.party}
                        </Text>

                      </View>

                    </View>



                    {/* CARD BODY */}

                    <View
                      style={
                        styles.cmCardBody
                      }
                    >

                      <Text
                        style={styles.cmName}
                        numberOfLines={2}
                      >
                        {candidate.name}
                      </Text>


                      <Text
                        style={
                          styles.cmAllianceName
                        }
                      >
                        Alliance: {candidate.alliance}
                      </Text>



                      {/* SEAT BOX */}

                      <View
                        style={[
                          styles.cmSeatBox,
                          {
                            borderColor:
                              candidate.partyColor,
                          },
                        ]}
                      >

                        <Text
                          style={[
                            styles.cmSeatNumber,
                            {
                              color:
                                candidate.partyColor,
                            },
                          ]}
                        >
                          {seatsWon}
                        </Text>


                        <View
                          style={
                            styles.cmSeatTextBlock
                          }
                        >

                          <Text
                            style={
                              styles.cmSeatLabel
                            }
                          >
                            SEATS
                          </Text>


                          <Text
                            style={
                              styles.cmSeatSubLabel
                            }
                          >
                            WINS SECURED
                          </Text>

                        </View>

                      </View>

                    </View>

                  </Pressable>

                );
              }
            )}

          </View>

        </View>

        {/* ==================================================
            SEAT METER
          ================================================== */}  

           <SeatMeter alliances={alliances} />

        {/* ==================================================
            CURRENT POSITION
        ================================================== */}

        <View style={styles.section}>

          <Text
            style={styles.sectionTitle}
          >
            Current Position
          </Text>


          <View
            style={styles.leadingCard}
          >

            <View
              style={styles.leadingTop}
            >

              <View>

                <Text
                  style={styles.smallLabel}
                >
                  LEADING ALLIANCE
                </Text>


                <Text
                  style={styles.leadingName}
                >
                  {leadingAlliance
                    ?.alliance_name ??
                    'No data'}
                </Text>

              </View>


              <View
                style={styles.seatBlock}
              >

                <Text
                  style={styles.seatNumber}
                >
                  {leadingSeats}
                </Text>


                <Text
                  style={styles.seatLabel}
                >
                  seats
                </Text>

              </View>

            </View>



            {/* PROGRESS */}

            <View
              style={styles.progressTrack}
            >

              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      `${progressWidth}%`,
                  },
                ]}
              />

            </View>



            <View
              style={styles.majorityRow}
            >

              <Text
                style={styles.majorityText}
              >
                Majority required
              </Text>


              <Text
                style={styles.majorityValue}
              >
                {majorityRequired}
              </Text>

            </View>



            <View
              style={styles.statusContainer}
            >

              <Text
                style={
                  majorityStatus
                    ? styles.statusMajority
                    : styles.statusNoMajority
                }
              >
                {finalResult?.final_message ??
                  'Result status unavailable'}
              </Text>

            </View>

          </View>

        </View>



        {/* ==================================================
            DASHBOARD LOWER SECTION
        ================================================== */}

        <View style={styles.dashboardColumns}>

          {/* ==================================================
              LEFT COLUMN
          ================================================== */}

          <View style={styles.leftColumn}>

            {/* ==================================================
                ALLIANCE TALLY
            ================================================== */}

            <View style={styles.section}>

              <Text
                style={styles.sectionTitle}
              >
                Alliance Seat Tally
              </Text>


              <View style={styles.card}>

                {alliances.map(
                  (alliance, index) => {

                    const seats =
                      getSeatNumber(
                        alliance.seat_count
                      );

                    const percentage =
                      (seats / 234) * 100;

                    return (

                      <View
                        key={
                          alliance.alliance_id
                        }
                        style={[
                          styles.tallyItem,
                          index <
                            alliances.length - 1 &&
                            styles.tallyBorder,
                        ]}
                      >

                        <View
                          style={
                            styles.tallyHeader
                          }
                        >

                          <View
                            style={
                              styles.tallyNameContainer
                            }
                          >

                            <Text
                              style={
                                styles.rankNumber
                              }
                            >
                              {index + 1}
                            </Text>


                            <Text
                              style={
                                styles.tallyName
                              }
                            >
                              {
                                alliance.alliance_name
                              }
                            </Text>

                          </View>


                          <Text
                            style={
                              styles.tallySeats
                            }
                          >
                            {seats}
                          </Text>

                        </View>


                        <View
                          style={
                            styles.tallyTrack
                          }
                        >

                          <View
                            style={[
                              styles.tallyFill,
                              {
                                width:
                                  `${percentage}%`,
                              },
                            ]}
                          />

                        </View>

                      </View>

                    );
                  }
                )}

              </View>

            </View>


          </View>


          {/* ==================================================
              RIGHT COLUMN
          ================================================== */}

          <View style={styles.rightColumn}>

            {/* ==================================================
                PARTY TALLY
            ================================================== */}

            <View style={styles.section}>

              <Text
                style={styles.sectionTitle}
              >
                Party Seat Tally
              </Text>


              <View style={styles.card}>

                {parties.map(
                  (party, index) => {

                    const seats =
                      getSeatNumber(
                        party.seat_count
                      );

                    const percentage =
                      (seats / 234) * 100;

                    return (

                      <View
                        key={
                          party.party_id
                        }
                        style={[
                          styles.tallyItem,
                          index <
                            parties.length - 1 &&
                            styles.tallyBorder,
                        ]}
                      >

                        <View
                          style={
                            styles.tallyHeader
                          }
                        >

                          <View
                            style={
                              styles.tallyNameContainer
                            }
                          >

                            <Text
                              style={
                                styles.rankNumber
                              }
                            >
                              {index + 1}
                            </Text>


                            <View
                              style={
                                styles.partyTallyNameBlock
                              }
                            >

                              <Text
                                style={
                                  styles.tallyName
                                }
                                numberOfLines={1}
                              >
                                {
                                  party.party_name
                                }
                              </Text>


                              {party.party_short_name && (

                                <Text
                                  style={
                                    styles.partyShortName
                                  }
                                >
                                  {
                                    party.party_short_name
                                  }
                                </Text>

                              )}

                            </View>

                          </View>


                          <View
                            style={
                              styles.partySeatBox
                            }
                          >

                            <Text
                              style={
                                styles.tallySeats
                              }
                            >
                              {seats}
                            </Text>


                            <Text
                              style={
                                styles.partySeatLabel
                              }
                            >
                              WINS
                            </Text>

                          </View>

                        </View>


                        <View
                          style={
                            styles.tallyTrack
                          }
                        >

                          <View
                            style={[
                              styles.tallyFill,
                              {
                                width:
                                  `${percentage}%`,
                              },
                            ]}
                          />

                        </View>

                      </View>

                    );
                  }
                )}

              </View>

            </View>


          </View>

        </View>


        {/* ==================================================
            CONSTITUENCY SEARCH
        ================================================== */}

        <View style={styles.section}>

          <Text
            style={styles.sectionTitle}
          >
            Constituency Result
          </Text>


          <View
            style={styles.searchRow}
          >

            <TextInput
              value={
                constituencySearch
              }
              onChangeText={
                setConstituencySearch
              }
              placeholder="Enter constituency 1–234"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={3}
              style={
                styles.searchInput
              }
            />


            <Pressable
              style={[
                styles.searchButton,
                searching &&
                  styles.disabledButton,
              ]}
              disabled={searching}
              onPress={
                searchConstituency
              }
            >

              {searching ? (

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

              ) : (

                <Text
                  style={
                    styles.searchButtonText
                  }
                >
                  SEARCH
                </Text>

              )}

            </Pressable>

          </View>


          {/* ==================================================
              CONSTITUENCY RESULT
          ================================================== */}

          {constituencyResult && (

            <View
              style={
                styles.resultCard
              }
            >

              <View
                style={
                  styles.resultHeader
                }
              >

                <View>

                  <Text
                    style={
                      styles.smallLabel
                    }
                  >
                    CONSTITUENCY
                  </Text>


                  <Text
                    style={
                      styles.resultConstituency
                    }
                  >
                    {
                      constituencyResult
                        .constituency_id
                    }
                  </Text>

                </View>


                <View
                  style={
                    styles.winnerBadge
                  }
                >

                  <Text
                    style={
                      styles.winnerBadgeText
                    }
                  >
                    WINNER
                  </Text>

                </View>

              </View>


              <Text
                style={
                  styles.winnerName
                }
              >
                {
                  constituencyResult
                    .winner_candidate_name
                }
              </Text>


              <Text
                style={
                  styles.winnerParty
                }
              >
                {
                  constituencyResult
                    .winner_party_name
                }{' '}
                (
                {
                  constituencyResult
                    .winner_party_short_name
                }
                )
              </Text>


              <Text
                style={
                  styles.winnerVotes
                }
              >
                {Number(
                  constituencyResult
                    .winner_vote_count
                ).toLocaleString()}{' '}
                votes
              </Text>


              <View
                style={styles.divider}
              />


              <Text
                style={
                  styles.runnerLabel
                }
              >
                RUNNER-UP
              </Text>


              <Text
                style={
                  styles.runnerName
                }
              >
                {
                  constituencyResult
                    .runner_up_candidate_name
                }
              </Text>


              <Text
                style={
                  styles.runnerParty
                }
              >
                {
                  constituencyResult
                    .runner_up_party_name
                }{' '}
                (
                {
                  constituencyResult
                    .runner_up_party_short_name
                }
                )
              </Text>


              <Text
                style={
                  styles.runnerVotes
                }
              >
                {Number(
                  constituencyResult
                    .runner_up_vote_count
                ).toLocaleString()}{' '}
                votes
              </Text>

            </View>

          )}

        </View>



        {/* ==================================================
            FOOTER
        ================================================== */}

        <View style={styles.footer}>

          <Text
            style={styles.footerTitle}
          >
            TN Election Live Simulation
          </Text>


          <Text
            style={styles.footerText}
          >
            Data powered by the existing
            election backend
          </Text>


          <Pressable
            style={styles.backButton}
            onPress={() =>
              router.replace('/')
            }
          >

            <Text
              style={
                styles.backButtonText
              }
            >
              BACK TO HOME
            </Text>

          </Pressable>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}



// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

      dashboardColumns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    gap: 20,
  },

  leftColumn: {
    flex: 1,
  },

  rightColumn: {
    flex: 1,
  },

  partyTallyNameBlock: {
    flex: 1,
    marginLeft: 10,
  },

  partyShortName: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },

  partySeatBox: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },

  partySeatLabel: {
    marginTop: -2,
    fontSize: 8,
    fontWeight: '800',
    color: '#9CA3AF',
  },

  winnerBanner: {
  marginHorizontal: 20,
  marginTop: 16,
  padding: 16,
  borderRadius: 14,
  backgroundColor: '#FFFFFF',
  borderWidth: 2,
  alignItems: 'center',
},

winnerBannerLabel: {
  fontSize: 9,
  fontWeight: '900',
  letterSpacing: 1,
  color: '#6B7280',
},

winnerBannerText: {
  marginTop: 5,
  fontSize: 20,
  fontWeight: '900',
  color: '#111827',
  textAlign: 'center',
},

winnerBannerSubtext: {
  marginTop: 5,
  fontSize: 11,
  fontWeight: '700',
  color: '#6B7280',
  textAlign: 'center',
},

  // ==========================================================
  // MAIN
  // ==========================================================

  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },


  scrollContent: {
    paddingBottom: 40,
  },


  // ==========================================================
  // LOADING
  // ==========================================================

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8FA',
  },


  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#6B7280',
  },


  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 20,

    backgroundColor: '#FFFFFF',

    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },


  overline: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#6B7280',
  },


  headerTitle: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: '900',
    color: '#111827',
  },


  headerSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },


  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 7,

    borderRadius: 20,

    backgroundColor: '#ECFDF5',
  },


  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,

    backgroundColor: '#10B981',

    marginRight: 6,
  },


  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857',
  },


  // ==========================================================
  // ERROR
  // ==========================================================

  errorBox: {
    marginHorizontal: 20,
    marginTop: 16,

    padding: 15,

    borderRadius: 12,

    backgroundColor: '#FEF2F2',

    borderWidth: 1,
    borderColor: '#FECACA',
  },


  errorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B91C1C',
  },


  errorText: {
    marginTop: 4,

    fontSize: 12,
    lineHeight: 17,

    color: '#7F1D1D',
  },


  // ==========================================================
  // SUMMARY
  // ==========================================================

  summaryRow: {
    flexDirection: 'row',

    paddingHorizontal: 20,
    paddingTop: 18,
  },


  summaryCard: {
    flex: 1,

    marginHorizontal: 4,

    paddingVertical: 17,
    paddingHorizontal: 8,

    borderRadius: 14,

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  summaryNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
  },


  summaryLabel: {
    marginTop: 4,

    fontSize: 10,

    color: '#6B7280',

    textAlign: 'center',
  },


  // ==========================================================
  // CM SECTION
  // ==========================================================

  cmSection: {
    marginTop: 22,
    paddingHorizontal: 20,
  },


  // ==========================================================
  // RED HERO
  // ==========================================================

  cmHero: {
    minHeight: 118,

    borderRadius: 18,

    paddingHorizontal: 22,
    paddingVertical: 18,

    backgroundColor: '#A40000',

    overflow: 'hidden',

    marginBottom: 18,
  },


  cmHeroTop: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },


  cmLivePill: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: '#FFFFFF',
  },


  cmLiveDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: '#D00000',

    marginRight: 6,
  },


  cmLiveText: {
    fontSize: 9,

    fontWeight: '900',

    color: '#111111',

    letterSpacing: 0.7,
  },


  cmHeroBrand: {
    fontSize: 10,

    fontWeight: '900',

    letterSpacing: 1.2,

    color: '#FFD7D7',
  },


  cmHeroTitle: {
    marginTop: 12,

    fontSize: 28,

    fontWeight: '900',

    letterSpacing: 0.8,

    color: '#FFFFFF',
  },


  cmHeroSubtitle: {
    marginTop: 2,

    fontSize: 13,

    fontWeight: '900',

    letterSpacing: 0.8,

    color: '#FFFFFF',
  },


  // ==========================================================
  // CM HEADING
  // ==========================================================

  cmSectionHeading: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginBottom: 12,
  },


  cmSectionTitle: {
    fontSize: 18,

    fontWeight: '900',

    color: '#111827',
  },


  cmSectionSubtitle: {
    marginTop: 3,

    fontSize: 11,

    color: '#6B7280',
  },


  cmCountBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 20,

    backgroundColor: '#F3F4F6',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  cmCountText: {
    fontSize: 9,

    fontWeight: '900',

    letterSpacing: 0.6,

    color: '#4B5563',
  },


  // ==========================================================
  // CM GRID
  // ==========================================================

  cmGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',
  },


  cmCard: {
    marginBottom: 14,

    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,

    elevation: 2,
  },


  // ==========================================================
  // CM IMAGE
  // ==========================================================

  cmImageWrap: {
    width: '100%',

    height: 220,

    backgroundColor: '#E5E7EB',

    overflow: 'hidden',

    position: 'relative',
  },


  cmImage: {
    width: '100%',
    height: '100%',
  },


  // ==========================================================
  // CM NUMBER
  // ==========================================================

  cmIndexBadge: {
    position: 'absolute',

    top: 9,
    left: 9,

    width: 29,
    height: 29,

    borderRadius: 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#FFFFFF',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    elevation: 2,
  },


  cmIndexText: {
    fontSize: 11,

    fontWeight: '900',

    color: '#111827',
  },


  // ==========================================================
  // PARTY BAND
  // ==========================================================

  cmPartyBand: {
    position: 'absolute',

    left: 10,
    right: 10,

    bottom: 10,

    height: 42,

    borderRadius: 10,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 10,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },


  cmPartyBandText: {
    fontSize: 17,

    fontWeight: '900',

    letterSpacing: 1,

    color: '#FFFFFF',
  },


  // ==========================================================
  // CM BODY
  // ==========================================================

  cmCardBody: {
    paddingHorizontal: 13,

    paddingVertical: 13,
  },


  cmName: {
    fontSize: 15,

    lineHeight: 19,

    fontWeight: '900',

    color: '#111827',

    minHeight: 38,
  },


  cmAllianceName: {
    marginTop: 5,

    fontSize: 11,

    fontWeight: '800',

    letterSpacing: 0.5,

    color: '#6B7280',
  },


  // ==========================================================
  // CM SEAT BOX
  // ==========================================================

  cmSeatBox: {
    marginTop: 11,

    minHeight: 62,

    borderWidth: 1.5,

    borderRadius: 11,

    backgroundColor: '#FAFAFA',

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 10,
  },


  cmSeatNumber: {
    fontSize: 30,

    lineHeight: 32,

    fontWeight: '900',
  },


  cmSeatTextBlock: {
    marginLeft: 7,

    alignItems: 'flex-start',
  },


  cmSeatLabel: {
    fontSize: 9,

    lineHeight: 11,

    fontWeight: '900',

    letterSpacing: 0.7,

    color: '#111827',
  },


  cmSeatSubLabel: {
    marginTop: 1,

    fontSize: 7,

    lineHeight: 9,

    fontWeight: '800',

    letterSpacing: 0.3,

    color: '#6B7280',
  },


  // ==========================================================
  // GENERAL SECTION
  // ==========================================================

  section: {
    marginTop: 24,

    paddingHorizontal: 20,
  },


  sectionTitle: {
    marginBottom: 10,

    fontSize: 17,

    fontWeight: '800',

    color: '#111827',
  },


  // ==========================================================
  // LEADING ALLIANCE
  // ==========================================================

  leadingCard: {
    padding: 18,

    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',
  },


  leadingTop: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },


  smallLabel: {
    fontSize: 9,

    fontWeight: '800',

    letterSpacing: 0.8,

    color: '#6B7280',
  },


  leadingName: {
    marginTop: 5,

    maxWidth: 250,

    fontSize: 17,

    fontWeight: '800',

    color: '#111827',
  },


  seatBlock: {
    alignItems: 'flex-end',
  },


  seatNumber: {
    fontSize: 30,

    fontWeight: '900',

    color: '#111827',
  },


  seatLabel: {
    marginTop: -3,

    fontSize: 10,

    color: '#6B7280',
  },


  progressTrack: {
    height: 8,

    marginTop: 18,

    borderRadius: 5,

    backgroundColor: '#E5E7EB',

    overflow: 'hidden',
  },


  progressFill: {
    height: '100%',

    borderRadius: 5,

    backgroundColor: '#111827',
  },


  majorityRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 10,
  },


  majorityText: {
    fontSize: 11,

    color: '#6B7280',
  },


  majorityValue: {
    fontSize: 11,

    fontWeight: '800',

    color: '#111827',
  },


  statusContainer: {
    marginTop: 13,

    padding: 10,

    borderRadius: 9,

    backgroundColor: '#F3F4F6',
  },


  statusNoMajority: {
    fontSize: 11,

    fontWeight: '700',

    color: '#374151',
  },


  statusMajority: {
    fontSize: 11,

    fontWeight: '800',

    color: '#047857',
  },


  // ==========================================================
  // COMMON CARD
  // ==========================================================

  card: {
    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    overflow: 'hidden',
  },


  // ==========================================================
  // ALLIANCE TALLY
  // ==========================================================

  tallyItem: {
    padding: 16,
  },


  tallyBorder: {
    borderBottomWidth: 1,

    borderBottomColor: '#F0F1F3',
  },


  tallyHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },


  tallyNameContainer: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'center',
  },


  rankNumber: {
    width: 25,

    fontSize: 11,

    fontWeight: '800',

    color: '#9CA3AF',
  },


  tallyName: {
    flex: 1,

    fontSize: 13,

    fontWeight: '700',

    color: '#111827',
  },


  tallySeats: {
    fontSize: 19,

    fontWeight: '900',

    color: '#111827',
  },


  tallyTrack: {
    height: 5,

    marginTop: 9,

    borderRadius: 4,

    backgroundColor: '#E5E7EB',

    overflow: 'hidden',
  },


  tallyFill: {
    height: '100%',

    borderRadius: 4,

    backgroundColor: '#111827',
  },


  // ==========================================================
  // PARTY TALLY
  // ==========================================================

  partyItem: {
    padding: 15,
  },


  partyLeft: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },


  partyRank: {
    width: 25,

    fontSize: 11,

    fontWeight: '800',

    color: '#9CA3AF',
  },


  partyShort: {
    fontSize: 15,

    fontWeight: '900',

    color: '#111827',
  },


  partyFull: {
    marginTop: 2,

    fontSize: 10,

    color: '#6B7280',
  },


  partyRight: {
    position: 'absolute',

    right: 15,

    top: 15,

    alignItems: 'flex-end',
  },


  partySeats: {
    fontSize: 18,

    fontWeight: '900',

    color: '#111827',
  },


  partySeatsLabel: {
    fontSize: 9,

    color: '#6B7280',
  },


  partyBarTrack: {
    height: 5,

    marginTop: 10,

    marginLeft: 25,

    marginRight: 55,

    borderRadius: 4,

    backgroundColor: '#E5E7EB',

    overflow: 'hidden',
  },


  partyBarFill: {
    height: '100%',

    borderRadius: 4,

    backgroundColor: '#111827',
  },


  // ==========================================================
  // CONSTITUENCY SEARCH
  // ==========================================================

  searchRow: {
    flexDirection: 'row',

    alignItems: 'center',
  },


  searchInput: {
    flex: 1,

    height: 50,

    paddingHorizontal: 14,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#D1D5DB',

    fontSize: 14,

    color: '#111827',
  },


  searchButton: {
    width: 95,

    height: 50,

    marginLeft: 8,

    borderRadius: 12,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor: '#111827',
  },


  disabledButton: {
    opacity: 0.6,
  },


  searchButtonText: {
    fontSize: 11,

    fontWeight: '900',

    color: '#FFFFFF',
  },


  // ==========================================================
  // CONSTITUENCY RESULT
  // ==========================================================

  resultCard: {
    marginTop: 12,

    padding: 18,

    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#E5E7EB',
  },


  resultHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },


  resultConstituency: {
    marginTop: 4,

    fontSize: 24,

    fontWeight: '900',

    color: '#111827',
  },


  winnerBadge: {
    paddingHorizontal: 10,

    paddingVertical: 6,

    borderRadius: 8,

    backgroundColor: '#ECFDF5',
  },


  winnerBadgeText: {
    fontSize: 9,

    fontWeight: '900',

    color: '#047857',
  },


  winnerName: {
    marginTop: 18,

    fontSize: 19,

    fontWeight: '900',

    color: '#111827',
  },


  winnerParty: {
    marginTop: 5,

    fontSize: 12,

    color: '#374151',
  },


  winnerVotes: {
    marginTop: 8,

    fontSize: 16,

    fontWeight: '800',

    color: '#111827',
  },


  divider: {
    height: 1,

    marginVertical: 16,

    backgroundColor: '#E5E7EB',
  },


  runnerLabel: {
    fontSize: 9,

    fontWeight: '800',

    letterSpacing: 0.7,

    color: '#9CA3AF',
  },


  runnerName: {
    marginTop: 5,

    fontSize: 15,

    fontWeight: '700',

    color: '#374151',
  },


  runnerParty: {
    marginTop: 3,

    fontSize: 11,

    color: '#6B7280',
  },


  runnerVotes: {
    marginTop: 5,

    fontSize: 13,

    fontWeight: '700',

    color: '#374151',
  },


  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    alignItems: 'center',

    paddingHorizontal: 20,

    paddingTop: 30,

    paddingBottom: 10,
  },


  footerTitle: {
    fontSize: 12,

    fontWeight: '700',

    color: '#6B7280',
  },


  footerText: {
    marginTop: 4,

    fontSize: 10,

    color: '#9CA3AF',

    textAlign: 'center',
  },


  backButton: {
    marginTop: 15,

    paddingHorizontal: 18,

    paddingVertical: 10,

    borderRadius: 10,

    backgroundColor: '#111827',
  },


  backButtonText: {
    fontSize: 10,

    fontWeight: '800',

    color: '#FFFFFF',
  },

});