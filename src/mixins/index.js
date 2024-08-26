export default {
  name: 'mixin',
  computed: {

  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
  watch: {
    // $route(to, from) {
    //   if (to.path !== from.path) this.$route.path
    //   this.registerUserStore.setPathValue = this.$route.path
    // },
  },
  filters: {

  },
}




