<script>
export default {
  name: 'default',
  data() {
    return {}
  },
  computed: {
    darken() {
      return this.$route.name === 'cards'
    },
  },
  methods: {},
}
</script>
<template lang="pug">
.default(:class="darken ? 'darken' : 'lighten'")
  layout-navbar
  router-view
</template>
<style lang="postcss" scoped>
.default {
  border-radius: 15px;
  height: inherit;
  width: 30rem;
  margin: auto;
  overflow: hidden;
}
.default.darken {
  background-color: var(--dark-blue);
  background-image: none !important;
  -o-animation: fade-to-dark 1s forwards;
  animation: fade-to-dark 1s forwards;
}
.default.lighten {
  background-color: white;
  background-image: none !important;
  -o-animation: fade-to-light 1s forwards;
  animation: fade-to-light 1s forwards;
}
/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
}
</style>
