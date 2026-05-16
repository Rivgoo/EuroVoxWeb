import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, Svg, Path } from '@react-pdf/renderer';
import { RankedCountry } from '../types';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/fonts/Inter-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Inter-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Inter-Bold.ttf', fontWeight: 700 },
  ],
});

const getPdfScoreColor = (score: number, max: number = 40): string => {
  if (score === 0) return '#9CA3AF';
  const ratio = score / max;
  
  if (ratio <= 0.40) return '#ef0d0d';
  if (ratio >= 0.80) return '#0be1ba';
  
  return '#111827';
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 20, 
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextBlack: {
    fontSize: 18,
    fontWeight: 800,
    color: '#111827',
    letterSpacing: 1,
  },
  logoTextOrange: {
    fontSize: 18,
    fontWeight: 800,
    color: '#FF5A00',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
  date: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3.2,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  tableRowTop1: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    borderBottomWidth: 0,
  },
  colRank: { width: '5%', textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#4B5563' },
  colFlag: { width: '6%', alignItems: 'center' },
  colInfo: { width: '37%', paddingLeft: 8, paddingRight: 4 },
  colScore: { width: '8%', textAlign: 'center', fontSize: 8, color: '#374151' },
  colTotal: { width: '10%', textAlign: 'center', fontSize: 9, fontWeight: 700 }, 
  colAvg: { width: '10%', textAlign: 'center', fontSize: 8, color: '#6B7280' },
  textCountry: { fontSize: 9, fontWeight: 600, color: '#111827', marginBottom: 1, textOverflow: 'ellipsis' },
  textArtist: { fontSize: 7, color: '#6B7280', textOverflow: 'ellipsis' },
  headerText: { fontSize: 7, fontWeight: 600, color: '#4B5563' },
  flagImage: { width: 14, height: 10, borderRadius: 2 },
});

interface PdfReportProps {
  userName: string;
  ranked: RankedCountry[];
}

export const PdfReport: React.FC<PdfReportProps> = ({ userName, ranked }) => {
  const dateStr = new Date().toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <Document title={`EuroVox 2026 - ${userName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <View style={styles.logoContainer}>
              <Svg viewBox="0 0 24 24" width={16} height={16} style={{ marginRight: 6 }}>
                <Path 
                  d="M19 5h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2H5a1 1 0 0 0-1 1v3c0 2.45 1.76 4.48 4.08 4.91A5.99 5.99 0 0 0 11 16.9v3.1H8v2h8v-2h-3v-3.1a5.99 5.99 0 0 0 2.92-2.99C18.24 13.48 20 11.45 20 9V6a1 1 0 0 0-1-1zM6 9V7h1v2.8C6.46 9.4 6 8.78 6 9zm12 0c0 .78-.46 1.4-1 1.8V7h1v2z" 
                  fill="#FF5A00" 
                />
              </Svg>
              <Text style={styles.logoTextBlack}>Рейтинг: </Text>
              <Text style={styles.logoTextOrange}>{userName}</Text>
            </View>
            <Text style={styles.subtitle}>Євробачення 2026</Text>
          </View>
          <Text style={styles.date}>Сформовано: {dateStr}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colRank, styles.headerText]}>#</Text>
            <Text style={[styles.colFlag, styles.headerText]}></Text>
            <Text style={[styles.colInfo, styles.headerText]}>Учасник</Text>
            <Text style={[styles.colScore, styles.headerText]}>Вокал</Text>
            <Text style={[styles.colScore, styles.headerText]}>Шоу</Text>
            <Text style={[styles.colScore, styles.headerText]}>Пісня</Text>
            <Text style={[styles.colScore, styles.headerText]}>Заг.</Text>
            <Text style={[styles.colTotal, styles.headerText]}>Сума</Text>
            <Text style={[styles.colAvg, styles.headerText]}>Сер.</Text>
          </View>

          {ranked.map((c, index) => {
            const isTop1 = c.rank === 1;
            const isComplete = c.votedCount === 4;
            
            const totalColor = getPdfScoreColor(c.totalScore, 40);
            const flagUrl = `https://flagcdn.com/w40/${c.countryCode.toLowerCase()}.png`;

            return (
              <View key={c.id} style={[styles.tableRow, isTop1 ? styles.tableRowTop1 : {}]}>
                <Text style={styles.colRank}>{c.rank}</Text>
                <View style={styles.colFlag}>
                  <Image src={flagUrl} style={styles.flagImage} />
                </View>
                <View style={styles.colInfo}>
                  <Text style={styles.textCountry}>{c.country}</Text>
                  <Text style={styles.textArtist}>{c.artist}</Text>
                </View>
                <Text style={styles.colScore}>{c.scores.vocal ?? '—'}</Text>
                <Text style={styles.colScore}>{c.scores.stage ?? '—'}</Text>
                <Text style={styles.colScore}>{c.scores.song ?? '—'}</Text>
                <Text style={styles.colScore}>{c.scores.overall ?? '—'}</Text>
                <Text style={[styles.colTotal, { color: isComplete ? totalColor : '#9CA3AF' }]}>
                  {isComplete ? c.totalScore : '—'}
                </Text>
                <Text style={styles.colAvg}>
                  {isComplete ? c.averageScore.toFixed(1) : '—'}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};