<script lang="ts">
  import { wallet, director } from './wallet'
  import type { PreviewFederation } from '@fedimint/core'

  const TESTNET_FEDERATION_CODE =
    'fed11qgqrgvnhwden5te0v9k8q6rp9ekh2arfdeukuet595cr2ttpd3jhq6rzve6zuer9wchxvetyd938gcewvdhk6tcqqysptkuvknc7erjgf4em3zfh90kffqf9srujn6q53d6r056e4apze5cw27h75'

  // --- Wallet Status ---
  let isOpen = $state(false)
  let balance = $state(0)

  function checkIsOpen() {
    if (wallet) {
      isOpen = wallet.isOpen()
    }
  }

  $effect(() => {
    checkIsOpen()
    const unsubscribe = wallet?.balance.subscribeBalance((bal) => {
      checkIsOpen()
      balance = bal
    })
    return () => {
      unsubscribe?.()
    }
  })

  // --- Join Federation ---
  let inviteCode = $state(TESTNET_FEDERATION_CODE)
  let joinResult = $state('')
  let joinError = $state('')
  let joining = $state(false)
  let previewData = $state<PreviewFederation | null>(null)
  let previewing = $state(false)

  async function previewFederation() {
    if (!inviteCode.trim()) return
    previewing = true
    joinError = ''
    try {
      previewData = await director.previewFederation(inviteCode)
      console.log('Preview federation:', previewData)
    } catch (e) {
      console.error('Error previewing federation:', e)
      joinError = e instanceof Error ? e.message : String(e)
      previewData = null
    } finally {
      previewing = false
    }
  }

  async function joinFederation() {
    checkIsOpen()
    console.log('Joining federation:', inviteCode)
    try {
      if (!wallet) throw new Error('Wallet unavailable')
      joining = true
      const res = await wallet.joinFederation(inviteCode)
      console.log('join federation res', res)
      joinResult = 'Joined!'
      joinError = ''
    } catch (e: any) {
      console.log('Error joining federation', e)
      joinError = typeof e === 'object' ? e.toString() : (e as string)
      joinResult = ''
    } finally {
      joining = false
    }
  }

  // --- Lightning Invoice ---
  let invoiceAmount = $state('')
  let invoiceDescription = $state('')
  let invoice = $state('')
  let invoiceError = $state('')
  let generating = $state(false)

  async function generateInvoice() {
    invoice = ''
    invoiceError = ''
    generating = true
    try {
      if (!wallet) throw new Error('Wallet unavailable')
      const response = await wallet.lightning.createInvoice(
        Number(invoiceAmount),
        invoiceDescription,
      )
      if (response) invoice = response.invoice
    } catch (e) {
      console.error('Error generating Lightning invoice', e)
      invoiceError = e instanceof Error ? e.message : String(e)
    } finally {
      generating = false
    }
  }

  // --- Redeem Ecash ---
  let ecashInput = $state('')
  let redeemResult = $state('')
  let redeemError = $state('')

  async function redeemEcash() {
    try {
      if (!wallet) throw new Error('Wallet unavailable')
      const res = await wallet.mint.redeemEcash(ecashInput)
      console.log('redeem ecash res', res)
      redeemResult = 'Redeemed!'
      redeemError = ''
    } catch (e) {
      console.log('Error redeeming ecash', e)
      redeemError = String(e)
      redeemResult = ''
    }
  }

  // --- Pay Lightning ---
  let lightningInput = $state('')
  let lightningResult = $state('')
  let lightningError = $state('')

  async function payLightning() {
    try {
      if (!wallet) throw new Error('Wallet unavailable')
      await wallet.lightning.payInvoice(lightningInput)
      lightningResult = 'Paid!'
      lightningError = ''
    } catch (e) {
      console.log('Error paying lightning', e)
      lightningError = String(e)
      lightningResult = ''
    }
  }

  // --- Deposit ---
  let depositAddress = $state('')
  let addressError = $state('')
  let addressLoading = $state(false)

  async function generateAddress() {
    addressLoading = true
    try {
      if (!wallet) throw new Error('Wallet unavailable')
      const result = await wallet.wallet.generateAddress()
      if (result) depositAddress = result.deposit_address
    } catch (e) {
      console.error('Error', e)
      addressError = e instanceof Error ? e.message : String(e)
    } finally {
      addressLoading = false
    }
  }

  // --- Send Onchain ---
  let onchainAddress = $state('')
  let onchainAmount = $state(0)
  let onchainResult = $state('')
  let onchainError = $state('')
  let onchainLoading = $state(false)

  async function sendOnchain() {
    try {
      onchainLoading = true
      if (!wallet) throw new Error('Wallet unavailable')
      const result = await wallet.wallet.sendOnchain(
        onchainAmount,
        onchainAddress,
      )
      if (result) onchainResult = result.operation_id
    } catch (e) {
      console.error('Error ', e)
      onchainError = e instanceof Error ? e.message : String(e)
    } finally {
      onchainLoading = false
    }
  }
