<template>
  <v-card
    prepend-icon="mdi-dots-grid"
    title="서명요청대상 그룹 설정"
  >
    <v-card-text>
      <article class="column mb32">
        <div class="bundle">
          <div class="subTitle">
            <v-icon icon="mdi-dots-vertical" />
            <h3>서명요청대상 그룹 이름</h3>
          </div>
        </div>

        <div class="bundle">
          <v-text-field
            density="compact"
            variant="outlined"
            hide-details
          ></v-text-field>
        </div>
      </article>

      <article class="column">
        <div class="bundle">
          <div class="subTitle">
            <v-icon icon="mdi-dots-vertical" />
            <h3>의원별 선택</h3>
          </div>
        </div>

        <div class="bundle">
          <v-list :items="items" density="compact"></v-list>
          <div class="button_wrap">
            <v-btn
                prepend-icon="mdi-redo-variant"
                variant="outlined"
                rounded
            >
              추가
            </v-btn>
            <v-btn
                append-icon="mdi-undo-variant"
                variant="outlined"
                rounded
            >
              삭제
            </v-btn>
          </div>
          <v-list :items="items" density="compact"></v-list>
        </div>
      </article>
    </v-card-text>

    <template v-slot:actions>
      <v-btn variant="tonal">저장</v-btn>
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