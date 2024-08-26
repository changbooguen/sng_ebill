<script setup>
import {ref, defineProps, defineEmits} from "vue";

const props = defineProps({
  totalPage : {
    type : [String, Number],
    default : 1
  }
})
const currentPage = ref(1);


const emit = defineEmits(["updateCurrentPage"])

const updateCurrentPage= page =>{
  emit("updateCurrentPage", page)
}

const selectPage = e =>{
  const target = e.target;
  const pages = document.getElementById("pages").children;
  for(let i =0 ; i<pages.length ; i++){
    pages[i].classList.replace("selectedPage","page");
  }
  target.classList.replace("page","selectedPage");
  currentPage.value = target.textContent;
  updateCurrentPage(currentPage.value);
}

const computedPage = ()=>{
  const newCurrentPage= currentPage.value

  const pagePage = Math.ceil(newCurrentPage / 10);
  const pages = [];
  const pageMax = (pagePage*10 > props.totalPage) ?props.totalPage :pagePage*10;
  const envPage = (pagePage-1)*10;
  for(let i = envPage+1  ; i <= pageMax ; i++){
    pages.push(i);
  }
  if(props.totalPage < 1) pages.push(1)
  return pages
}

const endPage = ()=>{
  if(props.totalPage < 1) return
  const totalPage= props.totalPage
  currentPage.value= totalPage;
  updateCurrentPage(currentPage.value);
}

const firstPage= ()=>{
  if(props.totalPage < 1) return
  currentPage.value = 1;
  updateCurrentPage(currentPage.value);
}

const nextPage=()=>{
  if(props.totalPage < 1) return
  const newCurrentPage = currentPage.value;
  if(newCurrentPage != props.totalPage){
    let nextPage = (Math.ceil(newCurrentPage/ 10)*10)+1;
    if(nextPage > props.totalPage){
      currentPage.value = props.totalPage;
    }else {
      currentPage.value = (Math.ceil(newCurrentPage/ 10)*10)+1;
    }
    updateCurrentPage(currentPage.value);
  }
}

const prvPage= ()=>{
  if(props.totalPage < 1) return
  const page = currentPage.value;
  if(page > 10 ){
    currentPage.value = (Math.floor((page/ 10)-1)*10)+1;
  }else{
    currentPage.value = 1 ;
  }
  updateCurrentPage(currentPage.value);
}

</script>

<template>
  <div class="pages" id="pages">
    <div class="pageIcon">
      <div @click="firstPage" class="firstPage">
        <img src="../img/arrow/double_arrow_left.png" class="buttonIcon"/></div>
      <div @click="prvPage" class="prvPage">
        <img src="../img/arrow/arrow_left.png" class="buttonIcon"/></div>
    </div>
    <template v-for="i in computedPage()" :key="i">
      <template v-if="currentPage == i">
        <div class="selectedPage" @click="selectPage">
          {{i}}
        </div>
      </template>
      <template v-else>
        <div class="page" @click="selectPage">
          {{i}}
        </div>
      </template>
    </template>
    <div class="pageIcon" >
      <div @click="nextPage" class="nextPage">
        <img src="../img/arrow/arrow_right.png" class="buttonIcon"/></div>
      <div @click="endPage" class="endPage">
        <img src="../img/arrow/double_arrow_right.png" class="buttonIcon"/></div>
    </div>
  </div>

</template>




<style scoped>
.buttonIcon{
  height: 20px;
  width: 20px
}
 .pages{
   display: flex;
   margin-top: 20px;
   justify-content: center;
 }
 .page{
   width: 2vw;
   display: flex;
   justify-content: center;
   cursor:pointer;
   padding: 10px 0 10px 0;
   align-items: center;
   margin-left: 15px;

 }
 .selectedPage{
   width: 2vw;
   display: flex;
   justify-content: center;
   padding: 10px 0 10px 0;
   align-items: center;
   margin-left: 15px;
   background: #3FBAFE;
   color: white;
 }
 .pageIcon{
   display: flex;
   align-items: center;
 }
 .pageIcon div{
   margin-left: 10px;
 }
 .nextPage , .prvPage , .endPage , .firstPage{
   cursor : pointer;
 }

</style>