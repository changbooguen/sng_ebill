<script setup>
import store from '@/store';
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as XLSX from 'xlsx'; //npm install xlsx 

/** 변수 선언 */
const router = useRouter();
const userVailCount = ref(0);
const chkUserList = ref([]); 
const tableDatas = ref([]); 
const delChecked = ref([]);
const headers = [
            { title: '아이디', align: 'center', key: 'memberId', sortable: false },
            { title: '이름', align: 'center', key: 'memberNm', sortable: true },
            { title: '성별', align: 'center', key: 'genCd', sortable: true },
            { title: '정당', align: 'center', key: 'polyNm', sortable: true },
            { title: '대별코드', align: 'center', key: 'ageCd', sortable: false },
            { title: '소속위원회', align: 'center', key: 'cmitCd', sortable: false },
            { title: '이메일', align: 'center', key: 'email', sortable: false },
            { title: '부서', align: 'center', key: 'deptCd', sortable: false },
]; 

/** function List */

/** excel파일 업로드 */
const fnExcelUpload = (event) => {
  //작업 전 초기화
  userVailCount.value = 0;
  tableDatas.value = [];

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
        memberId: row[0],
        memberNm: row[1],
        pswd: row[2],
        genCd: row[10],
        polyNm: row[3],
        ageCd: row[4],
        cmitCd: row[5],
        email: row[6],
        deptCd: row[7],
      }));

      tableDatas.value = formattedData // 데이터 행(첫 번째 행 제외)를 가져와 저장
      
      await fnIdSearch();
    };
    
    reader.readAsArrayBuffer(file); // 파일을 ArrayBuffer로 읽음
  }
}

/** DB에 등록된 아이디 조회 */
const fnIdSearch = async () => {
  const excelUserId = ref([]);

  for (let i = 0;  i < tableDatas.value.length; i++){
    excelUserId.value.push(tableDatas.value[i].memberId);
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
    const memberId = tableDatas.value[i].memberId; 
    if (ids[memberId]) {
      return false; // 중복된 아이디 발견 시 false 반환
    }
    ids[memberId] = true; // 객체에 아이디 저장
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
    alert("중복되는 아이디가 존재합니다.");
    return false; 
  }
  
  for (let i = 0; i < tableDatas.value.length; i++) {
    const memberId = tableDatas.value[i].memberId ? tableDatas.value[i].memberId : '';
    const memberNm = tableDatas.value[i].memberNm ? tableDatas.value[i].memberNm : '';
    const pswd = tableDatas.value[i].pswd ? tableDatas.value[i].pswd : '';
    const pswdChk = tableDatas.value[i].pswd ? tableDatas.value[i].pswd : '';
    const polyCd = tableDatas.value[i].polyCd ? tableDatas.value[i].polyCd : '';
    const ageCd = tableDatas.value[i].ageCd ? tableDatas.value[i].ageCd : '';
    const cmitCd = tableDatas.value[i].cmitCd ? tableDatas.value[i].cmitCd : '';
    const email = tableDatas.value[i].email ? tableDatas.value[i].email : '';
    const deptId = tableDatas.value[i].deptId ? tableDatas.value[i].deptId : 1; // 임시 부서아이디
    const statCd = tableDatas.value[i].statCd ? tableDatas.value[i].statCd : true; // 임시 상태 값
    const mblNo = tableDatas.value[i].mblNo ? tableDatas.value[i].mblNo : '';
    const inrNo = tableDatas.value[i].inrNo ? tableDatas.value[i].inrNo : '';
    const genCd = tableDatas.value[i].genCd ? tableDatas.value[i].genCd : '';

    const jsonData = {
      memberId: memberId,
      memberNm: memberNm,
      pswd: pswd,
      pswdChk: pswdChk,
      polyCd: polyCd,
      ageCd: ageCd,
      cmitCd: cmitCd,
      email: email,
      deptId: deptId,
      statCd: statCd,
      mblNo: mblNo,
      inrNo: inrNo,
      genCd: genCd,
    }

    const apiUrl = "/api/members";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;


    store.dispatch('API_SAVE', params).then((data) => {

    }).catch(({message}) => {
      console.log("message : ", message);
    })
  }

  alert("일괄 저장되었습니다.");
  tableDatas.value = [];
};


/** 삭제 */
const fnDelete = () => {

  if(delChecked.value.length == 0){
    alert("사용자를 선택해 주세요");
    return false;
  }
  
  if(!confirm("사용자를 삭제 하시겠습니까?")){
    return ;
  }

  const memberIdsToDelete = delChecked.value.map(item => item.memberId);
  const filteredData = tableDatas.value.filter(item => !memberIdsToDelete.includes(item.memberId));

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
      국회의원 일괄 등록
    </v-row>
    <v-row>
      최대 000명 까지 등록 할 수 있습니다.
    </v-row>

    <v-row>
      <v-col cols="3"></v-col>
      <v-col>
        <v-file-input label="File input" id="excelFile" type="file" @change="fnExcelUpload"></v-file-input>
      </v-col>
      <v-col>
        <v-btn variant="outlined" id="xlsxDown" href="/files/국회의원_저쟝양식.xlsx" download>양식 다운로드</v-btn>
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
  .buttonGroup{
    display: flex;
    justify-content: flex-end;
  }

  #xlsxDown{
    text-decoration: none;
    color: black;
  }
  
  .header{
    display: flex;
    padding-left: 25rem;
  }

  .v-file-excel-cls{
    width: 20rem;
  }
</style>