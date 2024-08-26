<template>
  <article class="title_bundle">
    <div class="title">
      <v-icon icon="mdi-circle-slice-8" />
      <h2><slot name="titleName">default</slot></h2>
    </div>

    <div class="bread_crumbs">
      <v-breadcrumbs :items="['Foo', 'Bar', 'Fizz']"></v-breadcrumbs>
    </div>
  </article>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>