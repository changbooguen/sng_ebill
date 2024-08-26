<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>동의서명</template>
    </TitleComp>

    <article class="basic panel">
      <div class="panel_bundle">
        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="member_count">
              <span>{{ "16" }}</span>인 / <span>{{ "16" }}</span>인
            </div>
            <v-btn
                variant="tonal"
            >
              참석인원
            </v-btn>
          </div>
          <div class="input_group multi row">
            <label>개의·산회 시각</label>
            <v-form class="data_value_bundle">
              <v-text-field
                v-model="firstName"
                label="10:02"
                hide-details
                density="compact"
                variant="solo-filled"
              ></v-text-field>
              <v-text-field
                v-model="lastName"
                label="~"
                hide-details
                density="compact"
                variant="solo-filled"
              ></v-text-field>
            </v-form>
          </div>
        </div>
      </div>
    </article>

    <article class="basic">
      <TableComp :propsSelect="propsSelect" :tableSelect="select" :items="items">

      </TableComp>
    </article>
  </section>
</template>

<script>
import TableComp from "@/components/DetailComponents/TableComp.vue";
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";

export default {
  components: {PaginationComp, TableComp},
  data: () => ({
    select: { state: 'Florida', abbr: 'FL' },
    items: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' },
    ],
    firstName: '',
    lastName: '',
    propsSelect: true,
  }),
}
</script>

<style lang="scss" scoped>

</style>