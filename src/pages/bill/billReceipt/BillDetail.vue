<script setup>

import store from "@/store";
import {onMounted, ref} from "vue";

const props = defineProps({
  id: String
});

const item = ref({});

const getData = () => {

  // <TODO> 접수완료가 아닌 다음 스텝으로 넘어가는 경우도 만들어 줘야함.
  const apiUrl = `/api/bill-receipt/${props.id}`;

  let params = {};
  params.API_PATH = apiUrl;

  store.dispatch('API_LIST', params).then((data) => {

    console.log(data.resultList);
    if (data.resultList.proposerType === '정부') {
      data.resultList.proposerName = '정부';
    }

    item.value = data.resultList;

  }).catch((error) => {
    const errorResponse = error.response.data;
    if (errorResponse.code === 403) {
      alert(errorResponse.message);
      history.back();
    }
  })

}
onMounted(() => {
  getData();
});
</script>

<template>
  <v-container class="lg-12">

    <v-row class="lg-12">
      <v-col cols="1"></v-col>

      <v-col align="end">
        <v-btn variant="outlined">수정</v-btn>
        <v-btn variant="outlined">삭제</v-btn>
        <v-btn variant="outlined">목록</v-btn>
      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

    <v-row class="lg-12">
      <v-col cols="1"></v-col>
      <v-col>
        <b>상세 정보 - [{{ item.billNo }}] {{ item.billName }} </b>
      </v-col>
    </v-row>


    <v-row class="lg-12">
      <v-col cols="1"></v-col>
      <v-col>

        <v-card variant="outlined">
          <v-row class="lg-12">
            <v-col></v-col>
          </v-row>

          <v-row align="center" class="lg-12">
            <v-col>


              <v-table>
                <thead>
                <tr>
                  <th class="text-left" rowspan="2">접수</th>
                  <th class="text-left">대수</th>
                  <th class="text-left">의안번호</th>
                  <th class="text-left">제안일</th>
                  <th class="text-left">제안자</th>
                  <th class="text-left">문서</th>
                  <th class="text-left">회기</th>
                </tr>

                </thead>

                <tbody>
                <tr>

                  <td>

                  </td>

                  <td>
                    {{ item.age }}
                  </td>
                  <td>
                    {{ item.billNo }}
                  </td>
                  <td>
                    {{ item.proposeDate }}
                  </td>

                  <td>
                    {{ item.proposerName }}
                  </td>

                  <td>

                  </td>

                  <td>

                  </td>

                </tr>
                </tbody>
              </v-table>


            </v-col>
          </v-row>
          <v-row class="lg-12">
            <v-col></v-col>
          </v-row>
        </v-card>

      </v-col>
      <v-col cols="1"></v-col>
    </v-row>

  </v-container>

</template>

<style scoped>

</style>