<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';
import avatarsImg from "@/components/AvatarsImg.vue";
//의안상태에 따라서 목록에서 제외해야함
//상태코드 - 상태명
//파일 다운로드
//번호
//서명할 수 없는 상태?


/*변수선언*/
const router = useRouter();
const props = defineProps({
  billId: String
});

const agreeDetail = ref({});
const saveForm = ref(null);
const formValid = ref(null);
const proposerData = ref([]);
const agreeBtn = ref(false);

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'agreeList'});
}


/*상세글가져오기*/
const fnGetData= ()=>{

    const listUrl = `/api/agree/${props.billId}`;
    let params = {};
    params.API_PATH = listUrl;

    store.dispatch('API_LIST',params).then((data) => {
      console.log(data.resultList);
      agreeDetail.value = data.resultList.data.agreeDetail;
      proposerData.value=data.resultList.data.proposerList;

      if(agreeDetail.value.agreeYn==='Y'){
        agreeBtn.value=true;
      }else{
        agreeBtn.value=false;
      }

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnGetStat= async (billId, funcGubun)=>{

  const listUrl = `/api/agree/stat`;
  let params = {};

  params.API_PATH = listUrl;
  params.billId = billId;
  params.funcGubun = funcGubun;

  try {
    let checkResult = await store.dispatch('API_LIST', params);

    

    return checkResult;
  } catch (error) {
    console.log("message : ", error.message);
    return null;
  }

}  

/*글수정하기*/
const fnSave= async (e)=>{

  

  let checkResult = await fnGetStat(props.billId,'FN001');
  console.log('checkResult :: ',checkResult);

  console.log('checkResult.processYn :: ',checkResult.resultList.data);

  //서명 변경 가능여부 체크 //취소가능이랑 서명 가능을 둘다 구분을 줘야겠지? 
  if(!checkResult.resultList.data.processYn){
    if(checkResult.resultList.data.statNm!=null){
      alert(checkResult.resultList.data.statNm+' 상태이므로 요청 처리할 수 없습니다.');
    }else{
      alert('서명요청 처리불가 상태이므로 요청 처리할 수 없습니다.');
    }
  }else{

    //현재 동의서명 한 상태(Y)이면 버튼 눌렀을때 서명 취소를 하는 것(N)이므로
    
    if(agreeDetail.value.agreeYn=='Y'){
      agreeDetail.value.agreeYn='N'
    }else{
      agreeDetail.value.agreeYn='Y'
    }
    
    const jsonData = {
      billId: `${props.billId}`,
      agreeYn: `${agreeDetail.value.agreeYn}`
    };
    
    const apitUrl = `/api/agree`;
    let params = {};
    params.API_PATH = apitUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE',params).then((data) => {

        //this.$router.push(`/sample/GridMng`);
        if(data.resultObj.data.agreeYn==='Y'){
          agreeBtn.value=true;
        }else if(data.resultObj.data.agreeYn==='N'){
          agreeBtn.value=false;
        }

        fnGetData();

    }).catch(({message}) => {
        console.log("message : ", message);
    })

  }
  


}

//fnDeleteProposer
//명단 삭제 가능 여부 체크하기.
const fnDeleteProposer= (proposerId)=>{

  if(!confirm("삭제 하시겠습니까?")){
    return;
  }

  const apiUrl = `/api/agree/${props.billId}`;
  let deleteItems = [];
  deleteItems.push(`${proposerId}`);

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE',params).then((data) => {
    
    console.log(data.resultList);
    fnGetData();
    
  }).catch(({message}) => {
      
    console.log("message : ", message);

  })

}  




/*Dom객체 완성이후*/
onMounted( () => {
    fnGetData();
});

</script>

<template>

    <v-container class="lg-12">
    
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            
            <v-col  align="end">

                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
  
  
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
    
                <v-card  variant="outlined">
                    <v-row class="lg-12"><v-col></v-col></v-row>
  
                    <v-row align="center" class="lg-12">
                    <v-col>
  
  
                  <v-table>
                    <tbody>
                      <tr>
                        <th class="text-left">
                          제안의원
                        </th>
                        <td class="text-left">
                          {{ agreeDetail.ppsrNm }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          의안명
                        </th>
                        <td class="text-left">
                          {{ agreeDetail.billName }}
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
  
  
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
              <v-btn variant="outlined" @click="fnSave" v-if="agreeBtn&&agreeDetail.ppsrId!=store.getters.userId">서명취소</v-btn>
              <v-btn variant="outlined" @click="fnSave" v-else-if="agreeDetail.ppsrId!=store.getters.userId">서명</v-btn>
              <v-btn variant="outlined">서명부보기</v-btn>
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>        
        <v-row class="lg-12">
            <v-col cols="1"></v-col>
            <v-col>
    
                <v-card  variant="outlined">
                  <v-card-title>발의의원</v-card-title>
                  <v-card-text>

  
                    <v-row align="center" class="lg-12">
                    <v-col>
  
                      
                  <v-table >
                    <tbody>
                      <tr>
                        <td class="text-left">
                          <template v-for="(item,index) in proposerData" :key="index">
                              <v-chip class="ma-1" v-if="item.agreeYn=='Y'" variant="outlined">
                                <avatarsImg v-model:url="item.imgPath"/>
                                {{ item.memberNm }}
                              </v-chip>
                              <v-chip class="ma-1" variant="plain" v-else-if="item.agreeYn=='N'&&agreeDetail.ppsrId!=store.getters.userId">
                                <avatarsImg v-model:url="item.imgPath"/>
                                {{ item.memberNm }}
                              </v-chip>
                              <v-chip class="ma-1" closable variant="plain" v-else-if="item.agreeYn=='N'&&agreeDetail.ppsrId==store.getters.userId" @click:close="fnDeleteProposer(item.proposerId)">
                                <avatarsImg v-model:url="item.imgPath"/>
                                {{ item.memberNm }}
                              </v-chip>
                            <!--
                            <span v-if="index < proposerData.length - 1">, </span>
                            -->
                          </template>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
  
  
                    </v-col>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                  </v-card-text>
                </v-card>           
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>    
      </v-container>
    
    </template>