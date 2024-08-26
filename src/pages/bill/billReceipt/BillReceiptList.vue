<script setup>

import {onMounted, ref} from "vue";
import store from "@/store";
import {useRouter} from "vue-router";
import {VDateInput} from 'vuetify/labs/VDateInput'
import TitleComp from "@/pages/sample/sampleComponents/TitleComp.vue";
import PaginationComp from "@/pages/sample/sampleComponents/PaginationComp.vue";

const router = useRouter();

const billNo = ref(null);
const billName = ref(null);
const proposeDate = ref(null);
const searchDate = ref(null);

console.log("BillReceiptList!");

const billStatusList = ref(['전체', '접수완료', '소관위접수', '소관위심사', '본회의']);
const billStatusDefault = ref('전체'); // 기본값 설정

const headers = [
  {title: '의안번호', align: 'left', key: 'billNo', sortable: true},
  {title: '의안명', align: 'left', key: 'billName', sortable: true},
  {title: '제안자', align: 'left', key: 'proposerName', sortable: false},
  {title: '제안일', align: 'center', key: 'proposeDate', sortable: false},
  {title: '상임위', align: 'center', key: 'committeeName', sortable: false},
  {title: '회부일', align: 'center', key: 'submitDt', sortable: false},
  {title: '처리결과', align: 'center', key: 'billStatus', sortable: false}
];

const tableData = ref([]);

const isReset = ref(false);

const setParams = () => {
  let params = {};
  params.API_PATH = "/api/bill-receipt";

  if (isReset.value) {
    billName.value = null;
    billNo.value = null;
    searchDate.value = null;
    proposeDate.value = null;
  }

  params.billName = billName.value;
  params.billNo = billNo.value;
  params.proposeDate = proposeDate.value;

  params.page = 1
  params.size = 100

  return params;
}

const getData = () => {

  const params = setParams();
  console.log("params : ", params);

  store.dispatch('API_LIST', params).then((data) => {


    for (let i = 0; i < data.resultList.content.length; i++) {
      if (data.resultList.content[i].proposerType === '정부') {
        data.resultList.content[i].proposerName = '정부';
      }
    }

    console.log("data.resultList.content : ", data.resultList);

    tableData.value = data.resultList.content;

    isReset.value = false;

  }).catch(({message}) => {
    console.log("message : ", message);
  })
}

const reset = () => {
  isReset.value = true;

  getData();
}

const goDetail = (e, row) => {
  console.log(row.item);
  router.push({name: 'billDetail', params: {id: row.item.billId}});
}


function selectStatus() {
  console.log(billStatusList.value);
}

function selectDate() {
  console.log("preDate : ", searchDate.value)

  let formatMonth = zeroLpad(searchDate.value.getMonth() + 1);
  let formatDay = zeroLpad(searchDate.value.getDate());

  proposeDate.value = searchDate.value.getFullYear() + "-" + formatMonth + "-" + formatDay;
  //
  // console.log(proposeDate.value);

  getData();
}

function zeroLpad(str) {
  str = str.toString();

  if (str.length < 2) {
    str = "0" + str;
  }

  return str;
}

const billCreate = (e, row) => {
  router.push({name: 'billCreate'});
}

onMounted(() => {
  getData();
})


</script>

<template>
  <main class="content_frame">
    <section class="content_bundle">

      <TitleComp>
        <template #titleName>동의서명</template>
      </TitleComp>


      <article class="basic panel">
        <div class="panel_bundle">
          <div class="input_group row">
            <label>의안번호</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
                @keydown.enter="getData" v-model="billNo"
            ></v-text-field>
          </div>

          <div class="input_group row">
            <label>의안명</label>
            <v-text-field
                density="compact"
                variant="outlined"
                hide-details
                min-width="250"
                @keydown.enter="getData" v-model="billName"
            ></v-text-field>
          </div>

          <div class="input_group row">
            <label>상태</label>
            <v-select
                density="compact"
                v-model="billStatusDefault"
                :items="billStatusList"
                item-title="state"
                item-value="abbr"
                variant="outlined"
                hide-details
                persistent-hint
                return-object
                single-line
                class="select_input"
                @change="selectStatus"
            ></v-select>
          </div>

          <div class="input_group row">
            <label>제안일</label>
            <v-date-input prepend-icon="" density="compact" variant="outlined" persistent-placeholder
                          v-model="searchDate" @update:model-value="selectDate" hide-details="true"></v-date-input>
          </div>

          <div class="input_group row">
            <label>위원회</label>
            <!-- <TODO> 위원회 데이터가 생기면 v-model, items 변경해줘야함.-->
            <v-select
                density="compact"
                v-model="billStatusDefault"
                :items="billStatusList"
                item-title="state"
                item-value="abbr"
                variant="outlined"
                hide-details
                persistent-hint
                return-object
                single-line
                class="select_input"
            ></v-select>
          </div>

          <div class="input_group">
            <v-btn style="margin-right: 5%;" @click="getData">조회</v-btn>
            <v-btn @click="reset">Reset</v-btn>
          </div>

        </div>

        <div class="panel_bundle">
          <div class="input_group row"></div>
        </div>
      </article>

      <article class="basic">
        <v-data-table
            :headers="headers"
            :items="tableData"
            density="compact"
            item-key="billId"
            items-per-page="10"
            @dblclick:row="goDetail"
            hover="true"
        >
          <template v-slot:[`item.billId`]="{ item }">
            <span>&nbsp;{{ item.billName }}</span>
          </template>

        </v-data-table>
      </article>

    </section>
  </main>
</template>

<style scoped>

</style>