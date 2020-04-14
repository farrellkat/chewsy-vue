<script>
import categoriesJSON from '../../categories.json'

export default {
  name: 'category-search',
  props: ['manualInput'],
  data() {
    return {
      term: '',
      categoriesJSON,
      suggestions: null,
      categories: [],
      manualLocation: '',
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
    searchYelp() {
      const search = {
        categories: this.categories,
        radius: this.radius,
        manualLocation: this.manualLocation,
      }
      this.$emit('search', search)
    },
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
  button(@click="searchYelp") search
</template>
<style lang="postcss" scoped>
.search {
}
</style>
