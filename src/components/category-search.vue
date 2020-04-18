<script>
import categoriesJSON from '../../categories.json'

export default {
  name: 'category-search',
  props: ['manualInput', 'selectedCategories'],

  data() {
    const all = categoriesJSON.filter(x => x.parents.find(y => y === 'food' || y === 'restaurants'))
    let filtered = all.reduce((a, c) => {
      if (
        (c.country_whitelist?.find(x => x === 'US') && c.country_blacklist?.find(y => y === 'US') === undefined) ||
        c.country_whitelist === undefined
      ) {
        a.push(c)
      }
      return a
    }, [])
    return {
      term: '',
      filtered: filtered,
      categoriesJSON,
      // suggestions: filtered,
      categories: this.selectedCategories || [],
      manualLocation: '',
      radius: null,
      options: [
        { string: '1 mile', value: 1609 },
        { string: '3 miles', value: 1609 * 3 },
        { string: '5 miles', value: 1609 * 5 },
        { string: '10 miles', value: 1609 * 10 },
      ],
    }
  },
  methods: {
    active(val) {
      return val === this.radius ? 'active' : ''
    },
    selectRadius(val) {
      this.radius = val
    },
    searchYelp() {
      const search = {
        categories: this.categories,
        radius: this.radius,
        manualLocation: this.manualLocation,
      }
      this.$emit('search', search)
    },
    removeCategory(selected, index) {
      this.$emit('remove', selected, index)
    },
    autocomplete() {
      const vm = this
      if (vm.term.length >= 1) {
        let filterWithoutSelected = vm.filtered.reduce((a, c) => {
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
        this.$emit('suggestions', prediction)
        // vm.suggestions = prediction
      }
    },
  },
  watch: {
    term() {
      if (this.term === '') {
        this.$emit('suggestions', this.filtered)
      }
    },
  },
}
</script>
<template lang="pug">
.category-search
  .search-form
    input(id="search" autocomplete="off" v-model="term" @input="autocomplete" placeholder="Search categories" v-lowercase)
    .radius 
      template(v-for="option in options")
        .circle-select.hover(@click="selectRadius(option.value)" :class="active(option.value)")
          .circle-name {{ option.string }}
    button(@click="searchYelp") search
    .manual-input(v-if="manualInput")
      label(for='city-input') Location
      input(id='city-input' v-model="manualLocation")
  h1(v-if="categories.length") Show me
  .selected-categories
    template(v-for="(selected,index) in categories")
      .pill(@click="removeCategory(selected,index)") {{ selected.title }}
        .close x
</template>
<style lang="postcss" scoped>
.category-search {
  & h1 {
    margin: 0 0 1rem 0;
  }
  & .search-form {
    display: flex;
    margin: auto;
    justify-content: center;
    flex-wrap: wrap;
    /* padding: 0rem 2rem 1rem 2rem; */
    align-items: center;
  }
  & .selected-categories {
    display: flex;
    margin: auto;
    justify-content: center;
    padding-bottom: 2rem;
  }
  & .radius {
    display: flex;
    justify-content: space-evenly;
    padding: 1rem 1rem;
    width: 100%;
    flex-basis: 70%;
  }
}

@media (min-width: 992px) {
  .category-search {
    width: 100%;
    & .search-form {
      flex-wrap: nowrap;
      width: 75%;
    }
    & .radius {
      flex-basis: 70%;
    }
  }
}
@media (min-width: 1200px) {
  .category-search {
    width: 100%;
    & .search-form {
      flex-wrap: nowrap;
      width: 50%;
    }
  }
}
</style>
