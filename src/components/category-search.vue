<script>
import categoriesJSON from '../../categories.json'
import axios from 'axios'

export default {
  name: 'category-search',
  data() {
    return {
      yelp: process.env.VUE_APP_YELP,
      api: process.env.VUE_APP_API,
      latitude: '',
      longitude: '',
      term: '',
      categoriesJSON,
      suggestions: null,
      categories: [],
      manualInput: false,
      manualLocation: '',
      totalRestaurants: null,
      radius: null,
      options: [
        { string: 'Choose one', value: null },
        { string: '1 mile', value: 1609 },
        { string: '3 miles', value: 1609 * 3 },
        { string: '5 miles', value: 1609 * 5 },
        { string: '10 miles', value: 1609 * 10 },
      ],
    }
  },
  computed: {
    filterCategories() {
      const all = this.categoriesJSON.filter(x => x.parents.find(y => y === 'food' || y === 'restaurants'))
      let filtered = all.reduce((a, c) => {
        if (
          (c.country_whitelist?.find(x => x === 'US') && c.country_blacklist?.find(y => y === 'US') === undefined) ||
          c.country_whitelist === undefined
        ) {
          a.push(c)
        }
        return a
      }, [])
      return filtered
    },
  },
  methods: {
    addCategory(alias, index) {
      this.categories.push(alias)
      this.suggestions.splice(index, 1)
    },
    autocomplete() {
      const vm = this
      if (vm.term.length >= 1) {
        let filterWithoutSelected = vm.filterCategories.reduce((a, c) => {
          if (vm.categories.find(x => x.alias === c.alias) === undefined) {
            a.push(c)
          }
          return a
        }, [])
        const prediction = filterWithoutSelected.reduce((a, c) => {
          if (c.title.toLowerCase().includes(vm.term.toLowerCase())) {
            a.push(c)
          }
          return a
        }, [])
        vm.suggestions = prediction
      }
    },
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
</script>
<template lang="pug">
.category-search Hello from search component
  .selected-categories(v-for="(selected,index) in categories")
    .pill {{ selected.title }}
  .search-form
    label(for="search") Search
    input(id="search" v-model="term" @input="autocomplete" v-lowercase)
  .suggestions(v-for="(suggestion, index) in suggestions")
    .pill(@click="addCategory(suggestion, index)") {{ suggestion.title }}
  .radius 
    label(for="radius") Radius
      select(v-model="radius" id="radius")
        option(v-for="option in options" :value="option.value") {{ option.string }}
  .manual-input(v-if="manualInput")
    label(for='city-input') Location
    input(id='city-input' v-model="manualLocation")
</template>
<style lang="postcss" scoped>
.search {
}
</style>
