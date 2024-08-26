<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>부서 관리</template>
    </TitleComp>

    <div class="article_row">
      <article class="basic panel column">
        <div class="organization_function_group">
          <h3>조직도</h3>

          <div class="input_group">
            <v-text-field
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search templates"
              variant="outlined"
              hide-details
              single-line
              clearable
              rounded
              class="search_input"
            ></v-text-field>
          </div>

          <v-btn variant="outlined" class="negative border" rounded>
            부서등록
          </v-btn>

          <v-btn variant="tonal" class="negative" rounded>
            부서일괄등록
          </v-btn>
        </div>

        <v-card
            class="organization_list_group"
        >
          <v-list v-model:opened="open">
            <v-list-item
                prepend-icon="mdi-folder"
                title="가나다라마바"
            ></v-list-item>

            <v-list-group value="Users">
              <template v-slot:activator="{ props }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-folder"
                    title="가나다라마바"
                ></v-list-item>
              </template>

              <v-list-group value="Admin">
                <template v-slot:activator="{ props }">
                  <v-list-item
                      v-bind="props"
                      title="가나다라마바"
                  ></v-list-item>
                </template>

                <v-list-item
                    v-for="([title, icon], i) in admins"
                    :key="i"
                    :prepend-icon="icon"
                    :title="title"
                    :value="title"
                ></v-list-item>
              </v-list-group>

              <v-list-group value="Actions">
                <template v-slot:activator="{ props }">
                  <v-list-item
                      v-bind="props"
                      title="가나다라마바"
                  ></v-list-item>
                </template>

                <v-list-item
                    v-for="([title, icon], i) in cruds"
                    :key="i"
                    :prepend-icon="icon"
                    :title="title"
                    :value="title"
                ></v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </v-card>
      </article>

      <article class="basic panel column">
        <div class="organization_function_group">
          <h3>의안과({{"3"}})</h3>

          <v-btn variant="outlined" rounded>
            신규등록
          </v-btn>

          <v-btn variant="tonal" rounded>
            미지정 직원 등록
          </v-btn>
        </div>

        <div class="custom_toggle_btn">
          <v-btn-toggle
              v-model="text"
              rounded="10"
              group
              density="compact"
          >
            <v-btn value="one" @click="toggleTable">부서정보</v-btn>
            <v-btn value="two" @click="toggleTable">부서원 목록</v-btn>
          </v-btn-toggle>
        </div>

        <v-table v-if="tableType" density="compact" class="compact">
          <tbody>
          <tr
              v-for="item in desserts"
              :key="item.name"
          >
          <th class="text-left">
            Name
          </th>
            <td>{{ item.name }}</td>
            <td>{{ item.calories }}</td>
          </tr>
          </tbody>
        </v-table>

        <v-table v-else density="compact" class="compact">
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

      </article>
    </div>
  </section>
</template>

<script>
import TableComp from "@/components/DetailComponents/TableComp.vue";
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";
import InnerMultiTdTableComp from "@/components/DetailComponents/InnerMultiTdTableComp.vue";

export default {
  components: {InnerMultiTdTableComp},
  data: () => ({
    tableType: true,
    open: ['Users'],
    admins: [
      ['Management', 'mdi-account-multiple-outline'],
      ['Settings', 'mdi-cog-outline'],
    ],
    cruds: [
      ['Create', 'mdi-plus-outline'],
      ['Read', 'mdi-file-outline'],
      ['Update', 'mdi-update'],
      ['Delete', 'mdi-delete'],
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
  methods: {
    toggleTable() {
      this.tableType = !this.tableType
    }
  },
}
</script>

<style lang="scss" scoped>

</style>