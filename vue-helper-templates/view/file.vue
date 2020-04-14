<script>
import VueTidyRoutes from 'vue-tidyroutes'
import { GUID } from '@/AppConfig'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import spaceGuard from '@/mixins/spaceGuard'
import subscriptionGuard from '@/mixins/subscriptionGuard'

let {{{className}}} = {
  name: '{{{componentName}}}',
  mixins: [spaceGuard, subscriptionGuard],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
    }),
    ...mapState({
      // spaceGuard provided
      //spaceId: state => state.space.id, 
      //space: state => state.space
    }),
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
    }),
    spaceChange(){

    },
  },
  watch: {
    spaceId: {
      immediate: true,
      handler(val) {
        if (val && this.spaceChange) this.spaceChange()
      },
    },
  },
}

VueTidyRoutes.route(`/:spaceId(${GUID})/{{{fileName}}}`, {
  name: '{{{componentFullName}}}',
  component: {{{className}}},
})

export default {{{className}}}
</script>
<template lang="pug">
.{{{componentName}}}(data-cy='{{{fileName}}}') 
  .body-content Hello from {{{componentName}}} component
</template>
<style lang="postcss" scoped>
.{{{componentName}}} {}
</style>
