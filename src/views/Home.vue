<script>
import axios from 'axios'
import VueTidyRoutes from 'vue-tidyroutes'
import categorySearch from '../components/category-search'

let Home = {
  name: 'home',
  components: {
    categorySearch: categorySearch,
  },
  data() {
    return {
      categoriesJSON,
      term: '',
      yelp: process.env.VUE_APP_YELP,
      api: process.env.VUE_APP_API,
      latitude: '',
      longitude: '',
      restaurant: null,
      image: null,
    }
  },
  computed: {},
  methods: {
    searchYelp(res) {
      const vm = this
      const categoryArray = []
      vm.categories.map(x => categoryArray.push(x.alias))
      let categoryString = categoryArray.join(',')
      let location = {}
      if (res !== null) {
        const position = res
        vm.latitude = position.coords.latitude
        vm.longitude = position.coords.longitude
        location = { latitude: vm.latitude, longitude: vm.longitude }
      } else {
        location = { location: vm.manualLocation }
      }
      return axios
        .get(vm.api, {
          params: {
            ...location,
            radius: vm.radius,
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
              radius: vm.radius,
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
          if (response.data.businesses.length) {
            vm.restaurant = response.data.businesses[0]
            vm.image = response.data.businesses[0].image_url
          } else {
            vm.searchYelp
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    async getLocationAndSearch() {
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
  .search
    categorySearch
    .restaurant-info(v-if="restaurant") 
      h1 {{ restaurant.name }}
      h4 {{ restaurant.price}}
      span(v-for="address in restaurant.location.display_address")
        span {{ address }}
        br
      a(:href="`tel:${restaurant.phone}`") {{ restaurant.display_phone }}
      span(v-touch:swipe="swipeHandler")
        img(:src="image")
      
</template>
