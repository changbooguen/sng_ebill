<script setup>

</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="board" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      전자결재
    </a>
    <ul class="dropdown-menu" aria-labelledby="board">
      <li>
        <router-link class="dropdown-item" to="/bill/agree">기안함</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/bill/apply">결재함</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/bill/reject">수신함</router-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>