<script setup>

import {onMounted, ref} from "vue";

const url = ref("");

// url path를 가져옴
const getUrl= onMounted(()=>{
   const path = window.location.pathname;
   let tmp = path.split("/");
   let tmpPath = path;

   for(let i = 0 ; i< tmp.length ; i++){
     if(i == tmp.length-1){
        if(!!Number(tmp[i]) === true){
          tmpPath = path.slice(0, -(tmp[i].length));
       }else{
          tmpPath = path;
        }
     }
   }
   url.value = tmpPath;
})

</script>

<template>
  <div class="topTitleArea">
    <template v-if="url==='/bill/apply'">
      <p class="title" >■ <span data-i18n="A:">의안제출</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">의안제출</span></div>
    </template>
    <template v-if="url==='/bill/apply/save'">
      <p class="title" >■ <span data-i18n="A:">의안등록</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">의안제출</span>><span data-i18n="A:">의안등록</span> </div>
    </template>
    <template v-if="url==='/bill/detail/'">
      <p class="title" >■ <span data-i18n="A:">의안제출</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">상세보기</span></div>
    </template>
    <template v-if="url==='/bill/update'">
      <p class="title" >■ <span data-i18n="A:">의안제출</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">의안제출</span> > <span data-i18n="A:">상세보기</span></div>
    </template>
    <template v-if="url==='/menu'">
      <p class="title" >■ <span data-i18n="A:">메뉴관리</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">관리자</span> > <span data-i18n="A:">메뉴관리</span> </div>
    </template>
    <template v-if="url==='/menu/save'">
      <p class="title" >■ <span data-i18n="A:">메뉴관리</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">관리자</span> > <span data-i18n="A:">메뉴관리</span> > <span data-i18n="A:">메뉴등록</span> </div>
    </template>
    <template v-if="url==='/menu/detail/'">
      <p class="title" >■ <span data-i18n="A:">메뉴관리</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">관리자</span> > <span data-i18n="A:">메뉴관리</span> > <span data-i18n="A:">메뉴상세</span> </div>
    </template>
    <template v-if="url==='/testVue'">
      <p class="title" >■ <span data-i18n="A:">사용자관리</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">관리자</span> > <span data-i18n="A:">사용자관리</span></div>
    </template>
    <template v-if="url==='/testVue/'">
      <p class="title" >■ <span data-i18n="A:">사용자상세</span></p>
      <div class="navBar">HOME > <span data-i18n="A:">관리자</span> > <span data-i18n="A:">사용자관리</span> > <span data-i18n="A:">사용자 상세</span></div>
    </template>
  </div>
</template>

<style scoped>
.topTitleArea{
  display: flex ;
  justify-content: space-between;
  margin : 0 30px 0 30px;
}
.navBar{
  display: flex;
  align-items: flex-end;
}
.title{
  font-weight: bold;
  margin-top: 2%;
  font-size: large;
  display: flex;
}
</style>