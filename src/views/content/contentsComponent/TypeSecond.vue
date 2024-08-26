<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>동의서명</template>
    </TitleComp>

    <article class="basic panel">
      <div class="panel_bundle">
        <div class="panel_unit">
          <div class="input_group row">
            <label>의안명</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
            ></v-text-field>
          </div>
          <div class="input_group row">
            <label>가나다라마바</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
            ></v-text-field>
          </div>
        </div>

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
            <label>요청자</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
            ></v-text-field>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
            ></v-text-field>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>요청자</label>
            <v-radio-group hide-details inline>
              <v-radio color="primary" label="특별법" value="one"></v-radio>
              <v-radio color="primary" label="일반법" value="two"></v-radio>
            </v-radio-group>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <v-radio-group hide-details inline>
              <v-radio color="primary" label="특별법" value="one"></v-radio>
              <v-radio color="primary" label="일반법" value="two"></v-radio>
            </v-radio-group>
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
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>시작일자</label>
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
        </div>
      </div>

      <div class="panel_btn_bundle">
        <v-btn
            prepend-icon="mdi-magnify"
            variant="tonal"
            class="search_btn"
        >
          검색
        </v-btn>
      </div>
    </article>

    <article class="basic">
      <TableComp />
    </article>

    <article class="basic pagination">
      <PaginationComp />
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

  }),
}
</script>

<style lang="scss" scoped>

</style>