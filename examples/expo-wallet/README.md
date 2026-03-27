# Expo Wallet Example

A multi-screen Expo wallet app demonstrating the Fedimint TypeScript SDK with [Expo Router](https://docs.expo.dev/router/introduction/) file-based navigation.

## Architecture

```
app/
  _layout.tsx          # Root Stack navigator
  send.tsx             # Send screen (Lightning, On-chain, Ecash)
  receive.tsx          # Receive screen (Lightning invoice, Deposit address)
  (tabs)/
    _layout.tsx        # Tab navigator (Wallet, History, Settings)
    index.tsx          # Wallet Overview — balance, federation join, quick actions
    history.tsx        # Transaction History — pull-to-refresh operation list
    settings.tsx       # Settings — mnemonic manager, invite/invoice parsers
src/
  wallet.ts            # WalletDirector initialization
  hooks.ts             # Shared hooks (useIsOpen, useBalance)
  styles.ts            # Centralized dark theme styles
  components.tsx       # Reusable UI primitives (Btn, SectionCard, etc.)
```

## Prerequisites

- Node.js >= 18
- pnpm (workspace manager)
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator (or a physical device with Expo Go)

## Setup

From the **repository root**:

```bash
# Install all workspace dependencies
pnpm install

# Build the React Native SDK packages
pnpm build:reactnative

# Start the Expo dev server
cd examples/expo-wallet
npx expo start
```

Press `a` for Android, `i` for iOS, or scan the QR code with Expo Go.

## Getting Started

1. **Generate or set a mnemonic** in the Settings tab
2. **Join a federation** on the Wallet tab using the pre-filled testnet invite code
3. **Generate a Lightning invoice** on the Receive screen
4. **Pay the invoice** using the [mutinynet faucet](https://faucet.mutinynet.com/)
5. **Check your balance** on the Wallet tab and transactions on the History tab

## SDK Packages Used

- `@fedimint/react-native` — React Native transport and `WalletDirector`
- `@fedimint/core` — `FedimintWallet` class and service types

## Notes

- Uses `react-native-fs` for persistent database storage at the device's document directory
- Metro config maps workspace packages (`@fedimint/*`) to source directories for monorepo development
- All wallet state is managed locally with React hooks — no external state management library
