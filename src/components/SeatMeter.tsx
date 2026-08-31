import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

type AllianceSeats = {
  alliance_id?: number | string;
  alliance_name?: string;
  seat_count?: number | string;
};

type SeatMeterProps = {
  alliances: AllianceSeats[];
};

const TOTAL_SEATS = 234;
const MAJORITY_MARK = 118;

const COLORS: Record<string, string> = {
  '1': '#9D174D',
  '2': '#DC2626',
  '3': '#15803D',
  '4': '#111111',
};

function seatsFor(
  alliances: AllianceSeats[],
  id: string
) {
  const item = alliances.find(
    a => String(a.alliance_id) === id
  );

  const value = Number(item?.seat_count ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function nameFor(
  alliances: AllianceSeats[],
  id: string,
  fallback: string
) {
  const item = alliances.find(
    a => String(a.alliance_id) === id
  );

  return item?.alliance_name || fallback;
}

export default function SeatMeter({
  alliances,
}: SeatMeterProps) {

  const { width } = useWindowDimensions();

  const mobile = width < 600;

  const chartWidth = Math.min(
    Math.max(width - 40, 300),
    760
  );

  const chartHeight = mobile ? 190 : 250;

  const centerX = chartWidth / 2;

  const centerY = chartHeight - 15;

  const radius = Math.min(
    chartWidth * 0.43,
    mobile ? 145 : 220
  );

  const dotRadius = mobile ? 3.2 : 4;

  const spa = seatsFor(alliances, '1');
  const nda = seatsFor(alliances, '2');
  const tvk = seatsFor(alliances, '3');
  const ntk = seatsFor(alliances, '4');

  const spaName = nameFor(
    alliances,
    '1',
    'SPA'
  );

  const ndaName = nameFor(
    alliances,
    '2',
    'NDA'
  );

  const tvkName = nameFor(
    alliances,
    '3',
    'TVK'
  );

  const ntkName = nameFor(
    alliances,
    '4',
    'NTK'
  );

  /*
   * Build exactly 234 seat positions.
   */
  const seatColors: string[] = [
    ...Array(spa).fill(COLORS['1']),
    ...Array(nda).fill(COLORS['2']),
    ...Array(tvk).fill(COLORS['3']),
    ...Array(ntk).fill(COLORS['4']),
  ];

  /*
   * Majority marker position.
   */
  const majorityIndex = MAJORITY_MARK - 1;

  const majorityAngle =
    Math.PI -
    (Math.PI * majorityIndex) /
      (TOTAL_SEATS - 1);

  const majorityX =
    centerX +
    radius * Math.cos(majorityAngle);

  const majorityY =
    centerY -
    radius * Math.sin(majorityAngle);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        SEAT METER
      </Text>

      <Text style={styles.subtitle}>
        234 ASSEMBLY SEATS
      </Text>

      <View style={styles.chart}>

        <Svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >

          {/* Majority marker */}
          <Line
            x1={majorityX}
            y1={majorityY - 12}
            x2={majorityX}
            y2={majorityY + 12}
            stroke="#FACC15"
            strokeWidth={3}
          />

          {/* Seats */}
          {seatColors.map(
            (color, index) => {

              const angle =
                Math.PI -
                (Math.PI * index) /
                  (TOTAL_SEATS - 1);

              const x =
                centerX +
                radius * Math.cos(angle);

              const y =
                centerY -
                radius * Math.sin(angle);

              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={dotRadius}
                  fill={color}
                />
              );
            }
          )}

        </Svg>

        <View style={styles.center}>
          <Text style={styles.total}>
            234
          </Text>

          <Text style={styles.totalLabel}>
            TOTAL SEATS
          </Text>
        </View>

        <View
          style={[
            styles.majority,
            {
              left: majorityX - 30,
              top: majorityY - 38,
            },
          ]}
        >
          <Text style={styles.majorityNumber}>
            118
          </Text>

          <Text style={styles.majorityText}>
            MAJORITY
          </Text>
        </View>

      </View>

      {/* Legend */}
      <View style={styles.legend}>

        <Legend
          color={COLORS['3']}
          name={tvkName}
          seats={tvk}
        />

        <Legend
          color={COLORS['1']}
          name={spaName}
          seats={spa}
        />

        <Legend
          color={COLORS['2']}
          name={ndaName}
          seats={nda}
        />

        <Legend
          color={COLORS['4']}
          name={ntkName}
          seats={ntk}
        />

      </View>

    </View>
  );
}

function Legend({
  color,
  name,
  seats,
}: {
  color: string;
  name: string;
  seats: number;
}) {
  return (
    <View style={styles.legendItem}>

      <View
        style={[
          styles.dot,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.name}>
        {name}
      </Text>

      <Text style={styles.seats}>
        {seats}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginHorizontal: 15,
    marginTop: 18,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.7,
    color: '#111827',
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.4,
  },

  chart: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginTop: 4,
  },

  center: {
    position: 'absolute',
    left: '50%',
    top: '58%',
    transform: [
      { translateX: -50 },
      { translateY: -20 },
    ],
    width: 100,
    alignItems: 'center',
  },

  total: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
  },

  totalLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },

  majority: {
    position: 'absolute',
    width: 60,
    alignItems: 'center',
  },

  majorityNumber: {
    fontSize: 11,
    fontWeight: '900',
    color: '#A16207',
  },

  majorityText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#A16207',
  },

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 7,
    marginTop: 8,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 5,
  },

  name: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },

  seats: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '900',
    color: '#111827',
  },

});