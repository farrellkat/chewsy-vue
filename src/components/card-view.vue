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
.card-view(data-cy='card-view') Hello from card-view component
  .restaurant-info(v-if="restaurant") 
    h1 {{ restaurant.name }}
    h4 {{ restaurant.price}}
    span(v-for="address in restaurant.location.display_address")
      span {{ address }}
      br
    a(:href="`tel:${restaurant.phone}`") {{ restaurant.display_phone }}
    .image-holder(@click="next")
      img(:src="image")
</template>
<style lang="postcss" scoped>
.card-view {
}
</style>
