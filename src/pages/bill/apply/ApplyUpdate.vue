<script setup>
import {inject, onMounted, watch, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';
import requestSignModal from "@/modal/RequestSignModal.vue";
import lawNmModal from "@/modal/LawNmModal.vue";

/*변수선언*/
const router = useRouter();

const props = defineProps({
  billId: String
});



const billInfo=ref({});
const saveForm = ref(null);
const formValid = ref(null);
const showModal = ref(false);
const showLawNmModal = ref(false);

const applyDetail = ref({});
const proposerData = ref([]);

const groups = ref([]);


const users = ref([]);

const selectedGroups = ref([]);
const selectedUsers = ref([]);



const arrayBuffer = ref(null);

billInfo.value.billKind = 'billKind02';
billInfo.value.billSubKind = '';
billInfo.value.billType = '03';


function isArrayBuffer(data) {
  return data instanceof ArrayBuffer;
}


const openModal = () => {
  showModal.value = true;
}

const openLawNmModal = () => {
  showLawNmModal.value = true;
}

const closeModal = (reload) => {
  showModal.value = false;
}


const handleApply = (selection) => {

  billInfo.value.groupList = selection.groups;
  billInfo.value.memberList = selection.users;
  selectedGroups.value = selection.groups.map(groupId => {
    const group = groups.value.find(group => group.value === groupId);
    return group ? { grpId: group.value, grpNm: group.title } : null;
  }).filter(group => group !== null);

  selectedUsers.value = selection.users.map(userId => {
    const user = users.value.find(user => user.value === userId);
    return user ? { memberId: user.value, memberNm: user.title } : null;
  }).filter(user => user !== null);

  console.log('selection.groups :: ',selection.groups);
  console.log('selectedGroups :: ',selectedGroups.value);
}

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'applyList'});
}


const fnValidate= (e)=>{
    const data = saveForm.value?.validate();
/*
    let checkResult = await fnGetRegStat(billInfo.value.groupList, billInfo.value.memberList);
    
    if(formValid.value){
      if(checkResult.resultList.data){
        return formValid.value;
      }
    }
*/
    return formValid.value;

};

const fnGoDetail= (billId)=>{
    router.push({name : 'applyDetail', params : {  billId: props.billId }});
};

const fnSave= async (e)=>{

    if(!fnValidate()) {
        return;
    }else{
      let checkResult = await fnGetRegStat(billInfo.value.groupList, billInfo.value.memberList);
    
      if(!checkResult){
          return;
      }else if(!checkResult.resultList.data){
          return;
      }
    }

    const jsonData = {
      billId : props.billId,
      groupList : billInfo.value.groupList,
      memberList : billInfo.value.memberList,
      smrCn : applyDetail.value.smrCn
    }

    const apiUrl = "/api/apply/ebsMaster";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_UPDATE',params).then((data) => {

        console.log(data);
        
        fnGoDetail();

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnGetRegStat= async (groupList, memberList)=>{

  const listUrl = `/api/apply/ebsMaster/regStat`;
  let params = {};

  params.API_PATH = listUrl;

  params.groupList = groupList? groupList.join(','): null;
  params.memberList = memberList? memberList.join(','): null;

  try {
    //true/false로 받을수 있도록 하자
    let checkResult = await store.dispatch('API_LIST', params);


    return checkResult;
  } catch (error) {
    console.log("message : ", error.message);
    return null;
  }

}  

/*상세글가져오기*/
const fnGetData= ()=>{

const listUrl = `/api/apply/ebsMaster/${props.billId}`;
let params = {};
params.API_PATH = listUrl;

store.dispatch('API_LIST',params).then((data) => {
  console.log(data.resultList);
  applyDetail.value = data.resultList.data.applyDetail;
  proposerData.value = data.resultList.data.proposerList;

  selectedUsers.value = data.resultList.data.proposerList;
  console.log('proposerData.value ::',proposerData.value);

  billInfo.value.groupList = [];
  billInfo.value.memberList = proposerData.value.map(member => member.proposerId);

}).catch(({message}) => {
    console.log("message : ", message);
})

}

const fnGetModalData= ()=>{

  const listUrl = `/api/apply/ebsMaster/memberandgroup`;
  let params = {};
  params.API_PATH = listUrl;

  store.dispatch('API_LIST',params).then((data) => {
    console.log('memberandgroup',data.resultList);
    //users.value=data.resultList.data.memberList;

    users.value = data.resultList.data.memberList.map(user => ({
      title : user.memberNm,
      value : user.memberId
    }));

    groups.value = data.resultList.data.groupList.map(group => ({
      title : group.grpNm,
      value : group.grpId
    }));
    
    //users.value = data.resultList.data.memberList;

  }).catch(({message}) => {
      console.log("message : ", message);
  })

}



/*Dom객체 완성이후*/
onMounted( () => { 
  fnGetData();
  fnGetModalData();

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
                <v-sheet class="mx-auto" width="100%">

                    <v-form @submit.prevent ref="saveForm" v-model="formValid">

                      <v-label>의안종류</v-label>
                      <v-row>
                        <v-col>
                          {{ applyDetail.billKind }}

                        </v-col>

                      </v-row>

                      <v-label>재ㆍ개정구분</v-label>
                      <v-row>
                        <v-col>
                          {{ applyDetail.billTy }}

                        </v-col>

                      </v-row>
                      <v-label>법률명</v-label>
                      <v-row>
                        <v-col>
                          {{ applyDetail.lawNm1 }}

                        </v-col>

                      </v-row>
                      <v-label>의안명</v-label>
                      <v-row>
                        <v-col>
                          {{ applyDetail.billName }}

                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col>
                          <v-card>
                              <v-card-title>
                                <v-row>
                                  <v-col>
                                    서명요청 대상

                                  </v-col>
                                  <v-col align="end">

                                    <v-btn variant="outlined" @click="openModal" >검색</v-btn>
                                  </v-col>

                                </v-row>
                              </v-card-title>
                              <v-card-text label="서명요청 대상" >
                                <template v-for="(item,index) in selectedGroups" :key="index">
                                  <v-chip variant="outlined">
                                    {{ item.grpNm }}
                                  </v-chip>
                                </template>

                                <template v-for="(item,index) in selectedUsers" :key="index">
                                  <v-chip variant="outlined">
                                    {{ item.memberNm }}
                                  </v-chip>
                                </template>
                              </v-card-text>

                          </v-card>

                        </v-col>

                      </v-row>
                      <v-label>서명 의원</v-label>
                      <v-row>
                        <v-col>
                          <template v-for="(item,index) in proposerData" :key="index">
                              <v-chip class="ma-1" v-if="item.agreeYn=='Y'" variant="outlined">
                                {{ item.memberNm }}
                              </v-chip>
                            <!--
                            <span v-if="index < proposerData.length - 1">, </span>
                            -->
                          </template>

                        </v-col>

                      </v-row>
                      <v-label>제안취지</v-label>
                      <v-row>
                        <v-col>
                          <v-textarea v-model="applyDetail.smrCn" label="제안취지"></v-textarea>

                        </v-col>

                      </v-row>



                        <v-btn class="mt-2" type="submit" @click="fnSave" block>저장</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
      <requestSignModal v-if="showModal" :show="showModal" :groups="groups" :users="users" :savedMembers="proposerData" @apply="handleApply" @close="closeModal"/>

    </template>