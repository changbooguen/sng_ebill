<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>접수대기 상세화면</template>
    </TitleComp>

    <article class="basic panel">
      <div class="panel_bundle">
        <div class="panel_unit">
          <div class="input_group row">
            <label>의안번호</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
            ></v-text-field>
          </div>
          <div class="input_group multi row">
            <label>접수일시</label>
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

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation pointilleuse prise en application de l’article 572 du Code des Obligations civiles et commerciales, En dépit d’une réglementation pointilleuse prise en application de l’article 572 du Code des Obligations civiles et commerciales En dépit d’une réglementation pointilleuse prise en application de l’article 572 du Code des Obligations civiles et commerciales, En dépit d’une réglementation pointilleuse prise en application de l’article 572 du Code des Obligations civiles et commerciales" }}
            </div>
            <v-btn
              prepend-icon="mdi-plus"
              variant="outlined"
            >
              더보기
            </v-btn>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une" }}
            </div>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une" }}
            </div>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une" }}
            </div>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une" }}
            </div>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation pointilleuse prise en" }}
            </div>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation pointilleuse prise en" }}
            </div>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation" }}
            </div>
          </div>
          <div class="input_group row">
            <label>서명여부</label>
            <div class="text_content">
              {{ "En dépit d’une réglementation" }}
            </div>
          </div>
        </div>

        <div class="panel_unit">
          <div class="input_group row">
            <label>서명여부</label>
            <div class="signature_wrap">
              <SignaturePad />
            </div>
          </div>
        </div>

        <div class="panel_unit table">
          <div class="input_group row">
            <label>서명대상관리</label>
            <div class="inner_table_wrap">
              <div class="btn_wrap">
                <v-btn
                    prepend-icon="mdi-check"
                    variant="tonal"
                    class="search_btn"
                >
                  등록
                </v-btn>
              </div>
              <InnerMultiTdTableComp />
            </div>
          </div>
        </div>
      </div>
    </article>

    <article class="basic button noneShadow">
      <div class="panel_btn_bundle">
        <v-btn
            prepend-icon="mdi-checkbox-multiple-marked"
            variant="tonal"
            class="search_btn"
        >
          의안 접수
        </v-btn>
        <v-btn
            prepend-icon="mdi-close-box-multiple"
            variant="tonal"
            class="negative_btn"
        >
          닫기
        </v-btn>
      </div>
    </article>
  </section>
</template>

<script>
import TableComp from "@/components/DetailComponents/TableComp.vue";
import PaginationComp from "@/components/DetailComponents/PaginationComp.vue";
import InnerMultiTdTableComp from "@/components/DetailComponents/InnerMultiTdTableComp.vue";

export default {
  components: {InnerMultiTdTableComp, PaginationComp, TableComp},
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