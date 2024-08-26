<template>
    <v-progress-circular v-if="pbar.loading"
      indeterminate
      color="blue"
      size="70"
      width="7"
      class="overlay-progress"
    ></v-progress-circular>
</template>


<script>
  import { mapState, mapMutations } from 'vuex';
  
  export default {
    computed: {
      ...mapState({
        pbar: state => state.progressbar,
      }),
    },
    methods: {
    },
  };
  </script>

<style scoped>
.overlay-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>