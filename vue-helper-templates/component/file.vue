<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default  {
  name: '{{{componentName}}}',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
    }),
    ...mapState({
    }),
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
    }),
  },
}
</script>
<template lang="pug">
.{{{componentName}}}(data-cy='{{{fileName}}}') Hello from {{{componentName}}} component
</template>
<style lang="postcss" scoped>
.{{{componentName}}} {}
</style>
