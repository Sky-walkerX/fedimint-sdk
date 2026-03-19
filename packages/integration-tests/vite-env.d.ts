interface ImportMetaEnv {
  readonly FAUCET: string
  readonly LNURL_TEST_ADDRESS: string
  readonly LNURL_TEST_AMOUNT_MSATS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
