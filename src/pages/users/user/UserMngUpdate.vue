<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';

/** 변수선언 */
const router = useRouter();
const item = ref({});
const userId = sessionStorage.getItem('userId');
const saveForm = ref(null);
const formValid = ref(null);

/** function List */

/** 상세정보 조회 */
const fnGetData = () => {
  
  const apiUrl = `/api/users/usersDetail/`;
  let params = {};
  params.API_PATH = apiUrl;
  params.userId = userId;

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
  sessionStorage.setItem('tapKind', 'user');
}

/** 유효성 검사 */
const title_rules = [
        value => {
          if (value) return true
          return '제목은 필수 입력값입니다.'
        },
    ];

const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
    return formValid.value;
};

/** 저장 */
const fnUpdate = (e) => {
  
  if(!fnValidate()) {
    return;
  }

  const jsonData = {
    userNm : `${item.value.userNm}`,
    userId : userId,
    pswd : `1234`,
    pswdChk : `1234`,
    mblNo : `${item.value.mblNo}`,
    // deptId : `${item.value.deptCd}`,
    inrNo : `${item.value.inrNo}`,
    email : `${item.value.email}`,
    role : 'USER'
  }

  const apiUrl = `/api/userUpdate/`;
  let params = {};
  params.API_PATH = apiUrl;
  params.JSON_DATA = jsonData;

  store.dispatch('API_UPDATE', params).then((data) => {

    sessionStorage.setItem('userId', userId);
    router.push({ name: 'userDetail' });

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
        <v-btn variant="outlined" type="submit" @click="fnUpdate">저장</v-btn>
        <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
      </v-col>

      <v-col cols="1"></v-col>
    </v-row>

    <v-row>
      <v-col cols="1"></v-col>

      <v-col>

        <v-card variant="outlined">
          <v-form @submit.prevent ref="saveForm" v-model="formValid">
            <v-row><v-col></v-col></v-row>

            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="2">
                아이디
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="item.userId"
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
                  v-model="item.userNm"
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
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row><v-col></v-col></v-row>
          </v-form>
        </v-card>

      </v-col>

      <v-col cols="1"></v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>