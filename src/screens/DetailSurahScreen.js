// src/screens/DetailSurahScreen.js
import React, { useRef, useCallback } from "react";
import { View, FlatList, Alert, StyleSheet } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSurahDetail } from "../hooks/useSurahDetail";

const convertToArabicNumber = (num) =>
  num
    .toString()
    .split("")
    .map((d) => ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"][d])
    .join("");

export default function DetailSurahScreen({ route }) {
  const { nomor } = route.params;
  const flatRef = useRef();
  const { detail, loading } = useSurahDetail(nomor);
  const [bookmark, setBookmark] = React.useState(1);

  React.useEffect(() => {
    if (detail) {
      flatRef.current?.scrollToIndex({ index: bookmark - 1, animated: true });
    }
  }, [detail]);

  const updateBookmark = useCallback(
    async (ayat) => {
      setBookmark(ayat);
      await AsyncStorage.setItem(
        "lastRead",
        JSON.stringify({ ...detail, ayat })
      );
      Alert.alert("Tersimpan", `Ayat ${ayat} disimpan.`);
    },
    [detail]
  );

  const copyAyat = useCallback((item) => {
    const teks = `${convertToArabicNumber(item.nomor)}. ${item.ar}\n${
      item.tr
    }\n${item.idn}`;
    Clipboard.setString(teks);
    Alert.alert("Disalin", "Ayat disalin ke clipboard.");
  }, []);

  const shareAyat = useCallback(
    (item) => {
      const msg = `Surah ${detail.nama_latin} ayat ${item.nomor}:\n${item.ar}\n${item.tr}\n${item.idn}`;
      Share.share({ message: msg });
    },
    [detail]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <FlatList
      ref={flatRef}
      data={detail.ayat}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => {
        const isBookmarked = item.nomor === bookmark;
        return (
          <View
            style={[
              styles.ayatContainer,
              isBookmarked && styles.bookmarkHighlight,
            ]}
          >
            <View style={styles.actionRow}>
              <Icon
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isBookmarked ? "#FF5722" : "#777"}
                style={styles.actionIcon}
                onPress={() => updateBookmark(item.nomor)}
              />
              <Icon
                name="content-copy"
                size={24}
                color="#777"
                style={styles.actionIcon}
                onPress={() => copyAyat(item)}
              />
              <Icon
                name="share-variant"
                size={24}
                color="#777"
                style={styles.actionIcon}
                onPress={() => shareAyat(item)}
              />
            </View>
            <View style={styles.ayatNumberContainer}>
              <Text style={styles.ayatNumberText}>
                {convertToArabicNumber(item.nomor)}
              </Text>
            </View>
            <Text style={styles.arab}>{item.ar}</Text>
            <Text style={styles.latin}>{item.tr}</Text>
            <Text style={styles.translation}>{item.idn}</Text>
          </View>
        );
      }}
      contentContainerStyle={styles.list}
      initialNumToRender={10}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 15, backgroundColor: "#f4f4f4" },
  ayatContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 12,
    borderRadius: 15,
    elevation: 5,
  },
  bookmarkHighlight: { borderWidth: 2, borderColor: "#FF5722" },
  actionRow: { position: "absolute", top: 10, right: 10, flexDirection: "row" },
  actionIcon: { marginLeft: 12 },
  ayatNumberContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ayatNumberText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  arab: { fontSize: 26, textAlign: "right", color: "#4CAF50", marginBottom: 8 },
  latin: { fontSize: 18, fontStyle: "italic", color: "#555", marginBottom: 8 },
  translation: { fontSize: 16, color: "#777" },
});
