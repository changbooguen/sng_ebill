<script setup>
import adminNav from '@/components/header/AdminNav.vue';
import boardNav from '@/components/header/BoardNav.vue';
import myPageNav from '@/components/header/MyPageNav.vue';
import {ref} from "vue";
import BillNav from "@/components/header/BillNav.vue";
import ApprovalNav from "@/components/header/ApprovalNav.vue";
import axios from "@/axios";
import store from '@/store';
import router from '@/router';
import VueCookies from 'vue-cookies';


const isNavShow = ref(false)

function logout() {
  const request = async () => {
    try {
      const formData = new FormData();
      axios.post('http://localhost:8080/api/logout', formData, {
        headers: {
          'Authorization': `Bearer ${store.getters.token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => {

          VueCookies.remove('jwtToken');
          store.dispatch('updateUser', { userId: null, token: null, loginInfo: null });

          alert("LOGOUT");

          router.push('/login');

        })
        .catch(error => {
          console.error('Error :', error);
        });



    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
    }
  };

  request();

}

</script>

<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
    <span class="navbar-brand ps-2">E-Bill</span>
    <button class="navbar-toggler" type="button" @click="isNavShow = !isNavShow">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div :class="isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'">
      <ul class="navbar-nav">
        <li class="navbar-item alignCenter">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="navbar-item alignCenter">
          <billNav class="nav-link " />
        </li>
        <li class="navbar-item alignCenter">
          <approvalNav  class="nav-link" />
        </li>
        <li class="navbar-item alignCenter">
          <router-link class="nav-link" to="/FileMng">파일등록</router-link>
        </li>
        <li class="navbar-item alignCenter">
          <boardNav class="nav-link" />
        </li>
        <li class="navbar-item alignCenter">
          <adminNav class="nav-link" />
        </li>
        <li class="navbar-item alignCenter">
          <myPageNav class="nav-link" />
        </li>
        <li class="navbar-item alignCenter">
          <router-link class="nav-link" to="/sampleGridList">샘플</router-link>
        </li>

        <li class="navbar-item alignCenter">
          <a class="nav-link" href="#" @click="logout">로그아웃</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
  .alignCenter{
    display : flex;
    align-items : center;
  }
</style>