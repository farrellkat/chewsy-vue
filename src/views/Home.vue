<script>
import VueTidyRoutes from 'vue-tidyroutes'
import axios from 'axios'
import Search from '../components/category-search'
import Cards from '../components/card-view'

let Home = {
  data() {
    return {
      yelp: process.env.VUE_APP_YELP,
      api: process.env.VUE_APP_API,
      key: process.env.VUE_APP_GOOGLE_KEY,
      geo: process.env.VUE_APP_GOOGLE_URL,
      formattedLocation: '',
      position: '',
      processing: false,
      restaurant: [],
      image: null,
      latitude: '',
      longitude: '',
      totalRestaurants: null,
      search: {},
      manualInput: false,
      showCards: false,
      categoryString: '',
      location: {},
      lastRestaurantId: '',
      suggestions: '',
      selectedCategories: [],
    }
  },
  computed: {},
  async mounted() {
    await this.getLocation()
  },
  methods: {
    getLocation() {
      const vm = this
      this.processing = true
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
        .then((resolve) => {
          vm.latitude = resolve.coords.latitude
          vm.longitude = resolve.coords.longitude
          vm.location = { latitude: vm.latitude, longitude: vm.longitude }
          vm.reverseGeo()
        })
        .catch((_reject) => {
          if (!this.manualInput) {
            window.alert('Could not find your location')
            this.manualInput = true
            this.processing = false
          }
        })
    },
    getLatLong(location) {
      const vm = this
      const convertedLocation = location.split(' ').join('+')
      axios
        .get(vm.geo, {
          params: {
            address: convertedLocation,
            key: vm.key,
          },
        })
        .then(function (response) {
          console.log(response)
          const result = response.data.results[0]
          vm.latitude = result.geometry.location.lat
          vm.longitude = result.geometry.location.lng
          vm.location = { latitude: vm.latitude, longitude: vm.longitude }
        })
    },
    reverseGeo() {
      const vm = this
      axios
        .get(vm.geo, {
          params: {
            latlng: vm.latitude + ',' + vm.longitude,
            key: vm.key,
          },
        })
        .then(function (response) {
          console.log(response)
          vm.formattedLocation =
            response.data.results[4].address_components[0].long_name +
            ', ' +
            response.data.results[4].address_components[3].short_name
          vm.processing = false
        })
    },
    updateLocation(location) {
      this.formattedLocation = location
      this.location = location
      this.getLatLong(location)
    },
    addCategory(alias, index) {
      this.selectedCategories.push(alias)
      this.suggestions.splice(index, 1)
    },
    removeCategory(selected, index) {
      this.selectedCategories.splice(index, 1)
      this.suggestions.unshift(selected)
    },
    newSearch() {
      this.restaurant = []
      this.image = null
      this.search = {}
      this.selectedCategories = []
      this.showCards = false
      this.getLocation()
      this.$router.push({ name: 'search' })
    },
    nextCard() {
      this.restaurant.shift()
    },
    stackDeck() {
      const vm = this
      if (vm.restaurant.length <= 2) vm.processing = true
      const offset = Math.floor(Math.random() * vm.totalRestaurants + 1)
      return axios
        .get(vm.api, {
          params: {
            ...vm.location,
            radius: vm.search.radius,
            categories: vm.categoryString,
            offset: offset,
            limit: 1,
          },
          headers: {
            Authorization: `Bearer ${vm.yelp}`,
          },
        })
        .then((response) => {
          if (response.data.businesses.length && response.data.businesses[0].image_url !== '') {
            vm.restaurant.push(response.data.businesses[0])
            vm.image = response.data.businesses[0].image_url
            vm.processing = false
          } else {
            vm.stackDeck
          }
        })
        .catch(function (error) {
          vm.processing = false
          console.log(error)
        })
    },
    searchYelp(search) {
      const vm = this
      vm.processing = true
      const categoryArray = []
      vm.suggestions = []
      search ? (this.search = search) : {}
      vm.showCards = true
      vm.search.categories.map((x) => categoryArray.push(x.alias))
      vm.categoryString = categoryArray.join(',')
      return axios
        .get(vm.api, {
          params: {
            ...vm.location,
            radius: vm.search.radius,
            categories: vm.categoryString,
          },
          headers: {
            Authorization: `Bearer ${vm.yelp}`,
          },
        })
        .then(function (response) {
          if (response.data.total === 0) {
            vm.$router.push({ name: 'search' })
            window.alert('no matches found')
          }
          response.data.total >= 1000 ? (vm.totalRestaurants = 999) : (vm.totalRestaurants = response.data.total)
          const offset = Math.floor(Math.random() * vm.totalRestaurants + 1)
          return axios.get(vm.api, {
            params: {
              ...vm.location,
              radius: vm.search.radius,
              categories: vm.categoryString,
              offset: offset,
              limit: 1,
            },
            headers: {
              Authorization: `Bearer ${vm.yelp}`,
            },
          })
        })
        .then((response) => {
          if (response.data.businesses.length && response.data.businesses[0].image_url !== '') {
            vm.restaurant.push(response.data.businesses[0])
            vm.image = response.data.businesses[0].image_url
            vm.processing = false
          } else {
            vm.searchYelp
          }
        })
        .catch(function (error) {
          vm.processing = false
          console.log(error)
        })
    },
    // async getLocationAndSearch(search) {
    //   this.suggestions = []
    //   this.processing = true
    //   search ? (this.search = search) : {}
    //   return new Promise(function(resolve, reject) {
    //     navigator.geolocation.getCurrentPosition(resolve, reject)
    //   })
    //     .then(resolve => {
    //       this.searchYelp(resolve)
    //     })
    //     .catch(_reject => {
    //       if (!this.manualInput) {
    //         window.alert('Could not find your location')
    //         this.manualInput = true
    //         this.processing = false
    //       } else {
    //         this.searchYelp(null)
    //       }
    //     })
    // },
  },
  watch: {
    restaurant: {
      handler: function (val, _oldVal) {
        if (val.length >= 1 && val.length <= 5) this.stackDeck()
      },
    },
  },
}
VueTidyRoutes.route(`/home`, {
  name: 'home',
  component: Home,
  children: [
    {
      name: 'search',
      path: 'search',
      component: Search,
      props: true,
    },
    {
      name: 'cards',
      path: 'cards',
      component: Cards,
      props: true,
    },
  ],
})

export default Home
</script>

<template lang="pug">
.home.vp-panel.vp-pad
  router-view(
    @search='(val) => searchYelp(val)',
    @newSearch='newSearch',
    @remove='removeCategory',
    @manual='(val) => (this.manualInput = val)',
    @saveLocation='(val) => updateLocation(val)',
    @findMyLocation='getLocation()',
    @suggestions='(val) => (this.suggestions = val)',
    @next='nextCard',
    :params='{ selectedCategories, manualInput, restaurant, processing, formattedLocation }'
  ) 
  .suggestions
    template(v-for='(suggestion, index) in suggestions')
      .pill.hover(@click='addCategory(suggestion, index)') {{ suggestion.title }}
</template>
<style lang="postcss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  & button {
    margin-top: 1rem;
  }
  & .suggestions {
    display: flex;
    justify-content: space-around;
    margin: auto;
    border-radius: 15px;
    padding: 1rem 0;
    flex-wrap: wrap;
  }
}
</style>
