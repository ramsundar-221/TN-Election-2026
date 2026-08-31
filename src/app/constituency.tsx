import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

const constituencies = [
  { id: 1, name: 'Gummidipoondi' },
  { id: 2, name: 'Ponneri (SC)' },
  { id: 3, name: 'Tiruttani' },
  { id: 4, name: 'Thiruvallur' },
  { id: 5, name: 'Poonamallee (SC)' },
  { id: 6, name: 'Avadi' },
  { id: 7, name: 'Maduravoyal' },
  { id: 8, name: 'Ambattur' },
  { id: 9, name: 'Madavaram' },
  { id: 10, name: 'Tiruvottiyur' },
  { id: 11, name: 'Dr. Radhakrishnan Nagar' },
  { id: 12, name: 'Perambur' },
  { id: 13, name: 'Kolathur' },
  { id: 14, name: 'Villivakkam' },
  { id: 15, name: 'Thiru-Vi-Ka-Nagar (SC)' },
  { id: 16, name: 'Egmore (SC)' },
  { id: 17, name: 'Royapuram' },
  { id: 18, name: 'Harbour' },
  { id: 19, name: 'Chepauk-Thiruvallikeni' },
  { id: 20, name: 'Thousand Lights' },
  { id: 21, name: 'Anna Nagar' },
  { id: 22, name: 'Virugampakkam' },
  { id: 23, name: 'Saidapet' },
  { id: 24, name: 'Thiyagarayanagar' },
  { id: 25, name: 'Mylapore' },
  { id: 26, name: 'Velachery' },
  { id: 27, name: 'Shozhinganallur' },
  { id: 28, name: 'Alandur' },
  { id: 29, name: 'Sriperumbudur (SC)' },
  { id: 30, name: 'Pallavaram' },
  { id: 31, name: 'Tambaram' },
  { id: 32, name: 'Chengalpattu' },
  { id: 33, name: 'Thiruporur' },
  { id: 34, name: 'Cheyyur (SC)' },
  { id: 35, name: 'Madurantakam (SC)' },
  { id: 36, name: 'Uthiramerur' },
  { id: 37, name: 'Kancheepuram' },
  { id: 38, name: 'Arakkonam (SC)' },
  { id: 39, name: 'Sholingur' },
  { id: 40, name: 'Katpadi' },
  { id: 41, name: 'Ranipet' },
  { id: 42, name: 'Arcot' },
  { id: 43, name: 'Vellore' },
  { id: 44, name: 'Anaikattu' },
  { id: 45, name: 'Kilvaithinankuppam (SC)' },
  { id: 46, name: 'Gudiyattam (SC)' },
  { id: 47, name: 'Vaniyambadi' },
  { id: 48, name: 'Ambur' },
  { id: 49, name: 'Jolarpet' },
  { id: 50, name: 'Tiruppattur' },
  { id: 51, name: 'Uthangarai (SC)' },
  { id: 52, name: 'Bargur' },
  { id: 53, name: 'Krishnagiri' },
  { id: 54, name: 'Veppanahalli' },
  { id: 55, name: 'Hosur' },
  { id: 56, name: 'Thalli' },
  { id: 57, name: 'Palacode' },
  { id: 58, name: 'Pennagaram' },
  { id: 59, name: 'Dharmapuri' },
  { id: 60, name: 'Pappireddippatti' },
  { id: 61, name: 'Harur (SC)' },
  { id: 62, name: 'Chengam (SC)' },
  { id: 63, name: 'Tiruvannamalai' },
  { id: 64, name: 'Kilpennathur' },
  { id: 65, name: 'Kalasapakkam' },
  { id: 66, name: 'Polur' },
  { id: 67, name: 'Arani' },
  { id: 68, name: 'Cheyyar' },
  { id: 69, name: 'Vandavasi (SC)' },
  { id: 70, name: 'Gingee' },
  { id: 71, name: 'Mailam' },
  { id: 72, name: 'Tindivanam (SC)' },
  { id: 73, name: 'Vanur (SC)' },
  { id: 74, name: 'Villupuram' },
  { id: 75, name: 'Vikravandi' },
  { id: 76, name: 'Tirukkoyilur' },
  { id: 77, name: 'Ulundurpettai' },
  { id: 78, name: 'Rishivandiyam' },
  { id: 79, name: 'Sankarapuram' },
  { id: 80, name: 'Kallakurichi (SC)' },
  { id: 81, name: 'Gangavalli (SC)' },
  { id: 82, name: 'Attur (SC)' },
  { id: 83, name: 'Yercaud (ST)' },
  { id: 84, name: 'Omalur' },
  { id: 85, name: 'Mettur' },
  { id: 86, name: 'Edappadi' },
  { id: 87, name: 'Sankagiri' },
  { id: 88, name: 'Salem (West)' },
  { id: 89, name: 'Salem (North)' },
  { id: 90, name: 'Salem (South)' },
  { id: 91, name: 'Veerapandi' },
  { id: 92, name: 'Rasipuram (SC)' },
  { id: 93, name: 'Senthamangalam (ST)' },
  { id: 94, name: 'Namakkal' },
  { id: 95, name: 'Paramathi-Velur' },
  { id: 96, name: 'Tiruchengodu' },
  { id: 97, name: 'Kumarapalayam' },
  { id: 98, name: 'Erode (East)' },
  { id: 99, name: 'Erode (West)' },
  { id: 100, name: 'Modakkurichi' },
  { id: 101, name: 'Dharapuram (SC)' },
  { id: 102, name: 'Kangayam' },
  { id: 103, name: 'Perundurai' },
  { id: 104, name: 'Bhavani' },
  { id: 105, name: 'Anthiyur' },
  { id: 106, name: 'Gobichettipalayam' },
  { id: 107, name: 'Bhavanisagar (SC)' },
  { id: 108, name: 'Udhagamandalam' },
  { id: 109, name: 'Gudalur (SC)' },
  { id: 110, name: 'Coonoor' },
  { id: 111, name: 'Mettupalayam' },
  { id: 112, name: 'Avanashi (SC)' },
  { id: 113, name: 'Tiruppur (North)' },
  { id: 114, name: 'Tiruppur (South)' },
  { id: 115, name: 'Palladam' },
  { id: 116, name: 'Sulur' },
  { id: 117, name: 'Kavundampalayam' },
  { id: 118, name: 'Coimbatore (North)' },
  { id: 119, name: 'Thondamuthur' },
  { id: 120, name: 'Coimbatore (South)' },
  { id: 121, name: 'Singanallur' },
  { id: 122, name: 'Kinathukadavu' },
  { id: 123, name: 'Pollachi' },
  { id: 124, name: 'Valparai (SC)' },
  { id: 125, name: 'Udumalaipettai' },
  { id: 126, name: 'Madathukulam' },
  { id: 127, name: 'Palani' },
  { id: 128, name: 'Oddanchatram' },
  { id: 129, name: 'Athoor' },
  { id: 130, name: 'Nilakottai (SC)' },
  { id: 131, name: 'Natham' },
  { id: 132, name: 'Dindigul' },
  { id: 133, name: 'Vedasandur' },
  { id: 134, name: 'Aravakurichi' },
  { id: 135, name: 'Karur' },
  { id: 136, name: 'Krishnarayapuram (SC)' },
  { id: 137, name: 'Kulithalai' },
  { id: 138, name: 'Manapaarai' },
  { id: 139, name: 'Srirangam' },
  { id: 140, name: 'Tiruchirappalli (West)' },
  { id: 141, name: 'Tiruchirappalli (East)' },
  { id: 142, name: 'Thiruverumbur' },
  { id: 143, name: 'Lalgudi' },
  { id: 144, name: 'Manachanallur' },
  { id: 145, name: 'Musiri' },
  { id: 146, name: 'Thuraiyur (SC)' },
  { id: 147, name: 'Perambalur (SC)' },
  { id: 148, name: 'Kunnam' },
  { id: 149, name: 'Ariyalur' },
  { id: 150, name: 'Jayankondam' },
  { id: 151, name: 'Tittakudi (SC)' },
  { id: 152, name: 'Virudhachalam' },
  { id: 153, name: 'Neyveli' },
  { id: 154, name: 'Panruti' },
  { id: 155, name: 'Cuddalore' },
  { id: 156, name: 'Kurinjipadi' },
  { id: 157, name: 'Bhuvanagiri' },
  { id: 158, name: 'Chidambaram' },
  { id: 159, name: 'Kattumannarkoil (SC)' },
  { id: 160, name: 'Sirkazhi (SC)' },
  { id: 161, name: 'Mayiladuthurai' },
  { id: 162, name: 'Poompuhar' },
  { id: 163, name: 'Nagapattinam' },
  { id: 164, name: 'Kilvelur (SC)' },
  { id: 165, name: 'Vedaranyam' },
  { id: 166, name: 'Thiruthuraipoondi (SC)' },
  { id: 167, name: 'Mannargudi' },
  { id: 168, name: 'Thiruvarur' },
  { id: 169, name: 'Nannilam' },
  { id: 170, name: 'Thiruvidaimarudur (SC)' },
  { id: 171, name: 'Kumbakonam' },
  { id: 172, name: 'Papanasam' },
  { id: 173, name: 'Thiruvaiyaru' },
  { id: 174, name: 'Thanjavur' },
  { id: 175, name: 'Orathanadu' },
  { id: 176, name: 'Pattukkottai' },
  { id: 177, name: 'Peravurani' },
  { id: 178, name: 'Gandarvakottai (SC)' },
  { id: 179, name: 'Viralimalai' },
  { id: 180, name: 'Pudukkottai' },
  { id: 181, name: 'Thirumayam' },
  { id: 182, name: 'Alangudi' },
  { id: 183, name: 'Aranthangi' },
  { id: 184, name: 'Karaikudi' },
  { id: 185, name: 'Tiruppattur' },
  { id: 186, name: 'Sivaganga' },
  { id: 187, name: 'Manamadurai (SC)' },
  { id: 188, name: 'Melur' },
  { id: 189, name: 'Madurai East' },
  { id: 190, name: 'Sholavandan (SC)' },
  { id: 191, name: 'Madurai North' },
  { id: 192, name: 'Madurai South' },
  { id: 193, name: 'Madurai Central' },
  { id: 194, name: 'Madurai West' },
  { id: 195, name: 'Thiruparankundram' },
  { id: 196, name: 'Thirumangalam' },
  { id: 197, name: 'Usilampatti' },
  { id: 198, name: 'Andipatti' },
  { id: 199, name: 'Periyakulam (SC)' },
  { id: 200, name: 'Bodinayakanur' },
  { id: 201, name: 'Cumbum' },
  { id: 202, name: 'Rajapalayam' },
  { id: 203, name: 'Srivilliputhur (SC)' },
  { id: 204, name: 'Sattur' },
  { id: 205, name: 'Sivakasi' },
  { id: 206, name: 'Virudhunagar' },
  { id: 207, name: 'Aruppukkottai' },
  { id: 208, name: 'Tiruchuli' },
  { id: 209, name: 'Paramakudi (SC)' },
  { id: 210, name: 'Tiruvadanai' },
  { id: 211, name: 'Ramanathapuram' },
  { id: 212, name: 'Mudhukulathur' },
  { id: 213, name: 'Vilathikulam' },
  { id: 214, name: 'Thoothukkudi' },
  { id: 215, name: 'Tiruchendur' },
  { id: 216, name: 'Srivaikuntam' },
  { id: 217, name: 'Ottapidaram (SC)' },
  { id: 218, name: 'Kovilpatti' },
  { id: 219, name: 'Sankarankovil (SC)' },
  { id: 220, name: 'Vasudevanallur (SC)' },
  { id: 221, name: 'Kadayanallur' },
  { id: 222, name: 'Tenkasi' },
  { id: 223, name: 'Alangulam' },
  { id: 224, name: 'Tirunelveli' },
  { id: 225, name: 'Ambasamudram' },
  { id: 226, name: 'Palayamkottai' },
  { id: 227, name: 'Nanguneri' },
  { id: 228, name: 'Radhapuram' },
  { id: 229, name: 'Kanniyakumari' },
  { id: 230, name: 'Nagercoil' },
  { id: 231, name: 'Colachal' },
  { id: 232, name: 'Padmanabhapuram' },
  { id: 233, name: 'Vilavancode' },
  { id: 234, name: 'Killiyoor' },
];

export default function ConstituencyScreen() {
  const [search, setSearch] = useState('');

  const filteredConstituencies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return constituencies;
    }

    return constituencies.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        String(item.id).includes(query)
    );
  }, [search]);

  const selectConstituency = (id: number) => {
    router.push({
      pathname: '/candidates',
      params: {
        constituency_id: String(id),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>Select Constituency</Text>
          <Text style={styles.subtitle}>
            Choose from 234 constituencies
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search constituency..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredConstituencies}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.constituencyCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() => selectConstituency(item.id)}
          >
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{item.id}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>

              <Text style={styles.cardSubtitle}>
                Tamil Nadu Legislative Assembly
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No constituency found
            </Text>

            <Text style={styles.emptyText}>
              Try another constituency number.
            </Text>
          </View>
        }
      />
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  searchIcon: {
    fontSize: 22,
    color: '#6B7280',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 25,
  },

  constituencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  cardPressed: {
    opacity: 0.7,
  },

  numberCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
  },

  cardContent: {
    flex: 1,
    marginLeft: 13,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  cardSubtitle: {
    marginTop: 4,
    fontSize: 11,
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
    color: '#6B7280',
  },
});