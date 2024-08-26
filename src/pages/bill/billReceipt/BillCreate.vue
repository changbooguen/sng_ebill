<script setup>

import {ref} from "vue";
import axios from "@/axios";
import {VDateInput} from 'vuetify/labs/VDateInput'
import {useRouter} from "vue-router";
import billFileCompType1 from "@/components/BillFileCompType1.vue";

const router = useRouter();


const billNo = ref();
const proposeStatus = ref();
const billType = ref();
const billName = ref();
const proposerType = ref();
const proposeDate = ref();
const proposeReason = ref();
const proposeContents = ref();


const proposeType = ref('일부개정'); // 기본값 설정
const defaultBillType = ref("선택");
const defaultProposer = ref("선택");

const fileRef = ref(null);

const proposerTypeItems = ['선택', '의원', '정부'];


const createBill = () => {

  const jsonData = {
    billNo: billNo.value,
    // proposeStatus: proposeStatus.value,
    billType: billType.value,
    billName: billName.value,
    proposeType: proposeType.value,
    proposerType: proposerType.value,
    //<FIXME> 일자가 -1 되는 문제 확인
    proposeDate: proposeDate.value,
    proposeReason: proposeReason.value,
    proposeContents: proposeContents.value,
  }

  axios({
    url: '/api/bill-receipt',
    method: 'post',
    data: jsonData,
  }).then(function a(response) {

    alert("의안이 접수되었습니다.");
    router.push({name: 'billDetail', params: {id: response.data.data}});

  }).catch(function (error) {
    if (error.response) {
      // 요청이 전송되었고, 서버는 2xx 외의 상태 코드로 응답했습니다.
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);

      alert(error.response.data.message)

    } else if (error.request) {

      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });

  /*const apiUrl = "/api/bill-receipt"
  let params = {};
  params.API_PATH = apiUrl;
  params.JSON_DATA = jsonData;


  store.dispatch('API_SAVE', params).then((data) => {
    console.log("Data : ", data)
    alert('저장 되었습니다.');
  }).catch(({message}) => {
    console.log("message : ", message)
  })*/
}

</script>

<template>
  <v-container class="lg-12">

    <v-row class="lg-12">
      <v-col cols="1"></v-col>

      <v-col align="end">
        <v-btn variant="outlined">목록</v-btn>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>


    <v-row class="lg-12">
      <v-col cols="1"></v-col>
      <v-col>

        <v-card variant="outlined">
          <v-sheet class="mx-auto" width="100%">

            <v-form @submit.prevent>

              <v-text-field
                  v-model="billNo"
                  label="의안번호"
                  required
              ></v-text-field>

              <v-radio-group v-model="proposeType" inline>
                <v-radio label="일부개정" value="일부개정"/>
                <v-radio label="전부개정" value="전부개정"/>
                <v-radio label="제정" value="제정"/>
                <v-radio label="폐지" value="폐지"/>
              </v-radio-group>

              <v-select
                  v-model="billType"
                  :items="['선택', '일반법', '특별법']"
                  label="의안종류"
              />

              <v-text-field
                  v-model="billName"
                  label="의안명"
                  required
              ></v-text-field>

              <!--              <v-file-input label="의안 파일"></v-file-input>-->

              <v-select
                  v-model="proposerType"
                  :items="proposerTypeItems"
                  label="제안구분"
              />

              <v-row v-if="proposerType==='의원'">
                <v-col cols="1">
                  <v-btn>제안자</v-btn>
                </v-col>
                <v-col>
                  <v-text-field
                      label="제안자"
                      required
                  ></v-text-field>
                </v-col>
              </v-row>


              <v-date-input
                  v-model="proposeDate"
                  label="제안일"
                  max-width="368"
              />

              <v-text-field
                  v-model="proposeReason"
                  label="제안이유">

              </v-text-field>

              <v-text-field
                  v-model="proposeContents"
                  label="주요내용">

              </v-text-field>

              <div class="border">
                <p class="text-h4 text-left">의안파일</p>
                <billFileCompType1 fileMode="C" ref="fileRef"/>
              </div>

              <v-btn class="mt-2" type="submit" @click="createBill" block>의안접수</v-btn>

            </v-form>

          </v-sheet>
        </v-card>

      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>