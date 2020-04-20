<script>
import categoriesJSON from '../../categories.json'

export default {
  name: 'category-search',

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
      categories: this.$attrs.params.selectedCategories || [],
      manualLocation: '',
      radius: null,
      inputPlaceholder: 'Search categories',
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
      this.$router.push({ name: 'cards' }).catch(err => {
        console.log(err)
      })
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
      }
    },
  },
  mounted() {
    this.$emit('suggestions', this.filtered)
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
    input(id="search" autocomplete="off" v-model="term" @input="autocomplete" @focus="inputPlaceholder = ''" @blur="inputPlaceholder = 'Search categories'" :placeholder="inputPlaceholder" v-lowercase)
    .radius 
      template(v-for="option in options")
        .circle-select.hover(@click="selectRadius(option.value)" :class="active(option.value)")
          .circle-name {{ option.string }}
    .selected-categories
      template(v-for="(selected,index) in categories")
        .pill.delete-pill.inverse.hover(@click="removeCategory(selected,index)") {{ selected.title }}
          .close x
    button(v-if="categories.length" @click="searchYelp") search
    .manual-input(v-if="this.$attrs.params.manualInput")
      label(for='city-input') Location
      input(id='city-input' v-model="manualLocation")
</template>
<style lang="postcss" scoped>
.category-search {
  width: 100%;
  margin-bottom: 1rem;
  & h1 {
    margin: 0 0 1rem 0;
  }
  & .search-form {
    display: grid;
    grid-row-gap: 1rem;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas:
      '. input .'
      '. radius. '
      'selected selected selected '
      '. search. ';
    & input {
      grid-area: input;
      text-align: center;
      text-indent: 0;
    }
    & button {
      grid-area: search;
    }
  }
  & .selected-categories {
    grid-area: selected;
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  & .radius {
    grid-area: radius;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  .search-form {
    margin: auto;
  }
}

@media (min-width: 992px) {
  .category-search {
    width: 100%;
    & .search-form {
      width: 100%;
      grid-template-columns: 3fr 2fr 1fr;
      grid-column-gap: 4rem;
      grid-template-areas:
        'input radius search'
        'selected selected selected';
    }
  }
}
@media (min-width: 1200px) {
}
</style>