</script>

<header>
  <h1>Fedimint Svelte Demo</h1>

  <div class="steps">
    <strong>Steps to get started:</strong>
    <ol>
      <li>Join a Federation (persists across sessions)</li>
      <li>Generate an Invoice</li>
      <li>
        Pay the Invoice using the
        <a href="https://faucet.mutinynet.com/" target="_blank">
          mutinynet faucet
        </a>
      </li>
      <li>
        Investigate the Browser Tools
        <ul>
          <li>Browser Console for logs</li>
          <li>Network Tab (websocket) for guardian requests</li>
          <li>Application Tab for state</li>
        </ul>
      </li>
    </ol>
  </div>
</header>

<main>
  <!-- Wallet Status -->
  <div class="section">
    <h3>Wallet Status</h3>
    <div class="row">
      <strong>Is Wallet Open?</strong>
      <div>{isOpen ? 'Yes' : 'No'}</div>
      <button onclick={checkIsOpen}>Check</button>
    </div>
    <div class="row">
      <strong>Balance:</strong>
      <div class="balance">{balance}</div>
      sats
    </div>
  </div>

  <!-- Join Federation -->
  <div class="section">
    <h3>Join Federation</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        joinFederation()
      }}
      class="row"
    >
      <input
        class="ecash-input"
        placeholder="Invite Code..."
        required
        bind:value={inviteCode}
        disabled={isOpen}
      />
      <button
        type="button"
        onclick={previewFederation}
        disabled={previewing || !inviteCode.trim() || isOpen}
      >
        {previewing ? 'Previewing...' : 'Preview'}
      </button>
      <button type="submit" disabled={isOpen || joining}>
        {joining ? 'Joining...' : 'Join'}
      </button>
    </form>

    {#if previewData}
      <div class="preview-result">
        <h4>Federation Preview</h4>
        <div class="preview-info">
          <div class="preview-row">
            <strong>Federation ID:</strong>
            <code class="id">{previewData.federation_id}</code>
          </div>
          <div class="preview-row">
            <strong>Name:</strong>
            <span>
              {previewData.config.global.meta?.federation_name || 'Unnamed'}
            </span>
          </div>
          <div class="preview-row">
            <strong>Consensus Version:</strong>
            <span>
              {previewData.config.global.consensus_version.major}.{previewData
                .config.global.consensus_version.minor}
            </span>
          </div>
          <div class="preview-row">
            <strong>Guardians:</strong>
            <span>
              {Object.keys(previewData.config.global.api_endpoints).length}
            </span>
          </div>
        </div>
      </div>
    {/if}

    {#if !joinResult && isOpen}
      <i>(You've already joined a federation)</i>
    {/if}
    {#if joinResult}
      <div class="success">{joinResult}</div>
    {/if}
    {#if joinError}
      <div class="error">{joinError}</div>
    {/if}
  </div>

  <!-- Generate Lightning Invoice -->
  <div class="section">
    <h3>Generate Lightning Invoice</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        generateInvoice()
      }}
    >
      <div class="input-group">
        <label for="amount">Amount (msats):</label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount in msats"
          required
          bind:value={invoiceAmount}
        />
      </div>
      <div class="input-group">
        <label for="description">Description:</label>
        <input
          id="description"
          placeholder="Enter description"
          required
          bind:value={invoiceDescription}
        />
      </div>
      <button type="submit" disabled={generating}>
        {generating ? 'Generating...' : 'Generate Invoice'}
      </button>
    </form>
    <div>
      mutinynet faucet:
      <a href="https://faucet.mutinynet.com/" target="_blank">
        https://faucet.mutinynet.com/
      </a>
    </div>
    {#if invoice}
      <div class="success">
        <strong>Generated Invoice:</strong>
        <pre class="invoice-wrap">{invoice}</pre>
        <button onclick={() => navigator.clipboard.writeText(invoice)}>
          Copy
        </button>
      </div>
    {/if}
    {#if invoiceError}
      <div class="error">{invoiceError}</div>
    {/if}
  </div>

  <!-- Redeem Ecash -->
  <div class="section">
    <h3>Redeem Ecash</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        redeemEcash()
      }}
      class="row"
    >
      <input
        placeholder="Long ecash string..."
        required
        bind:value={ecashInput}
      />
      <button type="submit">redeem</button>
    </form>
    {#if redeemResult}
      <div class="success">{redeemResult}</div>
    {/if}
    {#if redeemError}
      <div class="error">{redeemError}</div>
    {/if}
  </div>

  <!-- Pay Lightning -->
  <div class="section">
    <h3>Pay Lightning</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        payLightning()
      }}
      class="row"
    >
      <input placeholder="lnbc..." required bind:value={lightningInput} />
      <button type="submit">pay</button>
    </form>
    {#if lightningResult}
      <div class="success">{lightningResult}</div>
    {/if}
    {#if lightningError}
      <div class="error">{lightningError}</div>
    {/if}
  </div>

  <!-- Generate Deposit Address -->
  <div class="section">
    <h3>Generate Deposit Address</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        generateAddress()
      }}
      class="row"
    >
      <button type="submit" disabled={addressLoading}>
        {addressLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
    {#if depositAddress}
      <div class="success">
        <p>{depositAddress}</p>
      </div>
    {/if}
    {#if addressError}
      <div class="error">{addressError}</div>
    {/if}
  </div>

  <!-- Send Onchain -->
  <div class="section">
    <h3>Send Onchain</h3>
    <form
      onsubmit={(e) => {
        e.preventDefault()
        sendOnchain()
      }}
      class="row"
    >
      <input
        placeholder="Enter amount"
        type="number"
        bind:value={onchainAmount}
        required
      />
      <input
        placeholder="Enter onchain address"
        bind:value={onchainAddress}
        required
      />
      <button type="submit" disabled={onchainLoading}>
        {onchainLoading ? 'Sending' : 'Send'}
      </button>
    </form>
    {#if onchainResult}
      <div class="success">
        <p>Onchain Send Successful</p>
      </div>
    {/if}
    {#if onchainError}
      <div class="error">{onchainError}</div>
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    background-color: #181818;
    color: rgba(255, 255, 255, 0.87);
    color-scheme: dark;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    font-synthesis: none;
    font-weight: 400;
    line-height: 1.5;
    text-rendering: optimizeLegibility;
    word-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  header {
    max-width: 600px;
    margin: 0 auto 1.5rem;
    padding: 1rem;
    text-align: center;
  }

  .steps {
    text-align: left;
    display: inline-block;
    font-size: 1.2rem;
  }

  main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
  }

  input,
  button {
    font-size: 0.9rem;
    padding: 0.4em 0.8em;
    border-radius: 8px;
    border: 1px solid #444;
    background-color: #333;
    color: rgba(255, 255, 255, 0.87);
  }

  input {
    width: 100%;
    max-width: 300px;
  }

  button {
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #444;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .row:last-child {
    margin-bottom: 0;
  }

  .error {
    color: red;
  }

  .success {
    color: green;
  }

  .section {
    background-color: #242424;
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .input-group label {
    font-weight: bold;
    align-self: center;
  }

  .input-group input {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .invoice-wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 100%;
    overflow-x: auto;
    background-color: #333;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .preview-result {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #333;
    border-radius: 8px;
    border: 1px solid #444;
  }

  .preview-result h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
  }

  .preview-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preview-row {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
  }

  code.id {
    font-size: 0.8rem;
    word-break: break-all;
  }

  @media (min-width: 768px) {
    header,
    main {
      max-width: 800px;
      padding: 0;
    }

    .section {
      padding: 1rem;
      font-size: 1.2rem;
    }

    .row {
      margin-bottom: 1rem;
    }

    input,
    button {
      font-size: 1rem;
      padding: 0.5em 1em;
    }
  }
</style>
