<script>
import VueTidyRoutes from 'vue-tidyroutes'
// import categorySearch from '../components/category-search'
// import cardView from '../components/card-view'
import axios from 'axios'

let Home = {
  name: 'home',
  // components: {
  //   categorySearch: categorySearch,
  //   cardView: cardView,
  // },
  el: '#home',
  data() {
    return {
      yelp: process.env.VUE_APP_YELP,
      api: process.env.VUE_APP_API,
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
  methods: {
    addCategory(alias, index) {
      this.selectedCategories.push(alias)
      this.suggestions.splice(index, 1)
    },
    removeCategory(selected, index) {
      this.categories.splice(index, 1)
      this.suggestions.unshift(selected)
    },
    newSearch() {
      this.restaurant = []
      this.image = null
      this.search = {}
      this.showCards = false
    },
    nextCard() {
      this.lastRestaurantId = this.restaurant[0].id
      this.restaurant.shift()
    },
    stackDeck() {
      const vm = this
      if (vm.restaurant.length <= 3) vm.processing = true
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
        .then(response => {
          if (response.data.businesses.length && response.data.businesses[0].image_url !== '') {
            vm.restaurant.push(response.data.businesses[0])
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
    searchYelp(res) {
      const vm = this
      const categoryArray = []
      vm.showCards = true
      vm.search.categories.map(x => categoryArray.push(x.alias))
      vm.categoryString = categoryArray.join(',')
      if (res !== null) {
        const position = res
        vm.latitude = position.coords.latitude
        vm.longitude = position.coords.longitude
        vm.location = { latitude: vm.latitude, longitude: vm.longitude }
      } else {
        vm.location = { location: vm.search.manualLocation }
      }
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
        .then(function(response) {
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
        .then(response => {
          if (response.data.businesses.length && response.data.businesses[0].image_url !== '') {
            vm.restaurant.push(response.data.businesses[0])
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
  watch: {
    restaurant: {
      handler: function(val, _oldVal) {
        if (val.length >= 1 && val.length <= 5) this.stackDeck()
      },
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
  .home.vp-pad(:class="{darken: showCards}")
    transition(name="custom-classes-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut")
      category-search(v-if="!processing && restaurant.length === 0" @search="(val) => getLocationAndSearch(val)" @remove="removeCategory" @suggestions="val => this.suggestions = val" :manualInput="this.manualInput" :selectedCategories="this.selectedCategories")
    .suggestions
      template(v-for="(suggestion, index) in suggestions")
        .pill.hover(@click="addCategory(suggestion, index)") {{ suggestion.title }}
    transition(name="custom-classes-transition" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight")
      card-view(v-if="showCards" :restaurant="restaurant[0]" :image="restaurant[0].image_url" @next="nextCard")
    button(v-if="!processing && showCards" @click="newSearch") New Search
</template>
<style lang="postcss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & .suggestions {
    display: flex;
    justify-content: space-evenly;
    margin: auto;
    flex-wrap: wrap;
    padding: 2rem;
    border: 4px solid pink;
    border-radius: 15px;
  }
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
