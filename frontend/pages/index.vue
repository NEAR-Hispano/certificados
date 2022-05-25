<template>
  <div class="container">
    <aside class="text-h2 font-weight-bold text-center mt-8">
      Mis Certificados
    </aside>
    <v-row class="mt-5">
      <v-col
        v-for="item, i in dataCertificates"
        :key="i"
        class="col-3"
      >
        <viewer>
          <v-card class="mx-auto">
            <v-img
              class="white--text align-end"
              height="200px"
              :src="item.img"
            />
            <v-card-actions>
              <v-btn
                color="orange"
                text
                @click="mintCertificate(item.id)"
              >
                Mintear
              </v-btn>
              <v-btn
                :href="item.img"
                download
                color="orange"
                text
                @click="download(item.img, item.certificacion)"
              >
                Descargar
              </v-btn>
              <!-- <a
                :href="item.img"
                download
                class="btn btn-success"
              >
                Descargar imagen
              </a> -->
            </v-card-actions>
          </v-card>
        </viewer>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col class="col-6 offset-3">
        <aside class="text-h4 font-weight-medium text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </aside>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-8 offset-2 text-center">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, deleniti obcaecati sed facilis, iste, ipsa voluptates suscipit ullam dolore quos sunt culpa officia vitae error quo at in eum commodi!
        </p>
        <a href="https://educacion.nearhispano.org/">
          <v-btn
            class="ma-2 mt-5"
            rounded
            outlined
            large
          >
            Certificate
          </v-btn>
        </a>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
  import * as nearAPI from 'near-api-js'
  import { CONFIG } from '~/services/api'
  const { connect, keyStores, WalletConnection, Contract } = nearAPI
  const CONTRACT_NAME = "nft.nearcertificate.testnet";
  export default {
    name: 'DashboardDashboard',
    data () {
      return {
        itemsCertificados: [
          { img: require('../assets/img/certificado.png') },
          { img: require('../assets/img/certificado.png') },
          { img: require('../assets/img/certificado.png') },
          { img: require('../assets/img/certificado.png') },
        ],
        dataCertificates: [],
      }
    },
    mounted() {
      if (localStorage.accountSearch !== '') {
        this.viewCertificates(localStorage.accountSearch)
      } else {
        this.viewCertificates(localStorage.accountId)
      }
    },
    methods: {
      verNearHispano () {
        this.$router.push('https://educacion.nearhispano.org/')
      },
      async viewCertificates (accountId) {
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
        }).then((response) => {
          this.dataCertificates = response
          console.log(this.dataCertificates);
          localStorage.accountSearch = ''
        }).catch((err) => {
          console.log(err)
        });
      },
      async mintCertificate (id) {
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
        }).then(response => {
           console.log(response)
        }).catch((err) => {
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
          link.setAttribute('download', 'certificado-' + certificacion + '.png')
          
          document.body.appendChild(link)
          link.click()
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>
