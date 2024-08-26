<script setup>
import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import TotalCount from "@/components/TotalCount.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const selected = ref([]);

const items = ref([
  {
    연번 : 1,
    부서 : "의사국",
    직무 : "주무관",
    사용자명 : "강병원",
    아이디 : "Aa22",
    이메일 : "Aa22@gmail.com",
    id : "21001"
  },
])
const headers = [
  {title : "연번", value : '연번'},
  {title : "부서", value : "부서"},
  {title : "직무", value : "직무"},
  {title : "사용자명", value : "사용자명"},
  {title : "아이디", value : "아이디"},
  {title : "이메일", value : "이메일"},
]
const clickedData = (e,row)=>{
  router.push({
    name : 'testDetail',
    params : {
      id : row.item.id
    }
  });
}

</script>

<template>
  <div class="contentMainArea">
    <top-title-and-nav></top-title-and-nav>
    <div class="searchArea">
      <div class="searchTerm">
        <div class="searchOne">
          <v-select
              label="직무"
              :items="['전체', '국회의원', '보좌관', '공무원']"
          ></v-select>
        </div>
        <div class="searchOne">
          <v-select
              label="부서"
              :items="['전체']"
          ></v-select>
        </div>
        <div class="searchOne">
          <v-text-field
              label="사용자명"
              variant="outlined"
              placeholder="name"
          ></v-text-field>
        </div>
        <div class="searchOne">
          <v-text-field
              label="아이디"
              variant="outlined"
              placeholder="id"
          ></v-text-field>
        </div>
      </div>

      <div class="searchIconArea">
        <v-btn>
          <v-icon icon="mdi-magnify"></v-icon>
        </v-btn>
        <v-btn>
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </div>
    </div>
    <div class="mainContentArea">
      <div class="contentTopArea">
        <div class="countArea">
          <total-count :totalCount="3"></total-count>
        </div>
        <div class="addDeleteButtonArea">
          <v-btn
              variant="outlined"
              color="primary"
          >등록</v-btn>
        </div>
      </div>
      <div class="contentData">
        <v-data-table
            :headers="headers"
            :items="items"
            item-value="id"
            @click:row="clickedData"
        ></v-data-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchArea{
  position: relative;
  width: 100%;
  height: 80px;
  margin: 20px 0 20px 0;
  padding: 0 10px 0 10px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.searchIconArea{
  display: flex;
}
.searchIconArea button{
  margin: 10px;
}
.searchTerm{
  display : flex;
  align-items: center;
  width : 100%;
  margin-top :20px;
}
.searchOne{
  display : flex;
  align-items: center;
  width : 250px;
}
.mainContentArea{
  background: white;
  border-radius: 20px;
  margin: 10px 0 10px 0;
  padding: 0 10px 0 10px;
}
.contentTopArea{
  display: flex;
  justify-content: space-between;
  height: 6vh;
  align-items: center;
}

</style>