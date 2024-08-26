<script setup>
import searchDate from "@/components/SearchDate.vue";
import store from '@/store';
import {ref, reactive, onMounted, shallowRef} from "vue";

const tableDatas = ref([]);

const searchUserId = ref('');
const searchReqUrl = ref('');
const searchStartDate = ref(null);
const searchEndDate = ref(null);



const headers = [
  { title: '아이디', align: 'center', key: 'userId', sortable: true },
  { title: '사용자명', align: 'center', key: 'userNm', sortable: true },
  { title: '주소', align: 'center', key: 'reqUrl', sortable: true ,cellProps:{class:"textLeftClass"}},
  { title: 'IP', align: 'center', key: 'accessIp', sortable: true },
  { title: '접속일자', align: 'center', key: 'reqDt', sortable: false }
];    

const requestSearchDate = async (data) => {
  searchStartDate.value = data.startDate;
  searchEndDate.value = data.endDate;
}

/*검색어리셋*/
const fnReset= (e)=>{
    searchUserId.value = "";
    searchReqUrl.value = "";
    searchStartDate.value=null;
    searchEndDate.value=null;
}

const fnSearch= ()=>{
  
  const listUrl = "/api/accessHist";
  let params = {};
  params.API_PATH = listUrl;
  params.userId = searchUserId.value;
  params.reqUrl = searchReqUrl.value;
  params.startDate = searchStartDate.value;
  params.endDate = searchEndDate.value;
  params.size = 1000;

  store.dispatch('API_LIST',params).then((data) => {

      tableDatas.value = data.resultList;

      console.log(data)
      console.log(data.resultList);

  }).catch(({message}) => {
      console.log("message : ", message);
  })

}

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

/*Dom객체 완성이후*/
onMounted( () => {

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 1);
  
  searchEndDate.value = formatDate(today);
  searchStartDate.value = formatDate(oneWeekAgo);

  fnSearch();

});

</script>

<template>

  <v-container class="lg-12">
    
    
    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>
            <v-card variant="outlined">
            
                <v-row class="lg-12"><v-col></v-col></v-row>

                <v-row align="center" class="lg-12">
                  <v-col cols="2">
                      <v-text-field label="아이디" type="input" @keydown.enter="fnSearch" v-model="searchUserId"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                      <v-text-field label="접속주소" type="input" @keydown.enter="fnSearch" v-model="searchReqUrl"></v-text-field>
                  </v-col>
  
                  <searchDate v-model:start="searchStartDate" v-model:end="searchEndDate" @search="requestSearchDate"/>
                    
                  <v-col>
                    <v-row align="center" justify="center">
                      <v-col cols="auto">
                        <v-btn variant="outlined" @click="fnSearch">조회</v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn variant="outlined" @click="fnReset">reset</v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="lg-12"><v-col></v-col></v-row>
            </v-card>
            
        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col  align="end">
        </v-col>
        <v-col cols="1"></v-col>
    </v-row>


    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>

            <v-card  variant="outlined">          
                <v-row class="lg-12"><v-col></v-col></v-row>
                <v-row align="center" class="lg-12">

                <v-data-table
                  :headers="headers"
                  :items="tableDatas"
                  density="compact"
                >


                </v-data-table>

                </v-row>
                <v-row class="lg-12"><v-col></v-col></v-row>
            </v-card>           

        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

  </v-container>
</template>

<style scoped>

</style>