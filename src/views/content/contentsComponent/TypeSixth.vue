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
          </div>
          <div class="input_group multi row">
            <label>가나다라마바</label>
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

            <v-form class="data_value_bundle" disabled>
              <v-text-field
                v-model="firstName"
                label="First name"
                hide-details
                density="compact"
                variant="solo-filled"
              ></v-text-field>
              <v-text-field
                v-model="lastName"
                label="Last name"
                hide-details
                density="compact"
                variant="solo-filled"
              ></v-text-field>
            </v-form>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="member_count">
              <span>{{ "16" }}</span>인 / <span>{{ "16" }}</span>인
            </div>
            <v-btn
                variant="tonal"
                prepend-icon="mdi-checkbox-marked-circle-plus-outline"
            >
              출석
            </v-btn>
          </div>
          <div class="input_group multi row">
            <label>회의장소</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation pointilleuse prise en" }}
            </div>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>비고</label>
            <v-textarea variant="outlined"></v-textarea>
          </div>
        </div>
      </div>
    </article>

    <article class="basic">
      <TableComp :propsData="propsData">
        <template #table_count>
          결과보고 : <span>{{ "2024-02-02 14:00" }}</span>
        </template>
      </TableComp>
    </article>

    <article class="bottom_button right">
      <v-btn variant="tonal" class="negative" prepend-icon="mdi-trash-can-outline">
        삭제
      </v-btn>
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
    propsData: true,
  }),
}
</script>

<style lang="scss" scoped>

</style>