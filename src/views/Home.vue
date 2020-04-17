<script>
import VueTidyRoutes from 'vue-tidyroutes'
import categorySearch from '../components/category-search'
import cardView from '../components/card-view'
import axios from 'axios'

let Home = {
  name: 'home',
  components: {
    categorySearch: categorySearch,
    cardView: cardView,
  },
  el: '#home',
  data() {
    return {
      yelp: process.env.VUE_APP_YELP,
      api: process.env.VUE_APP_API,
      processing: false,
      restaurant: null,
      image: null,
      latitude: '',
      longitude: '',
      totalRestaurants: null,
      search: {},
      manualInput: false,
      showCards: false,
    }
  },
  computed: {},
  methods: {
    newSearch() {
      this.restaurant = null
      this.image = null
      this.search = {}
      this.showCards = false
    },
    searchYelp(res) {
      const vm = this
      const categoryArray = []
      vm.showCards = true
      vm.search.categories.map(x => categoryArray.push(x.alias))
      let categoryString = categoryArray.join(',')
      let location = {}
      if (res !== null) {
        const position = res
        vm.latitude = position.coords.latitude
        vm.longitude = position.coords.longitude
        location = { latitude: vm.latitude, longitude: vm.longitude }
      } else {
        location = { location: vm.search.manualLocation }
      }
      return axios
        .get(vm.api, {
          params: {
            ...location,
            radius: vm.search.radius,
            categories: categoryString,
          },
          headers: {
            Authorization: `Bearer ${vm.yelp}`,
          },
        })
        .then(function(response) {
          response.data.total >= 1000 ? (vm.totalRestaurants = 999) : (vm.totalRestaurants = response.data.total)
          const offset = Math.floor(Math.random() * vm.totalRestaurants + 1)
          return axios.get(vm.api, {
            params: {
              ...location,
              radius: vm.search.radius,
              categories: categoryString,
              offset: offset,
              limit: 1,
            },
            headers: {
              Authorization: `Bearer ${vm.yelp}`,
            },
          })
        })
        .then(response => {
          if (response.data.businesses.length && response.data.businesses[0].image_url !== '') {
            vm.restaurant = response.data.businesses[0]
            vm.image = response.data.businesses[0].image_url
            vm.processing = false
          } else {
            vm.searchYelp
          }
        })
        .catch(function(error) {
          vm.processing = false
          console.log(error)
        })
    },
    async getLocationAndSearch(search) {
      this.processing = true
      search ? (this.search = search) : {}
      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
        .then(resolve => {
          this.searchYelp(resolve)
        })
        .catch(_reject => {
          if (!this.manualInput) {
            window.alert('Could not find your location')
            this.manualInput = true
            this.processing = false
          } else {
            this.searchYelp(null)
          }
        })
    },
  },
}
VueTidyRoutes.route(`/home`, {
  name: 'home',
  component: Home,
})

export default Home
</script>

<template lang="pug">
  .home#home(:class="{darken: showCards}")
    transition(name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
      categorySearch(v-if="!processing && restaurant === null" @search="(val) => getLocationAndSearch(val)" :manualInput="this.manualInput")
    transition(name="custom-classes-transition" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight")
      cardView(v-if="!processing && showCards" :restaurant="this.restaurant" :image="this.image" @next="getLocationAndSearch")
    button(v-if="!processing && showCards" @click="newSearch") New Search
</template>
<style lang="postcss" scoped>
.home {
  padding: 2rem 20rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.darken {
  background-image: none !important;
  -o-animation: fadeIt 1s forwards;
  animation: fadeIt 1s forwards;
  height: 100vh;
}
@-o-keyframes fadeIt {
  0% {
    background-color: #ffffff;
  }
  100% {
    background-color: #272938;
  }
}
@keyframes fadeIt {
  0% {
    background-color: #ffffff;
  }
  100% {
    background-color: #272938;
  }
}
</style>
