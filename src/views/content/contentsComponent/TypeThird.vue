<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>동의서명</template>
    </TitleComp>

    <TabComp>
      <template #content>
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
          <TableComp>
            <template #table_count>
              총 건수 <span>{{ "4" }}</span>건
            </template>
          </TableComp>
        </article>

        <article class="basic pagination">
          <PaginationComp />
        </article>
      </template>
    </TabComp>


  </section>
</template>

<script>
import TableComp from "@/components/DetailComponents/TableComp.vue";
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";

export default {
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