<template>
  <v-card class="basic">
    <v-tabs
        v-model="tab"
        align-tabs="center"
        color="deep-purple-accent-4"
    >
      <v-tab :value="1">Landscape</v-tab>
      <v-tab :value="2">City</v-tab>
      <v-tab :value="3">Abstract</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
          v-for="n in 3"
          :key="n"
          :value="n"
      >
        <v-container fluid>
          <slot name="content"></slot>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    tab: null,
  }),
}
</script>

<style lang="scss" scoped>

</style>