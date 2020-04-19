<script>
export default {
  name: 'navbar',
  props: ['darken'],
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>
<template lang="pug">
.navbar(:class="darken ? 'darken' : 'lighten'")
  router-link(to="/home") Home
  span |
  router-link(to="/about") About
</template>
<style lang="postcss" scoped>
.navbar {
  background-color: transparent;
  padding: 30px;

  & a {
    font-weight: bold;
    color: #2c3e50;
  }

  & a.router-link-exact-active {
    color: #42b983;
  }
  & span {
    margin: 0 2rem;
  }
  & .dark {
    background-color: black;
  }
}
/* .navbar.darken {
  background-color: var(--dark-blue);
  background-image: none !important;
  -o-animation: fade-to-dark 1s forwards;
  animation: fade-to-dark 1s forwards;
}
.navbar.lighten {
  background-color: white;
  background-image: none !important;
  -o-animation: fade-to-light 1s forwards;
  animation: fade-to-light 1s forwards;
} */
</style>
