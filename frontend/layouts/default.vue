<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app height="90">
      <div class="container">
        <v-row class="d-lg-flex justify-content-between align-center">
          <v-col
            class="col-3 d-flex justify-start"
          >
            <router-link
                to="/"
                style="text-decoration: none"
              >
              <v-toolbar-title>
                <v-img
                  width="200"
                  :src="require('../assets/img/near-hispano-logo.png')"
                />
              </v-toolbar-title>
            </router-link>
          </v-col>
          <v-col
            class="col-6 d-none d-md-flex justify-center mt-7"
            align-self="center"
          >
            <v-text-field
              solo
              v-model="account"
              label="Id Near"
              append-icon="mdi-magnify"
              clearable
              @keyup.enter="viewCertificates(account)"
            />
          </v-col>
          <v-col
            class="col-3 d-none d-md-flex justify-end"
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
          <v-col
            class="d-flex d-md-none justify-end"
          >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          </v-col>
        </v-row>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <!-- <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img> -->
          <v-icon>mdi-account-outline</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ accountId }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-show="!sesion" link>
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="signIn()">Conectar Wallet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="sesion" link>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="signOut()">Cerrar Sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
      account: null,
      drawer: false,
      group: null,
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
        'certificate.nearcertificate.testnet'
      )
    },
    async isSigned () {
      // connect to NEAR
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
      // create wallet connection
      const wallet = new WalletConnection(near)
      if (wallet.isSignedIn()) {
        this.sesion = true
        // returns account Id as string
        const walletAccountId = wallet.getAccountId()
        this.accountId = walletAccountId
        localStorage.accountId = this.accountId
      }
    },
    async signOut () {
      // connect to NEAR
      const near = await connect(CONFIG(new keyStores.BrowserLocalStorageKeyStore()))
      // create wallet connection
      const wallet = new WalletConnection(near)
      wallet.signOut()
      this.sesion = false
      localStorage.accountId = ''
      this.$router.go(0)
    },
    // viewCertificates: function(accountId) {
    //   // alert('aqui')
    //   localStorage.accountSearch = accountId
    //   this.$router.go(0)
    // },
    viewCertificates(accountId) {
      localStorage.accountSearch = accountId
      this.$router.go(0)
    }
  },
  watch: {
    group () {
      this.drawer = false
    },
  },
}
</script>
