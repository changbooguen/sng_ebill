<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import * as XLSX from 'xlsx'; //npm install xlsx 

/* 변수선언 */
const router = useRouter();
const userVailCount = ref(0);
const tableDatas = ref([]); 
const delChecked = ref([]);
const headers = [
            { title: '아이디', align: 'center', key: 'userId', sortable: false },
            { title: '이름', align: 'center', key: 'userNm', sortable: true },
            { title: '부서', align: 'center', key: 'deptNm', sortable: true },
            { title: '직무', align: 'center', key: 'posCd', sortable: true },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '전화번호', align: 'center', key: 'inrNo', sortable: false },
            { title: '재직', align: 'center', key: 'statCd', sortable: false },
            
]; 

/** function List */

/** excel파일 업로드 */
const fnExcelUpload = (event) => {
  const file = event.target.files[0]; // 업로드된 파일 가져오기
  
  if (file) {
    const reader = new FileReader(); // 파일을 읽기 위한 FileReader 객체 생성
    
    reader.onload = async (e) => { // 파일 로드 완료시 실행
      const data = new Uint8Array(e.target.result); // 파일 데이터를 Uint8Array로 변환
      const workbook = XLSX.read(data, { type: 'array' }); // 엑셀 파일을 읽음
      
      const firstSheetNm = workbook.SheetNames[0]; // 첫 번째 시트 명 가져오기
      const worksheet = workbook.Sheets[firstSheetNm]; // 첫 번째 시트 가져오기
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // sheet_to_json을 사용하여 시트를 JSON 데이터로 변환
      
      const formattedData = jsonData.slice(1).map(row => ({
        userId: row[0],
        userNm: row[1],
        pswd: row[2],
        deptNm: row[3],
        posCd: row[4],
        email: row[5],
        inrNo: row[6],
        statCd: row[7],
      }));

      tableDatas.value = formattedData // 데이터 행(첫 번째 행 제외)를 가져와 저장
      
      await fnIdSearch();
    };
    
    reader.readAsArrayBuffer(file); // 파일을 ArrayBuffer로 읽음
  }
}

/** DB에 등록된 아이디 조회 */
const fnIdSearch = () => {
  const excelUserId = ref([]);

  for (let i = 0;  i < tableDatas.value.length; i++){
    excelUserId.value.push(tableDatas.value[i].userId);
  }

  const listUrl = `/api/userVail/${excelUserId.value}`;
  let params = {};
  params.API_PATH = listUrl;

  store.dispatch('API_LIST',params).then((data) => {

    userVailCount.value = data.resultList.count
  }).catch(({message}) => {
    console.log("message : ",message)
  })

}

/** 엑셀데이터 중 중복된 아이디 조회 */
const validateId = () => {
  const ids = {}; 
  for (let i = 0; i < tableDatas.value.length; i++) {
    const userId = tableDatas.value[i].userId; 

    if (ids[userId]) {
      return false; // 중복된 아이디 발견 시 false 반환
    }
    ids[userId] = true; // 객체에 아이디 저장
  }
  return true; // 중복된 아이디가 없으면 true 반환
}

/** 등록 */
const fnSave = async () => {

  if(tableDatas.value.length == 0){
    alert("등록할 사용자가 없습니다.");
    return false;
  }

  if (!validateId()) {
    alert("중복되는 아이디가 존재합니다.")
    return false; 
  }

  for (let i = 0; i < tableDatas.value.length; i++) {
    const userId = tableDatas.value[i].userId;
    const userNm = tableDatas.value[i].userNm;
    const pswd = tableDatas.value[i].pswd; 
    const pswdChk = tableDatas.value[i].pswd;
    const posCd = tableDatas.value[i].posCd;
    const email = tableDatas.value[i].email;
    const inrNo = tableDatas.value[i].inrNo;
    const deptId = tableDatas.value[i].deptId; //임시 부서아이디
    const statCd = true; //임시 상태 값
    const role = "USER"

    const jsonData = {
      userId: userId,
      userNm: userNm,
      pswd: pswd,
      pswdChk: pswdChk,
      posCd: posCd,
      email: email,
      statCd: statCd,
      deptId: deptId,
      role: role,
      inrNo: inrNo,
    }

    const apiUrl = "/api/users";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {
      
    }).catch(({message}) => {
      console.log("message : ", message);
    })
  }

  // if(data)
  alert("일괄 저장되었습니다.");
  tableDatas.value = [];

}

/** 선택항목 삭제 */
const fnDelete = () => {

  if(delChecked.value.length == 0){
    alert("사용자를 선택해 주세요");
    return false;
  }
  
  if(!confirm("사용자를 삭제 하시겠습니까?")){
    return ;
  }
  const userIdsToDelete = delChecked.value.map(item => item.userId);
  const filteredData = tableDatas.value.filter(item => !userIdsToDelete.includes(item.userId));

  tableDatas.value = filteredData;
}

const fnGoList = () => {
  router.push('/userTapMng');
}

/** Dom객체 완성이후 */
onMounted( () => {

});

</script>

<template>
  <v-container>
    <v-row>
        국회직원 일괄 등록
    </v-row>
    <v-row>
      최대 000명까지 등록할 수 있습니다.
    </v-row>

    <v-row>
      <v-col cols="3"></v-col>
      <v-col>
        <v-file-input label="File input" id="excelFile" type="file" @change="fnExcelUpload"></v-file-input>
      </v-col>
      <v-col>
        <v-btn variant="outlined" id="xlsxDown" href="/files/국회직원_저쟝양식.xlsx" download>양식 다운로드</v-btn>
      </v-col>
    </v-row>

    <v-row justify="end"> 
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnSave">등록</v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
      </v-col>
    </v-row>

    <v-row>
      전체 {{ tableDatas.length }}개 ({{ userVailCount }}개 등록가능 {{ tableDatas.length - userVailCount}}개 등록 불가능)
    </v-row>  

    <v-row>
      <v-data-table
        :headers="headers"
        item-key="id"
        :items="tableDatas"
        show-select
        return-object
        v-model="delChecked"
      >
      </v-data-table>
    </v-row>  

  </v-container>
</template>

<style scoped>

</style>