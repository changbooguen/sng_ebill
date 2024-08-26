<script setup>
import {inject, onMounted, watch, ref} from "vue";
import {useRouter} from "vue-router";
import store from '@/store';
import requestSignModal from "@/modal/RequestSignModal.vue";
import lawNmModal from "@/modal/LawNmModal.vue";

/*변수선언*/
const router = useRouter();

const title = ref('');
const title_rules = [
        value => {
          if (value) return true
          return '제목은 필수 입력값입니다.'
        },
    ];

const billInfo=ref({});
const contents = ref('');
const isImportant = ref(false);
const saveForm = ref(null);
const formValid = ref(null);
const autocompleteItems = ref([{title:'선택', value:''},{title:'법률안', value:'02'},{title:'예산안', value:'03'}]);
const showModal = ref(false);
const showLawNmModal = ref(false);
const lawId = ref('');
const lawNm1 = ref('');
const lawNm2 = ref('');



const groups = ref([]);


const users = ref([]);

const selectedGroups = ref([]);
const selectedUsers = ref([]);

//isSelectEnabled
const isSelectEnabled = ref(true);
const isBillTypeSelectEnabled = ref(false);


const arrayBuffer = ref(null);

billInfo.value.billKind = 'billKind02';
billInfo.value.billSubKind = '';
billInfo.value.billType = 'BT003';

function byteToUint8Array(byteArray) {
    var uint8Array = new Uint8Array(byteArray.length);
    uint8Array.set(Java.from(byteArray));
    return uint8Array;
}

function isArrayBuffer(data) {
  return data instanceof ArrayBuffer;
}

