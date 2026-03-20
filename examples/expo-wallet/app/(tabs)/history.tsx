import { StyleSheet, Text, View, FlatList } from 'react-native'
import { AppScreen } from '../../src/components/AppScreen'
import { Panel } from '../../src/components/Panel'
import { formatSats, mockTransactions } from '../../src/mocks/wallet'
import { palette } from '../../src/theme/palette'
import type { TransactionItem } from '../../src/types/wallet'

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: TransactionItem }) => {
    const sign = item.direction === 'incoming' ? '+' : '-'
    const amountColor =
      item.direction === 'incoming' ? palette.success : palette.danger

    return (
      <Panel>
        <View style={styles.itemTopRow}>
          <Text style={styles.itemNote}>{item.note}</Text>
          <Text style={[styles.itemAmount, { color: amountColor }]}>
            {`${sign} ${formatSats(item.amountSats)}`}
          </Text>
        </View>
        <View style={styles.itemBottomRow}>
          <Text style={styles.itemMeta}>{item.timestamp}</Text>
          <Text style={styles.itemMeta}>{item.status}</Text>
        </View>
      </Panel>
    )
  }

  return (
    <AppScreen>
      <View style={styles.container}>
        <Text style={styles.heading}>Transaction History</Text>
        <Text style={styles.subheading}>
          Recent wallet activity (mock state)
        </Text>

        <FlatList
          data={mockTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  heading: {
    color: palette.textPrimary,
    fontSize: 32,
    fontWeight: '700',
  },
  subheading: {
    color: palette.textSecondary,
    fontSize: 15,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  itemNote: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemMeta: {
    textTransform: 'capitalize',
    fontSize: 16,
    color: palette.textSecondary,
  },
})
