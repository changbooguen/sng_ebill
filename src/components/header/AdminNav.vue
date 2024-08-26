<script setup>

</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="admin" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      관리자
    </a>
    <ul class="dropdown-menu" aria-labelledby="admin">
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/userTapMng">사용자관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/departmentMng">부서관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/accessHist">로그관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/age/ageMng">대관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/age/sessionMng">회기관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/age/roundMng">차수관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/code/codeMng">코드관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/code/LngCodeMng">언어관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/menu">메뉴관리</router-link>
      </li>
      <li class="navbar-item">
        <router-link class="dropdown-item" to="/billInfo">법률관리</router-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>