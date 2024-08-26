<script>

export default {
  name: "topSample",
  components: {}
}
</script>

<template>
  <div class="topMenuArea">
    <div class="logoArea">
      <a href="/" class="logoComponentArea">
        <img src="src\img\logo.png" class="logo"/>
      </a>
      <div>Internet<br/>Broadcast<br/>System</div>
    </div>
    <div class="topMenu">
      <router-link to="logMng" >의안제출</router-link>
      <router-link to="" >의안관리</router-link>
      <router-link to="" >의안심사</router-link>
      <router-link to="" >위원회회의</router-link>
      <router-link to="" >의안현황</router-link>
      <router-link to="" >문서관리</router-link>
    </div>
    <!--Todo 로그인여부 확인하여 v-if -->
    <div class="loginStatusBox">
      <router-link to="/login">login</router-link>
    </div>
  </div>
</template>

<style scoped>
.topMenuArea{
  height: 8vh;
  display: flex;
  margin: 0 10px 0 10px;
}

.logoArea {
  display: flex;
  width: 14vw;
  height: 100%;
  align-items: center;
}
.loginStatusBox{
  width: 10vw ;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.topMenu{
  font-size: 1.2rem;
  align-items: center;
  width: 75vw;
  display: flex;
  justify-content: center;
}
.topMenu a{
  margin-left: 50px;
}
.logo{
  height: 90%;
  display: flex;
  max-width: 100%;
}
.logoComponentArea{
  height: 100%;
  display: flex;
  align-items: center;
}
</style>