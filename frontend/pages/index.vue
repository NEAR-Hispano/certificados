<template>
  <div class="container">
    <aside class="text-h2 font-weight-bold text-center mt-8">
      Mis Certificados
    </aside>
    <v-row class="mt-5">
      <v-col
        v-for="item, i in itemsCertificados"
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
              >
                Mintear
              </v-btn>
              <v-btn
                :href="item.img"
                download
                color="orange"
                text
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
        <nuxt-link to="https://educacion.nearhispano.org/">
          <v-btn
            class="ma-2 mt-5"
            rounded
            outlined
            large
          >
            Certificate
          </v-btn>
        </nuxt-link>
        
      </v-col>
    </v-row>
  </div>
</template>

<script>
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
      }
    },
    methods: {
      verNearHispano () {
        this.$router.push('https://educacion.nearhispano.org/')
      }
    }
  }
</script>
