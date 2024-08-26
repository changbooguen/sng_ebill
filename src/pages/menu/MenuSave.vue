<script setup>

import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import {useRouter} from "vue-router";
import axios from "@/axios";
import {inject, onMounted, ref} from "vue";
const router = useRouter();
const upperMenu = ref([]);
const selectUpperMenu = ref("");
const menuNm1 = ref("");
const path = ref("");
const rmk = ref("");


const back = ()=>{
  router.go(-1)
}

const saveMenu = ()=>{
  const formData =new FormData();
  formData.append("menuNm1", menuNm1.value);
  formData.append("path", path.value);
  formData.append("uprMenuId", selectUpperMenu.value);
  formData.append("rmk", rmk.value)
  axios.post("/api/menu", formData ,{
    headers: {
      'Content-Type': 'application/json'
    }
  }).then( s =>{
    alert("success");
    router.push("/menu");
  }).catch(e=>console.log(e))
}

const getUpperMenu= onMounted(()=>{
  axios.get("/api/menu/upper")
      .then(s=>{
        upperMenu.value = [{menuNm1: "None", menuId: 0}, ...s.data.data];
      }).catch(e=> console.log(e))
})
</script>

<template>
  <top-title-and-nav></top-title-and-nav>
  <div class="infoArea">
    <div class="infoOne">
      <div>메뉴명 : </div>
      <v-text-field
          v-model="menuNm1"
          id="menuNm1"
          variant="outlined"
          placeholder="name"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>경로 : </div>
      <v-text-field
          v-model="path"
          id="path"
          variant="outlined"
          placeholder="path"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>상위메뉴 : </div>
      <v-select
          v-model="selectUpperMenu"
          label ="upperMenu"
          :items = "upperMenu"
          item-title = "menuNm1"
          item-value="menuId"
      >
      </v-select>
    </div>
    <div class="infoOne">
      <div>비고 : </div>
      <v-text-field
          v-model="rmk"
          id="rmk"
          variant="outlined"
          placeholder="memo"
      ></v-text-field>
    </div>
  </div>
  <div class="buttonArea">
    <v-btn @click="back">
      목록
    </v-btn>
    <v-btn @click="saveMenu">
      저장
    </v-btn>
  </div>
</template>

<style scoped>
.infoArea{
  margin :10px;
  border : 1px solid #C7C7C7;
  border-radius : 4px;
  display: flex;
  flex-direction: column;
  justify-items : center;
  padding : 30px;
}
.infoOne{
  display: grid;
  grid-template-columns :20% 75%;
  height: 75px;
  grid-gap: 10px;
  align-items: center;
}
.buttonArea button{
  margin-left : 10px
}
.buttonArea{
  display : flex;
  justify-content: center;
}
</style>