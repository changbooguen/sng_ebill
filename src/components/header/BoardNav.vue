<script setup>

</script>

<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="board" role="button"
       data-bs-toggle="dropdown" aria-expanded="false">
      게시판
    </a>
    <ul class="dropdown-menu" aria-labelledby="board">
      <li>
        <router-link class="dropdown-item" to="/board/notice">공지사항</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/board/archive">자료실</router-link>
      </li>
      <li>
        <router-link class="dropdown-item" to="/board/faq">FAQ</router-link>
      </li>
    </ul>
  </li>
</template>

<style scoped>

</style>