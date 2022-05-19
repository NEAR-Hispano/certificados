<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app height="90">
      <div class="container">
        <v-row class="d-lg-flex justify-content-between align-center">
          <v-col
            class="d-none"
          >
            <v-app-bar-nav-icon />
          </v-col>
          <v-col
            class="col-3 d-flex justify-start"
          >
            <v-toolbar-title>
              <router-link
                to="/"
                style="text-decoration: none"
              >
                <v-img
                  width="200"
                  :src="require('../assets/img/near-hispano-logo.png')"
                />
              </router-link>
            </v-toolbar-title>
          </v-col>
          <v-col
            class="col-6 d-flex justify-center mt-7"
            align-self="center"
          >
            <v-autocomplete
              v-model="values"
              :items="items"
              outlined
              dense
            />
          </v-col>
          <v-col
            class="col-3 d-flex justify-end"
          >
            <div
              v-show="!sesion"
              class="text-right"
            >
              <v-btn
                class="ma-2"
                rounded
                outlined
                large
                @click="signIn()"
              >
                Conectar Wallet
              </v-btn>
            </div>
            <div
              v-show="sesion"
              class="text-right"
            >
              <v-menu offset-y transition="slide-x-transition">
                <template #activator="{ on, attrs }">
                  <v-btn
                    class="black--text ma-2"
                    rounded
                    outlined
                    large
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ accountId }}
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="signOut()">
                    <v-list-item-title>Cerrar Sesión</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import * as nearAPI from 'near-api-js'
import { CONFIG } from '~/services/api'
const { connect, keyStores, WalletConnection, Contract } = nearAPI
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      fixed: false,
      miniVariant: true,
      sesion: false,
      accountId: null,
    }
  },
  mounted () {
    this.isSigned()
  },
  methods: {
    async signIn () {
      // connect to NEAR
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
      // create wallet connection
      const wallet = new WalletConnection(near)
      wallet.requestSignIn(
        'nft.nearcertificate.testnet'
      )
    },
    async isSigned () {
      // connect to NEAR
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
      // create wallet connection
      const wallet = new WalletConnection(near)
      if (wallet.isSignedIn()) {
        const CONTRACT_NAME = 'book.bookshop2.testnet'
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          viewMethods: ['get_profile'],
          sender: wallet.account()
        })
        await contract.get_profile({
          user_id: wallet.getAccountId()
        }).then((res) => {
          this.profilex = true
        }).catch((err) => {
          console.log(err)
          this.profilex = false
        })
        this.sesion = true
        // returns account Id as string
        const walletAccountId = wallet.getAccountId()
        this.accountId = walletAccountId
      }
    },
    async signOut () {
      // connect to NEAR
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
      // create wallet connection
      const wallet = new WalletConnection(near)
      wallet.signOut()
      this.sesion = false
      this.$router.go()
    }
  }
}
</script>
