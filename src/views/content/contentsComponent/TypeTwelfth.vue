<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>권한별 메뉴관리</template>
    </TitleComp>

    <div class="custom_toggle_btn ml32 mb16">
      <v-btn-toggle
          v-model="text"
          rounded="10"
          group
          density="compact"
      >
        <v-btn value="one">부서정보</v-btn>
        <v-btn value="two">부서원 목록</v-btn>
      </v-btn-toggle>
    </div>

    <div class="article_row exception">
      <article class="basic panel column list">
        <div class="organization_function_group">
          <h3>권한</h3>
        </div>

        <v-list :items="items"></v-list>
      </article>

      <v-table>
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
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in desserts"
            :key="item.name"
        >
          <td>
            <div class="input_group">
              <v-checkbox hide-details color="primary"></v-checkbox>
            </div>
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </section>
</template>

<script>
import TableComp from "@/components/DetailComponents/TableComp.vue";
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";
import InnerMultiTdTableComp from "@/components/DetailComponents/InnerMultiTdTableComp.vue";

export default {
  components: {TableComp, InnerMultiTdTableComp},
  data: () => ({
    open: ['Users'],
    items: [
      {
        title: 'Item #1',
        value: 1,
      },
      {
        title: 'Item #2',
        value: 2,
      },
      {
        title: 'Item #3',
        value: 3,
      },
    ],
    text: 'one',
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
}
</script>

<style lang="scss" scoped>

</style>