<!--
<script setup>
import axios from "@/axios";
import {onMounted, ref, defineProps} from "vue";
import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  billId : String,Number
});
const data = ref({});


const getData= onMounted(()=>{
  axios.get("http://localhost:8080/api/bill/"+props.billId)
      .then(s=>{
        console.log(s.data.data);
        data.value = s.data.data
      }).catch(e=>console.log(e))
})


</script>

<template>
  <top-title-and-nav></top-title-and-nav>
  <div class="infoArea">
    <div class="infoOne">
      <div><span data-i18n="A:10138">의안종류</span> : </div>
      <div>{{data.billKind}}</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:10139">의안구분</span> : </div>
      <div>일부개정</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">법률명</span> : </div>
      <div>국회도서관법</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">의안명</span> : </div>
      <div>{{data.billName}}</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">의안파일</span> : </div>
      <div>아이콘 / 파일명</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">서명요청 의원</span> : </div>
      <div>이범수, 이범수, 이범수, ABDOULAYE, Bilaly, Fatou, Sokhna, Soukèye, Idrissa, Ndialou, Cheikh Aliou</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">서명한 의원</span> : </div>
      <div> ABDOULAYE, Bilaly, Fatou, Sokhna, Soukèye, Idrissa, Ndialou, Cheikh Aliou </div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">서명부</span> : </div>
      <div>아이콘 / 파일명 </div>
    </div>
    <div class="infoOne80">
      <div><span data-i18n="A:">제안취지</span> : </div>
      <div>
        En dépit d’une réglementation pointilleuse prise en application de l’article 572 du Code des Obligations civiles et commerciales, les prix des loyers des locaux à usage d’habitation n’ont cessé depuis des années de connaître une poussée inflationniste qui affecte
      </div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">비고</span> : </div>
      <div>비고내용</div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">진행상태</span> : </div>
      <div>
        발송 / 의장접수 / 반려
      </div>
    </div>
    <div class="infoOne">
      <div><span data-i18n="A:">반송사유</span> : </div>
      <div>반송사유</div>
    </div>
  </div>
  <div class="buttonArea">
    <button type="button" @click="router.push({name: 'billUpdate', state: {}})" data-i18n="A:">수정</button>
    <button type="button" data-i18n="A:">제출</button>
    <router-link to="/bill/apply"><button type="button" data-i18n="A:">목록</button></router-link>
    <button type="button" data-i18n="A:">출력</button>
    <button type="button" data-i18n="A:">삭제</button>
  </div>
</template>

<style scoped>
.buttonArea button{
  margin-left : 10px
}
.infoArea{
  margin :10px;
  border : 1px solid #C7C7C7;
  border-radius : 4px;
  display: flex;
  flex-direction: column;
  justify-items : center;
}
.infoOne{
  display: grid;
  grid-template-columns :30% 65%;
  height: 65px;
  border-bottom : 1px solid #C7C7C7;
  grid-gap: 10px;
  align-items: center;
}
.infoOne80{
  display: grid;
  grid-template-columns :30% 65%;
  height: 80px;
  border-bottom : 1px solid #C7C7C7;
  grid-gap: 10px;
  align-items: center;
}
</style>
-->

<script setup>
import {inject, onMounted, onUpdated, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';
import avatarsImg from "@/components/AvatarsImg.vue";
//파일 다운로드

/*변수선언*/
const router = useRouter();
const props = defineProps({
  billId: String
});
//memberCnt
const applyDetail = ref({});
const proposerData = ref([]);
const saveForm = ref(null);
const formValid = ref(null);
const memberCnt = ref();
const applyBtn = ref(false);


/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'applyList'});
}

const fnGoUpdate= ()=>{
    router.push({name : 'applyUpdate', params : {  billId: props.billId }});
}

