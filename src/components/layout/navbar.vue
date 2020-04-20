<script>
export default {
  name: 'navbar',
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>
<template lang="pug">
//- .navbar
//-   router-link(to="/home/search") Home
//-   span |
//-   router-link(to="/about") About
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
</style>
