//Near network
function CONFIG(keyStores, NETWORK) {
    switch (NETWORK) {
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
      }
    case 'testnet':
      return {
        networkId: "testnet",
        keyStore: keyStores,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org"
      }
    default:
      throw Error(`Unconfigured environment '${NETWORK}'`)
    }
  }

  module.exports = { CONFIG }
  