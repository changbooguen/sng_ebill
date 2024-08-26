<template>
  <main class="login">
    <section>
      <article class="left">
        <h3>안건문서관리시스템</h3>
      </article>

      <article class="right">
        <h5>LOGIN</h5>

        <div class="input_group row">
          <label>아이디</label>
          <v-text-field
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
        </div>

        <div class="input_group row">
          <label>비밀번호</label>
          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>

        </div>
        <div class="input_group">
          <v-checkbox class="checkbox_small" color="primary" label="아이디 저장"></v-checkbox>
        </div>

        <v-btn class="login" @click="moveToMainFrame">
          로그인
        </v-btn>
      </article>
    </section>
  </main>
</template>

<script>
export default {
  data: () => ({
    visible: false,
  }),
  methods: {
    moveToMainFrame() {
      this.$router.push('/MainComp')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>