<template>
  <v-card
      prepend-icon="mdi-dots-grid"
      title="의안 선택"
  >
    <v-card-text>
      <article class="column">
        <div class="bundle button">
          <v-btn
            prepend-icon="mdi-plus-box"
            variant="tonal"
          >
            추가
          </v-btn>
          <v-btn
            prepend-icon="mdi-trash-can"
            variant="tonal"
            class="negative"
          >
            선택 삭제
          </v-btn>
        </div>

        <div class="bundle">
          <v-table class="compact">
            <thead>
            <tr>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                Calories
              </th>
              <th class="text-left">
                Calories
              </th>
              <th class="text-left">
                Calories
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in desserts"
                :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
              <td>
                <v-select
                  density="compact"
                  v-model="select"
                  :hint="`${select.state}, ${select.abbr}`"
                  :items="items"
                  item-title="state"
                  item-value="abbr"
                  variant="outlined"
                  hide-details
                  persistent-hint
                  return-object
                  single-line
                  class="select_input"
                ></v-select>
              </td>
              <td class="text-center">
                <v-btn density="compact" icon="mdi-window-close"></v-btn>
              </td>
            </tr>
            </tbody>
          </v-table>
        </div>

      </article>
    </v-card-text>

    <template v-slot:actions>
      <v-btn variant="tonal">확인</v-btn>
      <v-btn variant="tonal" class="negative" @click="close">닫기</v-btn>
    </template>
  </v-card>
</template>

<script>
export default {
  props: {
    toggle: Boolean,
  },
  data: () => ({
    select: { state: 'Florida', abbr: 'FL' },
    items: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' },
    ],
    desserts: [
      {
        name: 'Frozen Yogurt',
        calories: 159,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
      },
      {
        name: 'Eclair',
        calories: 262,
      },
      {
        name: 'Cupcake',
        calories: 305,
      },
      {
        name: 'Gingerbread',
        calories: 356,
      },
      {
        name: 'Jelly bean',
        calories: 375,
      },
      {
        name: 'Lollipop',
        calories: 392,
      },
      {
        name: 'Honeycomb',
        calories: 408,
      },
      {
        name: 'Donut',
        calories: 452,
      },
      {
        name: 'KitKat',
        calories: 518,
      },
    ],
  }),
  methods: {
    close() {
      this.$emit("close");
    }
  }
}
</script>

<style lang="scss" scoped>

</style>