/*상세글가져오기*/
const fnGetData= ()=>{

    const listUrl = `/api/apply/ebsMaster/${props.billId}`;
    let params = {};
    params.API_PATH = listUrl;

    store.dispatch('API_LIST',params).then((data) => {
      console.log(data.resultList);
      applyDetail.value = data.resultList.data.applyDetail;
      proposerData.value=data.resultList.data.proposerList;

      console.log('proposerData.value ::',proposerData.value);

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

//fnApply
/*글수정하기*/
//PR105(접수대기)
//접수대기상태로 의안상태를 바꾼다. 
//제출 전에 서명의원 수 체크하기.
const fnApply= async (e)=>{

  let checkResult = await fnGetApplyStat(props.billId);
  console.log('checkResult :: ',checkResult);

  console.log('checkResult.processYn :: ',checkResult.resultList.data);

  if(!checkResult.resultList.data){
    alert('전체 의원의 1/10 이상이 서명하여야 제출하실 수 있습니다.');
  }else{
    if(!confirm("제출 하시겠습니까?")){
      return;
    }
    
    
    const apitUrl = `/api/apply/ebsMaster/${props.billId}`;
    let params = {};
    params.API_PATH = apitUrl;

    store.dispatch('API_UPDATE',params).then((data) => {

        fnGetData();
        //제출, 수정 버튼 비활성화

    }).catch(({message}) => {
        console.log("message : ", message);
    })

  }



}

//제출 시 동의 서명 의원수 체크
//전체의원의 1/3 이상 서명
const fnGetApplyStat= async (billId)=>{

  const listUrl = `/api/apply/ebsMaster/applyStat`;
  let params = {};

  params.API_PATH = listUrl;
  params.billId = billId;
  params.naTermCd = applyDetail.value.naTermCd;
  try {
    //true/false로 받을수 있도록 하자
    let checkResult = await store.dispatch('API_LIST', params);

    console.log('checkResult :: ',checkResult);

    return checkResult;
  } catch (error) {
    console.log("message : ", error.message);
    return null;
  }

}  


//fnDelete
//명단 삭제 가능 여부 체크하기.
const fnDelete= ()=>{

  if(!confirm("삭제 하시겠습니까?")){

    return;
  }

  const apiUrl = `/api/apply/ebsMaster`;
  let deleteItems = [];
  deleteItems.push(`${props.billId}`);

  let params = {};
  params.API_PATH = apiUrl;
  params.deleteItems = deleteItems;

  store.dispatch('API_DELETE',params).then((data) => {
    
    fnGoList();
    
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
              
              <!--
              //PR101(반송), PR010(서명중)
              -->
                <v-btn variant="outlined" @click="fnGoUpdate" v-if="applyDetail.statCd=='PR010' || applyDetail.statCd=='PR101'">수정</v-btn>
                <v-btn variant="outlined" @click="fnApply" v-if="applyDetail.statCd=='PR010' || applyDetail.statCd=='PR101'">제출</v-btn>
                <v-btn variant="outlined" @click="fnGoList">목록</v-btn>
                <!--
                <v-btn variant="outlined" @click="fnPrint">출력</v-btn>
                -->
                <v-btn variant="outlined" @click="fnDelete">삭제</v-btn>
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
                          의안종류
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billKind }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          제ㆍ개정 구분
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billTy  }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          법률명
                        </th>
                        <td class="text-left">
                          {{ applyDetail.lawNm1 }}
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          의안명
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billName }}
                        </td>
                      </tr>
                      <!--<tr>
                        <th class="text-left">
                          의안파일
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billName }}
                        </td>
                      </tr>-->
                      <tr>
                        <th class="text-left">
                          서명요청 의원
                        </th>
                        <td class="text-left">
                          <template v-for="(item,index) in proposerData" :key="index">
                              <v-chip class="ma-1" variant="outlined">
                                <avatarsImg v-model:url="item.imgPath"/>
                                
                                {{ item.memberNm }}
                              </v-chip>
                            <!--
                            <span v-if="index < proposerData.length - 1">, </span>
                            -->
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <th class="text-left">
                          서명 의원
                        </th>
                        <td class="text-left">
                          <template v-for="(item,index) in proposerData" :key="index">
                              <v-chip class="ma-1" v-if="item.agreeYn=='Y'" variant="outlined">
                                <avatarsImg v-model:url="item.imgPath"/>
                                {{ item.memberNm }}
                              </v-chip>
                            <!--
                            <span v-if="index < proposerData.length - 1">, </span>
                            -->
                          </template>
                        </td>
                      </tr>
                      <!--
                      <tr>
                        <th class="text-left">
                          서명부
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billName }}
                        </td>
                      </tr>
                      -->
                      <tr>
                        <th class="text-left">
                          제안취지
                        </th>
                        <td class="text-left">
                          {{ applyDetail.smrCn }}
                        </td>
                      </tr>
                    <!--
                      <tr>
                        <th class="text-left">
                          비고
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billName }}
                        </td>
                      </tr>
                      -->
                      <tr>
                        <th class="text-left">
                          진행상태
                        </th>
                        <td class="text-left">
                          <!-- 발송, 의장접수, 반려 -->

                          <span v-if="applyDetail.statCd=='PR105'">
                            발송
                          </span>
                          <span v-if="applyDetail.statCd=='PR110'">
                            의장접수
                          </span>
                          <span v-if="applyDetail.statCd=='PR101'">
                            반려
                          </span>
                        </td>
                      </tr>
                      <!--
                      <tr>
                        <th class="text-left">
                          반송 사유
                        </th>
                        <td class="text-left">
                          {{ applyDetail.billName }}
                        </td>
                      </tr>
                      -->
                    </tbody>
                  </v-table>
  
  
                    </v-col>
                    </v-row>
                    <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card>           
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>

      </v-container>
    
    </template>