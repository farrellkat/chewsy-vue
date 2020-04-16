<script>
import categoriesJSON from '../../categories.json'

export default {
  name: 'category-search',
  props: ['manualInput'],

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
      suggestions: filtered,
      categories: [],
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
    addCategory(alias, index) {
      this.categories.push(alias)
      this.suggestions.splice(index, 1)
    },
    removeCategory(selected, index) {
      this.categories.splice(index, 1)
      this.suggestions.unshift(selected)
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
        vm.suggestions = prediction
      }
    },
  },
  watch: {
    term() {
      if (this.term === '') {
        this.suggestions = this.filtered
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
        .circle.hover(@click="selectRadius(option.value)" :class="active(option.value)")
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
  //- h1(v-if="location") in {{ location }}
  .suggestions
    template(v-for="(suggestion, index) in suggestions")
      .pill(@click="addCategory(suggestion, index)") {{ suggestion.title }}
</template>
<style lang="postcss" scoped>
.category-search {
  & h1 {
    margin: 0 0 1rem 0;
  }
  & input {
    border: 1px solid pink;
    border-radius: 30px;
    padding: 0.5rem;
    flex-basis: 30%;
    font-size: 2rem;
    text-indent: 1rem;
  }
  & /deep/ input:focus {
    border: 1px solid cadetblue;
    outline: none;
  }
  & .search-form {
    display: flex;
    margin: auto;
    justify-content: space-between;
    padding: 0rem 2rem 1rem 2rem;
    align-items: center;
    & button {
      border: 2px solid pink;
      padding: 1rem 2rem;
      border-radius: 4px;
      color: pink;
      font-family: helvetica;
      font-weight: bold;
      font-size: 1rem;
    }
    & button:hover {
      background-color: pink;
      color: white;
      cursor: pointer;
    }
  }
  & .suggestions {
    display: flex;
    justify-content: space-evenly;
    margin: auto;
    flex-wrap: wrap;
    padding: 2rem;
    border: 4px solid pink;
    border-radius: 15px;
  }
  & .pill {
    padding: 1rem;
    margin: 0.5rem;
    background-color: pink;
    border-radius: 20px;
    display: flex;
    & .close {
      margin-left: 1rem;
    }
  }
  & .pill:hover {
    cursor: pointer;
  }
  & .selected-categories {
    display: flex;
    margin: auto;
    justify-content: center;
    padding-bottom: 2rem;
  }
  & .radius {
    flex-basis: 70%;
    display: flex;
    justify-content: space-evenly;
    & .circle {
      height: 75px;
      width: 75px;
      border-radius: 50%;
      color: black;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    & .circle:hover:not(.active) {
      /* border: 1px solid pink; */
      background-color: rgb(255, 248, 249);
    }
    & .circle-name {
    }
  }
  & .hover {
    cursor: pointer;
  }
  & .circle.active {
    background: pink;
    border: none;
    color: white;
  }
}
</style>
