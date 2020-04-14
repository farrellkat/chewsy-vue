<script>
export default {
  name: 'card-view',
  props: ['restaurant', 'image'],
  data() {
    return {}
  },
  methods: {
    next() {
      this.$emit('next')
    },
  },
}
</script>
<template lang="pug">
.card-view(data-cy='card-view')
  .restaurant-info(v-if="restaurant") 
    h1.name {{ restaurant.name }}
    .price Price: {{ restaurant.price}}
    .address
      span(v-for="address in restaurant.location.display_address") {{ address }}
      a(:href="`tel:${restaurant.phone}`") {{ restaurant.display_phone }}
    .image-holder(@click="next")
      img(:src="image")
</template>
<style lang="postcss" scoped>
.card-view {
  width: 18rem;
  margin: auto;
  & .restaurant-info,
  & .image-holder,
  & img {
    width: inherit;
  }

  & .restaurant-info {
    padding: 2rem;
    border: 2px solid teal;
    border-radius: 4px;
  }
  & .price,
  & .name  {
    text-align: left;
  }
  & .address {
    display: grid;
    grid-template-rows: auto auto auto;
    text-align: left;
    margin-bottom: 2rem;
  }
}
</style>
