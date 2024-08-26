<template>
  <v-table class="multi_td">
    <template v-for="(item, index) in desserts" :key="index">
      <tr>
        <th colspan="4" class="text-center">
          {{ item.titleHeader }}
        </th>
      </tr>

      <tr v-for="(personRow, personIndex) in item.people" :key="personIndex">
        <td v-for="(person, index) in (Array.isArray(personRow) ? personRow.slice(0, 4) : [])" :key="index">
          {{ person }}
        </td>
      </tr>
    </template>
  </v-table>
</template>

<script>
export default {
  data: () => ({
    desserts: [
      {
        titleHeader: "찬성",
        people: [
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA"],
        ],
      },
      {
        titleHeader: "찬성",
        people: [
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA", "Sokhna BA", "Sokhna BA"],
          ["Sokhna BA", "Sokhna BA"],
        ],
      },
    ],
  }),
  methods: {
    updateTableSelect(value) {
      this.$emit('update:tableSelect', value);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>