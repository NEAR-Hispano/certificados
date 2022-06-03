<template>
  <div class="container">
    <aside class="text-lg-h3 text-h4 font-weight-bold text-center mt-8">
      {{ title }}
    </aside>
    <aside v-if="busqueda" class="text-right">
      <v-btn
        class="ma-2"
        rounded
        outlined
        @click="reload()"
      >
        Regresar
      </v-btn>
    </aside>
    <v-row class="mt-5">
      <v-col
        v-for="item, i in dataCertificates"
        :key="i"
        class="col-lg-3 col-md-4 col-sm-6 col-12"
      >
        <viewer>
          <v-card class="mx-auto" @click="viewImg(item.img)">
            <v-img
              class="white--text align-end"
              height="200px"
              :src="item.img"
            />
            <v-card-actions>
              <v-btn
                v-if="item.minteable && !busqueda"
                color="orange"
                text
                @click="mintCertificate(item.id)"
              >
                Mintear
              </v-btn>
              <v-btn
                color="orange"
                text
                @click="download(item.img, item.certificacion)"
              >
                Descargar
              </v-btn>
            </v-card-actions>
          </v-card>
        </viewer>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col class="col-12 col-md-6 offset-md-3">
        <aside class="text-h5 text-lg-h4 font-weight-medium text-center">
          Aprende y construye la web 3.0
        </aside>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12 col-md-8 offset-md-2 text-center">
        <p>
          Sabemos que deseas una guía experimentada que te ayude a conocer este nuevo mundo. Hemos creado experiencias de aprendizaje que transforman tu forma de percibir el blockchain, a tu propio ritmo y totalmente en línea.
        </p>
        <a href="https://educacion.nearhispano.org/" target="_blank" style="text-decoration: none;">
          <v-btn
            class="ma-2 mt-5"
            rounded
            outlined
            large
          >
            Certifícate
          </v-btn>
        </a>
      </v-col>
    </v-row>
    <!-- <v-btn
      dark
      @click="snackbar = true"
    >
      Open Snackbar
    </v-btn> -->
    <v-dialog
      v-model="dialog"
      transition="dialog-top-transition"
      max-width="600"
    >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
        >From the top</v-btn>
      </template> -->
      <template v-slot:default="dialog">
        <v-card>
          <v-card-text>
            <v-img :src="imgSelect" />
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="dialog.value = false"
            >Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="-1"
      outlined
      top
      right
    >
      {{ textSnack }}
      <v-progress-linear
        indeterminate
        color="black"
      />
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as nearAPI from 'near-api-js'
  import { CONFIG } from '~/services/api'
  const { connect, keyStores, WalletConnection, Contract } = nearAPI
  const CONTRACT_NAME = "certificate.nearcertificate.testnet";
  export default {
    name: 'DashboardDashboard',
    data () {
      return {
        dataCertificates: [],
        busqueda: false,
        snackbar: false,
        textSnack: 'Cargando',
        title: 'No tiene certificados',
        imgSelect: '',
        dialog: false,
      }
    },
    mounted() {
      if (localStorage.accountSearch !== localStorage.accountId && localStorage.accountSearch !== '') {
        this.busqueda = true
        this.viewCertificates(localStorage.accountSearch)
      } else {
        this.busqueda = false
        this.title = 'Mis Certificados'
        this.viewCertificates(localStorage.accountId)
      }
    },
    methods: {
      verNearHispano () {
        this.$router.push('https://educacion.nearhispano.org/')
      },
      async viewCertificates (accountId) {
        this.snackbar = true
        //alert(accountId)
        // connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // create wallet connection
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          viewMethods: ["get_certificate_list"],
          sender: wallet.account(),
        });
        await contract.get_certificate_list({
          account_id: accountId,
          // account_id: 'lindaley16.testnet',
        }).then((response) => {
          this.dataCertificates = response
          this.snackbar = false
          // console.log(this.dataCertificates);
          if (this.busqueda) {
            this.title = 'Certificados de ' + this.dataCertificates[0].nombre
            localStorage.accountSearch = ''
          } 
        }).catch((err) => {
          console.log(err)
          this.snackbar = false
        });
      },
      async mintCertificate (id) {
        this.snackbar = true
        // connect to NEAR
        const near = await connect(
          CONFIG(new keyStores.BrowserLocalStorageKeyStore())
        );
        // create wallet connection
        const wallet = new WalletConnection(near);
        const contract = new Contract(wallet.account(), CONTRACT_NAME, {
          changeMethods: ["nft_mint"],
          sender: wallet.account(),
        });
        await contract.nft_mint({
          certificate_id: id,
        },
          '300000000000000',
          '15970000000000000000000'
        ).then(response => {
           console.log(response)
           this.snackbar = false
        }).catch((err) => {
          this.snackbar = false
          console.log(err)
        });
      },
      download (url, certificacion) {
        axios({
          url: url,
          method: 'GET',
          responseType: 'blob'
        }).then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', certificacion + '.png')
          document.body.appendChild(link)
          link.click()
        }).catch(error => {
          console.log(error)
        })
      },
      reload () {
        this.$router.go(0)
      },
      viewImg (img) {
        this.imgSelect = img
        this.dialog = true
      },
    }
  }
</script>
