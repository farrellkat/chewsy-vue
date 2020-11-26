<script>
import categoriesJSON from '../../categories.json'

export default {
  name: 'category-search',

  data() {
    const params = this.$attrs.params
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
      showLocationLink: true,
      location: params.formattedLocation,
      categories: this.$attrs.params.selectedCategories || [],
      manualLocation: '',
      radius: null,
      inputPlaceholder: 'Determining your location...',
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
    showManualLocation() {
      this.$emit('manual', true)
      this.showLocationLink = false
    },
    saveManualLocation() {
      this.$emit('saveLocation', this.manualLocation)
      this.showLocationLink = true
    },
    findMyLocation() {
      this.inputPlaceholder = 'Determining your location...'
      this.manualLocation = ''
      this.$emit('findMyLocation')
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
    '$attrs.params': {
      handler(newVal) {
        if (newVal.processing === false) this.inputPlaceholder = 'Search ' + newVal.formattedLocation
      },
    },
  },
}
</script>
<template lang="pug">
.category-search(v-if='showLocationLink')
  .search-form
    .input-grid
      input#search(
        autocomplete='off',
        v-model='term',
        @input='autocomplete',
        @focus='inputPlaceholder = ""',
        @blur='inputPlaceholder = "Search " + location',
        :placeholder='inputPlaceholder',
        v-lowercase
      )
      i.material-icons(@click='showManualLocation', v-if='showLocationLink') edit_location
      i.material-icons(@click='findMyLocation', v-if='showLocationLink') my_location
    .radius 
      template(v-for='option in options')
        .circle-select.hover(@click='selectRadius(option.value)', :class='active(option.value)')
          .circle-name {{ option.string }}
    .selected-categories(v-if='categories.length')
      template(v-for='(selected, index) in categories')
        .pill.delete-pill.inverse.hover(@click='removeCategory(selected, index)') {{ selected.title }}
          .close x
    button(:class="{dim: !categories.length}", @click='searchYelp') search
.manual-input(v-else)
  h2 Enter your location
  .location-grid
    input(v-model='manualLocation', placeholder='e.g. Nashville, TN 37206')
    button.save-location(@click='saveManualLocation') save
</template>
<style lang="postcss" scoped>
.category-search {
  width: 100%;
  margin-bottom: 1rem;
  & h1 {
    margin: 0 0 1rem 0;
  }
  & .search-form {
    padding: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      'input'
      'radius'
      'selected'
      'search';
    & input {
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
    overflow: scroll;
    padding: 0 0 1rem 0;
    & .pill.inverse {
      margin-right: 0.5rem;
    }
  }
  & .radius {
    padding: 1rem 0;
    grid-area: radius;
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
.dim {
  opacity: 0.25;
}
.input-grid {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  grid-gap: 1rem;
  & input {
    width: 100%;
    padding-right: 0;
    padding-left: 0;
  }
}
.location-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  margin: 0 1rem;
}
.save-location {
  display: flex;
  background-color: goldenrod;
  height: 100%;
  justify-content: center;
  align-items: center;
  width: 36px;
  border-radius: 30px;
}
.manual-input {
  width: 100%;
  padding: 2rem;
  display: inline;
  & h2 {
    margin-top: 0;
  }
  & input {
    border-radius: 30px 0 0 30px;
    border-right: 0;
  }
  & button {
    width: 6rem;
    border-radius: 0 30px 30px 0;
    background: goldenrod;
    color: white;
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
