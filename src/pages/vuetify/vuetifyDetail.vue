<script setup>

import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import {defineProps, ref} from "vue";
import {useRouter} from "vue-router";

const props = defineProps({
  id : String,Number
});

const router = useRouter();
const 직무 = ref('국회의원')
const 부서 = ref("의사과")
const back = ()=>{
  router.go(-1)
}
</script>

<template>
  {{id}}
  <top-title-and-nav></top-title-and-nav>
  <div class="infoArea">
    <div class="infoOne">
      <div><span data-i18n="">부서</span> : </div>
      <div>
        <v-select
            v-model="부서"
            label="부서"
            :items="['전체', '의사과']"
        ></v-select>
      </div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="">직무</span> : </div>
      <v-select
          v-model="직무"
          label="직무"
          :items="['전체', '국회의원', '보좌관', '공무원']"
      ></v-select>
    </div>
    <div class="infoOne">
      <div><span data-i18n="">사용자명</span> : </div>
      <v-text-field
          value = '이범수'
          variant="outlined"
          placeholder="name"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div><span data-i18n="">아이디</span> : </div>
      <v-text-field
          value = "id"
          variant="outlined"
          placeholder="id"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div><span data-i18n="">이메일</span> : </div>
      <v-text-field
          value = 'email@gmail.com'
          variant="outlined"
          placeholder="email"
      ></v-text-field>
    </div>
  </div>
  <div class="buttonArea">
    <v-btn @click="back">
      목록
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
}
.infoOne{
  display: grid;
  grid-template-columns :30% 65%;
  height: 75px;
  border-bottom : 1px solid #C7C7C7;
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