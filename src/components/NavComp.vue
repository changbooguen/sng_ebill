<template>
  <nav>
    <section>
      <article class="top">
        <h1>안건문서관리시스템</h1>

        <v-card-text>
          <div class="input_group search">
            <v-text-field
              :loading="loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search templates"
              variant="outlined"
              rounded
              hide-details
              single-line
              clearable
              @click:append-inner="onClick"
              class="search_input"
            ></v-text-field>
          </div>

          <div class="input_group select">
            <v-select
              rounded
              variant="solo"
              density="compact"
              v-model="select"
              :hint="`${select.state}, ${select.abbr}`"
              :items="items"
              item-title="state"
              item-value="abbr"
              label="상세검색"
              hide-details
              persistent-hint
              return-object
              single-line
              class="select_input"
            ></v-select>
          </div>
        </v-card-text>

        <span class="function_group">
          <v-btn class="my_page" density="comfortable" icon="mdi-account-circle"></v-btn>

          <span class="client_name"><span>{{ "홍길동" }}</span> 의원</span>

          <div class="language_bundle">
            <v-btn variant="tonal">KblP</v-btn>
            <v-btn variant="outlined">PYC</v-btn>
          </div>

          <div class="font_size_bundle">
            <span class="size">글자크기</span>
            <v-icon icon="mdi-plus-box" />
            <v-icon icon="mdi-minus-box" />
          </div>
        </span>

      </article>

      <article class="bottom">
        <v-card>
          <v-layout>
            <v-app-bar
                color="indigo"
                absolute
                flat
            >
              <template v-slot:extension>
                <v-tabs
                    v-model="tabs"
                    align-tabs="title"
                >
                  <v-tab text="Item One" value="one"></v-tab>
                  <v-tab text="Item Two" value="two"></v-tab>
                  <v-tab text="Item Three" value="three"></v-tab>

                </v-tabs>
              </template>
            </v-app-bar>

            <v-main>
              <v-sheet>
                <ul>
                  <li>가나다라마바사</li>
                  <li>가나다라마바사</li>
                  <li>가나다라마바사</li>
                  <li>가나다라마바사</li>
                  <li>가나다라마바사</li>
                  <li>가나다라마바사</li>
                </ul>
              </v-sheet>
            </v-main>

            <v-fab
                :key="activeFab.icon"
                :color="activeFab.color"
                :icon="activeFab.icon"
                class="ms-4 mb-4"
                location="bottom start"
                size="64"
                absolute
                app
                appear
            >
            </v-fab>
          </v-layout>
        </v-card>
      </article>
    </section>
  </nav>
</template>

<script>
export default {
  data: () => ({
    loaded: false,
    loading: false,
    tabs: null,
    select: { state: 'Florida', abbr: 'FL' },
    items: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' },
    ],
  }),
  methods: {
    onClick() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.loaded = true
      }, 2000)
    },
  },
  computed: {
    activeFab () {
      switch (this.tabs) {
        case 'one': return { color: 'success', icon: 'mdi-share-variant' }
        case 'two': return { color: 'red', icon: 'mdi-pencil' }
        case 'three': return { color: 'green', icon: 'mdi-chevron-up' }
        default: return {}
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>