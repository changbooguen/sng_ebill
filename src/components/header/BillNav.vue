<script setup>

</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="board" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      의안제출
    </a>
    <ul class="dropdown-menu" aria-labelledby="board">
      <li>
        <router-link class="dropdown-item" to="/bill/agree">동의서명</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/bill/apply">의안제출</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/bill/reject">의안철회</router-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>