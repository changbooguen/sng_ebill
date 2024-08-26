<template>
  <v-card
    prepend-icon="mdi-dots-grid"
    title="의안 선택"
  >
    <v-card-text>
      <article class="column">
        <div class="bundle">
          <div class="input_group row">
            <label>의안번호</label>
            <v-text-field
              density="compact"
              variant="outlined"
              hide-details
            ></v-text-field>
          </div>
          <div class="input_group row">
            <label>의안명</label>
            <v-text-field
              density="compact"
              variant="outlined"
              hide-details
            ></v-text-field>
          </div>
          <v-btn
            prepend-icon="mdi-magnify"
            variant="tonal"
            class="search_btn"
          >
            검색
          </v-btn>
        </div>

        <div class="bundle">
          <v-table density="compact" class="compact">
            <thead>
            <tr>
              <th class="text-left">
                Name
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
            </tr>
            </tbody>
          </v-table>
        </div>

      </article>
    </v-card-text>

    <template v-slot:actions>
      <v-btn variant="tonal">등록</v-btn>
      <v-btn variant="tonal" class="negative" @click="close">취소</v-btn>
    </template>
  </v-card>
</template>

<script>
export default {
  props: {
    toggle: Boolean,
  },
  data: () => ({
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