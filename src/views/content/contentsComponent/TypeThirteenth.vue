<template>
  <section class="content_bundle">
    <article class="basic panel">
      <v-dialog
        v-model="caseOne"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            modal case 1
          </v-btn>
        </template>
        <ModalCaseOneComp :toggle="caseOne" @close="caseOne = false" />
      </v-dialog>

      <v-dialog
        v-model="caseTwo"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            modal case 2
          </v-btn>
        </template>
        <ModalCaseTwoComp :toggle="caseTwo" @close="caseTwo = false" />
      </v-dialog>

      <v-dialog
        v-model="caseThree"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            modal case 3
          </v-btn>
        </template>
        <ModalCaseThreeComp :toggle="caseThree" @close="caseThree = false" />
      </v-dialog>

      <v-dialog
        v-model="caseFour"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            modal case 4
          </v-btn>
        </template>
        <ModalCaseFourComp :toggle="caseFour" @close="caseFour = false" />
      </v-dialog>

      <v-dialog
        v-model="caseFive"
        max-width="600"
      >
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps">
            modal case 5
          </v-btn>
        </template>
        <ModalCaseFiveComp :toggle="caseFive" @close="caseFive = false" />
      </v-dialog>

      <v-btn @click="openPopup">
        popup case 1
      </v-btn>
    </article>
  </section>
</template>

<script>
export default {
  data: () => ({
    caseOne: false,
    caseTwo: false,
    caseThree: false,
    caseFour: false,
    caseFive: false,
    popupOpen: false,
  }),
  methods: {
    openPopup() {
      const url = `${window.location.origin}/NewPopup`;
      const width = 600;
      const height = 400;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      window.open(
        url,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );
    },
  }
}
</script>

<style lang="scss" scoped>
.content_bundle {
  width: 100vw;
  height: calc(100vh - 11.6rem);
  display: flex;
  align-items: center;
  justify-content: center;
  article {
    .v-btn {
      margin-right: 1.6rem;
      &:last-of-type {
        display: block;
      }
    }
  }
}
</style>