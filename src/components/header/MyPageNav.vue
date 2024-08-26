<script setup>

</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="myPage" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      마이페이지
    </a>
    <ul class="dropdown-menu" aria-labelledby="myPage">
      <li>
        <router-link class="dropdown-item" to="/myPage/myInfo">내정보</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/myPage/messageMng">메세지관리</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="">개인화서비스</router-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>