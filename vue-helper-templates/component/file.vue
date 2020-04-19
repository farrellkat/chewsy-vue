<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: '{{{componentName}}}',
  data() {
    return {}
  },
  computed: {
    ...mapGetters({}),
    ...mapState({}),
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({}),
  },
}
</script>
<template lang="pug">
.{{{componentName}}}(data-cy='{{{fileName}}}') Hello from {{{componentName}}} component
</template>
<style lang="postcss" scoped>
.{{{componentName}}} {}
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
