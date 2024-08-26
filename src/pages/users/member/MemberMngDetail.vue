<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/** 변수 선언 */
const router = useRouter();
const item = ref({});
const memberId = sessionStorage.getItem('memberId');

/** function List */

/** 상세정보 조회 */
const fnGetData = () => {
  
  const apiUrl = `/api/members/memberDetail/`;
  let params = {};
  params.API_PATH = apiUrl;
  params.memberId = memberId;

  console.log(params)
  store.dispatch('API_LIST', params).then((data) => {
    
    item.value = data.resultList.data;
  }).catch(({message}) => {
    console.log("message : ", message );
  })

}

/** 목록 이동 */
const fnGoList = (e) => {
  router.push({name : 'userTap'});
  sessionStorage.setItem('tapKind', 'member');
}

/** 수정 */
const fnGoUpdate = (e) => {
  router.push({name : 'memberUpdate'});
  sessionStorage.setItem('memberId', memberId);
}

/** 삭제 */
const fnDelete = (e) => {
  if(!confirm("삭제 하시겠습니까?")){
    return;
  }

  const apiUrl = `/api/members/`;

  let deleteItems = [];
  deleteItems.push(memberId);

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE', params).then((data) => {
    fnGoList();
  }).catch(({message}) => {
    console.log("message : ", message);
  })
}

/** Dom객체 완성이후 */
onMounted( () => {
    fnGetData();
});

</script>

<template>

  <v-container>
    <v-row>
      <v-col cols="1"></v-col>

      <v-col align="end">
        <v-btn variant="outlined" @click="fnGoUpdate">수정</v-btn>
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
        <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
      </v-col>

      <v-col cols="1"></v-col>
    </v-row>

    <v-row>
      <v-col cols="1"></v-col>

      <v-col>

        <v-card variant="outlined">
          <v-row><v-col></v-col></v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              아이디
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="item.memberId"
                :rules="title_rules"
                required
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              이름
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="item.memberNm"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              부서
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="item.deptNm"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              휴대전화
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="item.mblNo"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="2">
              이메일
            </v-col>
            <v-col cols="8">
              <v-text-field
                v-model="item.email"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row><v-col></v-col></v-row>
        </v-card>

      </v-col>

      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>