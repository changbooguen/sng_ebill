<template>
  <div class="table_count">
    <slot name="table_count"></slot>
  </div>
  <v-table>
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

      <td v-if="propsSelect">
        <v-select
          density="compact"
          :value="this.tableSelect.state"
          @update:modelValue="updateTableSelect"
          :hint="tableSelect ? `${tableSelect.state}, ${tableSelect.abbr}` : 'Select an item'"
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

      <td v-else-if="propsData" class="function">
        <div>
          소관위원회 : <span>{{ "Commission du Deveoloppement" }}</span>
          <v-btn variant="tonal">
            선택
          </v-btn>
        </div>

        <div>
          관련위원회 : <span>{{ "" }}</span>
          <v-btn variant="tonal">
            선택
          </v-btn>
        </div>

        <div>
          본회의 :
          <v-date-input
            class="v_date_input"
            density="compact"
            clearable
            label=""
            prepend-icon=""
            prepend-inner-icon="$calendar"
            variant="solo"
            hide-details
          ></v-date-input>
        </div>
      </td>

      <td v-else>{{ item.calories }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    propsData: {type: Boolean},
    propsSelect: {type: Boolean},
    tableSelect: {
      type: Object,
      default: () => ({ state: '', abbr: '' })
    },
    items: {
      type: Array,
      default: () => []
    },
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
    updateTableSelect(value) {
      this.$emit('update:tableSelect', value);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>