const fnViewAvatar= (base64String)=>{

try{


  if(base64String!=null){
    console.log('base64String!! :: ');
    if(!isArrayBuffer(base64String)){
      // Base64 디코딩
      console.log('Base64 디코딩');
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      // Uint8Array를 ArrayBuffer로 변환
      arrayBuffer.value = byteArray.buffer;
    }else{
      console.log('base64String :: ',base64String);
      arrayBuffer.value = base64String;
    }

    // ArrayBuffer를 Blob으로 변환
    const blob = new Blob([arrayBuffer.value], { type: 'application/octet-stream' });
    const objectURL = URL.createObjectURL(blob);

    return objectURL;

  }

}catch(e){
  if(e instanceof Error) console.log(e.message)
  else console.log(e)
}

return null;

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
const closeLawNmModal = (reload) => {
  showLawNmModal.value = false;
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

const selectLawNm = (selection) => {
  billInfo.value.lawId = selection.lawId;

  billInfo.value.lawNm = selection.lawNm1;

  //lawNm2.value = selection.lawNm2;

  console.log('lawId.value',lawId.value);
  console.log('lawNm1.value',lawNm1.value);
  console.log('lawNm2.value',lawNm2.value);
}

//onRadioChange
const onRadioChange = (e) => {
  
  isSelectEnabled.value = billInfo.value.billKind === 'billKind02';
}

//onBillTypeChange
const onBillTypeChange = (e) => {
  
  isBillTypeSelectEnabled.value = (billInfo.value.billType === 'BT001' || billInfo.value.billType === 'BT002' || billInfo.value.billType === 'BT004');

  if(billInfo.value.billType === 'BT003'){
    billInfo.value.lawId = null;
    billInfo.value.lawNm = null;
  }

}

/*Function List*/
const fnGoList= (e)=>{
    router.push({name: 'applyList'});
}

/*글저장*/

// const fnValidate22 = async () => {
//     const data = await saveForm.value?.validate();
//     console.log(data.valid);
//     return data.valid;
// };

//전체 의원수 카운트

const billKindRules = (v, billInfo) => {

  if (v === 'billKind01' || billInfo.billSubKind !== '') {
    return true;
  }else{
    return 'You need to select a type of proposal';
  }
    
};

const billTypeRules = [
  v => (v != null && v.length >= 1) || 'You need to select a type of bill type',
  v => ((v === 'BT003') || (billInfo.value.lawId != null && billInfo.value.lawId !== '')) || 'You need to select a type of bill type'
];

const billNameRules = [
  v => (v != null && v.length >= 1) || 'Please enter the bill name.'
];

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

    let subKind = '';

    if (billInfo.value.billSubKind=='02'){
      subKind = '법률안';
    }else if(billInfo.value.billSubKind=='03'){
      subKind = '예산안';
    }


    const jsonData = {
        billKind: billInfo.value.billKind == 'billKind02' ? subKind : '특별법',
        billTy: billInfo.value.billType,
        lawId : billInfo.value.lawId,
        billName : billInfo.value.billName,
        groupList : billInfo.value.groupList? billInfo.value.groupList: null,
        memberList : billInfo.value.memberList? billInfo.value.memberList: null,
        smrCn : billInfo.value.smrCn
    }

    const apiUrl = "/api/apply/ebsMaster";

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_SAVE',params).then((data) => {

        console.log(data);
        
        fnGoList();

    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnGetRegStat= async (groupList, memberList)=>{

  const listUrl = `/api/apply/ebsMaster/regStat`;
  let params = {};

  const jsonData = {
    groupList: groupList,
    memberList: memberList
  }

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


const fnGetData= ()=>{

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
                      <v-radio-group v-model="billInfo.billKind" :rules="[v => billKindRules(v, billInfo)]" @change="onRadioChange">
                        <v-row class="align-center">
                          <v-col cols="auto" class="radio-container"><v-radio label="특별법" value="billKind01"></v-radio></v-col>
                          <v-col class="radio-container"><v-radio label="일반법" value="billKind02"></v-radio></v-col>
                        </v-row>
                      </v-radio-group>
                      <v-select
                        :items="autocompleteItems"
                        v-model="billInfo.billSubKind"
                        :disabled="!isSelectEnabled"
                      ></v-select>

                      <v-label>재ㆍ개정구분</v-label>
                      <v-radio-group v-model="billInfo.billType" :rules="billTypeRules" @change="onBillTypeChange">
                        <v-row class="align-center">
                          <v-col cols="auto" class="radio-container"><v-radio label="일부개정" value="BT001"></v-radio></v-col>
                          <v-col class="radio-container"><v-radio label="전부개정" value="BT002"></v-radio></v-col>
                          <v-col class="radio-container"><v-radio label="제정" value="BT003"></v-radio></v-col>
                          <v-col class="radio-container"><v-radio label="폐지" value="BT004"></v-radio></v-col>
                        </v-row>
                      </v-radio-group>
                        <v-text-field                         
                        v-model="billInfo.lawNm"
                        label="법률명"
                        readonly @input="fnValidate" :disabled="!isBillTypeSelectEnabled"></v-text-field>

                        <v-btn variant="outlined" @click="openLawNmModal" :disabled="!isBillTypeSelectEnabled">검색</v-btn>
                        <v-text-field
                        v-model="billInfo.billName"
                        label="의안명"
                        required
                        :rules="billNameRules"
                        ></v-text-field>
                        <!-- 의안 파일 -->
                        <!-- 서명요청 대상 -->
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

                        <v-textarea
                        v-model="billInfo.smrCn"
                        label="제안취지"
                        ></v-textarea>


                        <v-btn class="mt-2" type="submit" @click="fnSave" block>저장</v-btn>

                    </v-form>

                </v-sheet>
            </v-card>
    
            </v-col>
            <v-col cols="1"></v-col>
        </v-row>
    
      </v-container>
      <requestSignModal v-if="showModal" :show="showModal" :groups="groups" :users="users" :savedMembers="[]" @apply="handleApply" @close="closeModal"/>
      <lawNmModal v-if="showLawNmModal" :show="showLawNmModal" @selectLawNm="selectLawNm" @close="closeLawNmModal"/>

    </template>