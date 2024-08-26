<script setup>

import axios from "@/axios";
import {onMounted, ref, defineProps, watch} from "vue";
import store from "@/store";
import VueCookies from "vue-cookies";
import router from "@/router";

const data = ref([]);
const uprMenu = ref([]);

const prop =defineProps({
  isLogin : Boolean
})

onMounted(() => {
  if (prop.isLogin) {
    getData();
  }
});


const getData = ()=>{

  axios.get("/api/menus?page=0&size=500&sort=ord,asc")
      .then(s=>{
        const content = s.data.data.content;
        data.value = content
        let menuTree = [];

        content.forEach ((d)=>{
          if(d.uprMenuId == 0){
            d.subMenu = [];
            menuTree.push(d);
          }
        });

        // 하위 메뉴를 상위 메뉴의 subMenu에 추가
        content.forEach((d) => {
          if(d.uprMenuId !== 0){
            let parent = menuTree.find(menu => menu.menuId == d.uprMenuId);
            if(parent){
              parent.subMenu.push(d);
            }
          }
        });
        uprMenu.value = menuTree;

      }).catch(e=>{
    console.log(e);
  })
}




const logout = ()=>{
  const formData = new FormData();
  axios.post('http://localhost:8080/api/logout', formData, {
    headers: {
      'Authorization': `Bearer ${store.getters.token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    console.log("response :: " +response.data);

    VueCookies.remove('jwtToken');
    store.dispatch('updateUser', { userId: null, token: null, loginInfo:null });

    alert("LOGOUT");

    router.push('/login');

  }).catch(error => {
      console.error('Error :', error);
  });
}


//login이 되면 getData 실행
watch(() => prop.isLogin, (newValue) => {
  if (newValue) {
    getData();
  }
}, { immediate: true });

</script>

<template>
<div class="navMenuArea">
  <div class="logoArea">
    <router-link to="/">
      <div>E-Bill</div>
    </router-link>
  </div>
  <div class="menuArea" v-if="isLogin">
    <template v-for="d in uprMenu" :key="d.menuId">
      <v-btn variant="text" @click="d.path ? router.push(d.path) : null">
        <template v-if="d.path !== ''">
          {{ d.menuNm1 }}
        </template>
        <template v-else>
          <v-icon color="white">mdi-chevron-down</v-icon>
          {{d.menuNm1}}
        </template>
        <v-menu activator="parent">
          <template v-if="d.subMenu.length != 0">
            <v-list>
              <v-list-item
                  v-for="(item, index) in d.subMenu"
                  :key="index"
                  :value="item.menuId"
                  @click="router.push(item.path)"
              >
                <v-list-item-title>{{item.menuNm1}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </v-menu>
      </v-btn>

    </template>
  </div>
  <div class="loginArea">
    <template v-if="isLogin">
      
      <v-btn @click="logout" variant="text">
        Logout
      </v-btn>
    </template>
    <template v-else>
      <v-btn @click="router.push('/login')" variant="text">
        Login
      </v-btn>
    </template>
  </div>
</div>
</template>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}
.navMenuArea{
  background-color : black;
  height : 60px;
  display : flex;
  align-items : center;
  justify-content: space-between;
  color : #ffffff;
}
.logoArea{
  margin-left : 20px;
  /* height : 100%; */
  width : 150px;
  font-size : 20px;
}
.loginArea{
  margin-right : 20px;
  /* height : 100%; */
  width : 150px;
}
.menuArea{
  display : flex;
}
.menuArea v-button{
  margin-left : 20px;
}



</style>