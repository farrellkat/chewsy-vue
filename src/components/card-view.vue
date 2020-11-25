<script>
export default {
  name: 'card-view',
  data() {
    return {}
  },
  methods: {
    next() {
      this.$emit('next')
    },
    newSearch() {
      this.$emit('newSearch')
    },
  },
  computed: {
    restaurant() {
      return this.$attrs.params.restaurant[0]
    },
  },
}
</script>
<template lang="pug">
.card-view(data-cy='card-view')
  .vp-panel.white
    .loading(v-if="restaurant === undefined") Loading...
  .restaurant-info(v-if="restaurant") 
    //- h1.name {{ restaurant.name }}
    //- .price Price: {{ restaurant.price}}
    //- .address
    //-   span(v-for="address in restaurant.location.display_address") {{ address }}
    //-   a(:href="`tel:${restaurant.phone}`") {{ restaurant.display_phone }}
    .image-holder(@click="next")
      img(:src="restaurant.image_url")
  button(v-if="restaurant !== undefined" @click="newSearch") New Search
</template>
<style lang="postcss" scoped>
.card-view {
  width: -webkit-fill-available;
  & .vp-panel {
    border-radius: 15px;
    & .loading {
      padding: 2rem;
    }
  }
  & .restaurant-info {
    width: -webkit-fill-available;
    margin: auto;
    padding: 2rem;
    background-color: white;
    border-radius: 15px;
    margin-bottom: 1rem;
    & .image-holder {
      border-radius: 15px;
      width: inherit;
      overflow: hidden;
      display: flex;
      justify-content: center;
    }
    & .restaurant-info,
    & .image-holder,
    & img {
      width: inherit;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    & .price,
    & .name {
      text-align: left;
    }
    & .address {
      display: grid;
      grid-template-rows: auto auto auto;
      text-align: left;
      margin-bottom: 2rem;
    }
  }
}
</style>
