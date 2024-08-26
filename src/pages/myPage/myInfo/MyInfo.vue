<script setup>

import {ref, onMounted, reactive} from "vue";
import axios from '@/axios';
import avatarsImg from "@/components/AvatarsImg.vue";
import groupRegModal from "@/modal/GroupRegModal.vue";
import store from '@/store';

const form = ref(null);
const tableDatas = ref([]);
const formValid = ref(false);
const showModal = ref(false);
const originalFilePath=ref('');
const pswdConfirm = ref('');
const imgSize = ref('200');
const users = ref([]);
const grpId = ref();

const headers = [
  { title: '그룹명', align: 'center', key: 'grpNm', sortable: false },
  { title: '대상', align: 'start', key: 'memberList', sortable: false },
  { title: '', align: 'center', key: 'grpId', sortable: false },
];  

const state = reactive({
  userInfo: {
    pswd:'',
    imgPath:'',
    imgFile:[]
  }
})

const requestParam = reactive({
  userInfo: {
    pswd:'',
    msgRcvYn:'',
    imgPath:'',
    imgFile:[],
    userType:'',
    userId:''
  }
})

const validate = () => {
    if (formValid.value) {
      formValid.value.validate();
    }
};

const viewImgFile = async(path) => {
  try{

    const response = await axios.get('/api/myinfo/file', {
      responseType: 'arraybuffer'
    });

    if(response.data!=null){
      
      state.userInfo.imgPath=response.data;

    }


  }catch(e){
    if(e instanceof Error) console.log(e.message)
    else console.log(e)
  }
};

const updateImg = () => {
  const myInput = document.getElementById("imgPath");
     myInput.click();
}

const openGroupModal = (id) => {
  showModal.value = true;
  if(id !== null){
    grpId.value = id;
  }else{
    grpId.value = null;
  }
  
}
//changeImg
const changeImg = (event) => {

  const files = event.target.files; //getting files

  for (let i = 0; i < files.length; i++){
    if (files[i].size > 1048576){
      alert("파일 용량이 너무 큽니다");
      return;
    }
    const objectURL = URL.createObjectURL(files[i]);
    state.userInfo.imgPath=objectURL;
  }

  requestParam.userInfo.imgFile = Array.from(event.target.files);
  
}

const closeModal = (reload) => {
  showModal.value = false;
  fnGrpSearch();
}
/*
const saveForm = async () => {
  const formData = new FormData();
  requestParam.userInfo.pswd = state.userInfo.pswd;
  requestParam.userInfo.msgRcvYn = state.userInfo.msgRcvYn;
  requestParam.userInfo.userId = state.userInfo.userId;
  requestParam.userInfo.userType = state.userInfo.userType;
  requestParam.userInfo.imgPath = originalFilePath.value;



  formData.append('request', new Blob([JSON.stringify(state.userInfo)], { 
      type: 'application/json' 
  }));
  
  requestParam.userInfo.imgFile.forEach((file) => formData.append("imgFile",file));

  await axios.post('/api/myinfo', formData,{
    headers: {
      'Content-Type': 'multipart/form-data'  // Ensure this matches what the server expects
    }
  }).then((response) => {

    alert("저장되었습니다.");

  }).catch((e) => {
    if(e instanceof Error) console.log(e.message)
    else console.log(e)
  })

}

*/

const saveForm = async () => {
  const formData = new FormData();
  requestParam.userInfo.pswd = state.userInfo.pswd;
  requestParam.userInfo.msgRcvYn = state.userInfo.msgRcvYn;
  requestParam.userInfo.userId = state.userInfo.userId;
  requestParam.userInfo.userType = state.userInfo.userType;
  requestParam.userInfo.imgPath = originalFilePath.value;

  formData.append('request', new Blob([JSON.stringify(state.userInfo)], { 
      type: 'application/json' 
  }));
  
  requestParam.userInfo.imgFile.forEach((file) => formData.append("imgFile",file));

  console.log('state.userInfo.imgPath :: ', state.userInfo.imgPath);
  console.log('originalFilePath.value :: ', originalFilePath.value);
  console.log('JSON.stringify(state.userInfo) :: ',JSON.stringify(state.userInfo));

  await axios.post('/api/myinfo', formData,{
    headers: {
      'Content-Type': 'multipart/form-data'  // Ensure this matches what the server expects
    }
  }).then((response) => {

    alert("저장되었습니다.");

  }).catch((e) => {
    if(e instanceof Error) console.log(e.message)
    else console.log(e)
  })

}

//updateUser
const updateUser = () => {
  if (formValid.value) {

    saveForm();

    
  }


}

/*
유효성 체크 룰  
*/

const passwordRules = [
  v => (v === '' || v.length >= 8) || 'Password must be at least 8 characters long',
  v => (v === '' ||/[A-Za-z]/.test(v)) || 'Password must contain at least one letter',
  v => (v === '' ||/[0-9]/.test(v)) || 'Password must contain at least one number'
];

const confirmPasswordRules = [
  v => v === state.userInfo.pswd || 'Passwords do not match'
];

const confirmMsgRcvYnRules = [
  v => (v != null && v.length >= 1) || 'Notification reception consent is not selected.'
];

const request = async () => {
  await axios.get("/api/myinfo")
  .then((response) => {
    state.userInfo = response.data.data.myInfo;
    state.imgFile = response.data.data.imgResource;

    const imgfilePath = state.userInfo.imgPath;
    const imgfileName = imgfilePath.split('\\').pop().split('/').pop();
    originalFilePath.value = imgfilePath;
    viewImgFile(imgfileName);

  }).catch((e) => {
    if(e instanceof Error) console.log(e.message)
    else console.log(e)
  })

}





const fnGetModalData= ()=>{

const listUrl = `/api/myinfo/memberList`;
let params = {};
params.API_PATH = listUrl;

store.dispatch('API_LIST',params).then((data) => {
  console.log('memberList',data.resultList);
  //users.value=data.resultList.data.memberList;
  console.log('1111111111');
  users.value = data.resultList.data.memberList.map(user => ({
    title : user.memberNm,
    value : user.memberId
  }));
  console.log('222222222');
  
  //users.value = data.resultList.data.memberList;

}).catch(({message}) => {
    console.log("message : ", message);
})

}

const fnGrpSearch= (e)=>{
  console.log('fnSearch()')
  const listUrl = "/api/myinfo/group";
  let params = {};
  params.API_PATH = listUrl;


  params.size = 1000;

  store.dispatch('API_LIST',params).then((data) => {

    console.log("list content", data);

    tableDatas.value = data.resultList;

    

  }).catch(({message}) => {
      console.log("message : ", message);
  })

}

const fnDelete= (grpId)=>{

if(!confirm("삭제 하시겠습니까?")){

  return;
}

const apiUrl = `/api/myinfo/group`;
let deleteItems = [];
deleteItems.push(`${grpId}`);

let params = {};
params.API_PATH = apiUrl;
params.deleteItems = deleteItems;

store.dispatch('API_DELETE',params).then((data) => {
  
  fnGrpSearch();
  
}).catch(({message}) => {
    
  console.log("message : ", message);

})

}  



onMounted( () => {

request();
fnGrpSearch();
fnGetModalData();

});

</script>

<template>
    <v-container class="lg-12">
    
    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col></v-col>
        <v-col cols="1"></v-col>
    </v-row>


    <v-row class="lg-12">
        <v-col cols="1"></v-col>
        <v-col>
          <v-card variant="outlined">
            <v-card-title>내정보</v-card-title>
            <v-card-text>
            <v-row class="lg-12"><v-col></v-col></v-row>

            <v-row align="center" class="lg-12">
              <v-col>


              <v-table>
                <tbody>
                  <tr>
                    <th class="text-left">
                      아이디
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.userId }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left">
                      이름
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.userNm }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left">
                      소속
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.deptNm }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left">
                      사무실
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.inrNo }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left">
                      mobile
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.mblNo }}
                    </td>
                  </tr>
                  <tr>
                    <th class="text-left">
                      email
                    </th>
                    <td class="text-left">
                      {{ state.userInfo.email }}
                    </td>
                  </tr>
                </tbody>
              </v-table>


              </v-col>
              </v-row>
              <v-row class="lg-12"><v-col></v-col></v-row>
            </v-card-text>
            </v-card> 
            <v-card  variant="outlined">
              <v-card-title>설정</v-card-title>
              <v-card-text>
                <v-row class="lg-12"><v-col></v-col></v-row>

                <v-row align="center" class="lg-12">
                <v-col>

                  <v-form @submit.prevent ref="saveForm" v-model="formValid"  enctype="mulipart/form-data">  

                    <v-row>
                      <v-col>
                        <v-label>알림수신</v-label>
                    
                        <v-radio-group v-model="state.userInfo.msgRcvYn" :rules="confirmMsgRcvYnRules">
                          <v-row class="align-center">
                            <v-col cols="auto" class="radio-container"><v-radio label="수신" value="Y"></v-radio></v-col>
                            <v-col class="radio-container"><v-radio label="미수신" value="N"></v-radio></v-col>
                          </v-row>
                        </v-radio-group>

                      </v-col>
                      <v-col>
                        <v-label>이미지</v-label>
                        <v-row >
                          <v-col cols="auto">    
                            <!--          
                            <v-img v-if="state.userInfo.imgPath"
                              :width="300"
                              :height="300"
                              cover
                              :src="state.userInfo.imgPath"
                            ></v-img>
                            <v-empty-state v-if="state.userInfo.imgPath === null || state.userInfo.imgPath === ''"
                              :width="300"
                              :height="300"
                              icon="mdi-magnify"
                              text="수정 버튼을 눌러 파일을 등록하세요."
                              title="이미지를 추가해주세요."
                            ></v-empty-state>
                            -->
                            <avatarsImg v-model:url="state.userInfo.imgPath" v-model:size="imgSize"/>
                          </v-col>
                          <v-col>
                            <v-btn @click="updateImg">
                              수정
                            </v-btn>
                            <input type="file" id="imgPath" name="imgPath" @change="changeImg"/>
                          </v-col>
                        </v-row>
                        
                      </v-col>

                    </v-row>


                    <v-label>비밀번호 변경</v-label>
                    <v-row>
                      <v-col>
                        <v-text-field  type="password" label="비밀번호" placeholder="비밀번호를 입력해주세요." id="pswd" :rules="passwordRules" v-model="state.userInfo.pswd" @input="validate"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field type="password" label="비밀번호 확인" placeholder="비밀번호 확인을 입력해주세요." :rules="confirmPasswordRules" v-model="pswdConfirm" @input="validate"></v-text-field>
                        
                      </v-col>
                    
                    </v-row>
                    <v-label>서명대상 관리</v-label>
                    <v-row>
                      <v-col>
                        <v-btn @click="openGroupModal()">등록</v-btn>
                      </v-col>
                    
                    </v-row>
                    <v-row>
                      <v-data-table
                        :headers="headers"
                        :items="tableDatas"
                        density="compact"                           
                        item-key="id"
                      >

                      <template v-slot:[`item.grpNm`]="{ item }">
                        {{item.grpNm}}
                      </template>

                      <template v-slot:[`item.memberList`]="{ item }">

                        <template v-for="(obj,index) in item.memberList" :key="index">
                          {{obj}}
                          <span v-if="index < item.memberList.length - 1">,    </span>
                        </template>
                        

                      </template>
                      <template v-slot:[`item.grpId`]="{ item }">
                        
                        
                        <v-row>
                          <v-col>
                            <v-btn variant="outlined" @click="openGroupModal(item.grpId)">수정</v-btn>
                            <v-btn variant="outlined" @click="fnDelete(item.grpId)">삭제</v-btn>

                          </v-col>

                        </v-row>

                      </template>
                      
                      </v-data-table>
                    
                    </v-row>
                    <v-btn class="mt-2" type="submit" @click="updateUser" block>저장</v-btn>
                    

                  </v-form>

                </v-col>
                </v-row>
                <v-row class="lg-12"><v-col></v-col></v-row>
                </v-card-text>
            </v-card>           

        </v-col>
        <v-col cols="1"></v-col>
    </v-row>

  </v-container>
  <groupRegModal v-if="showModal" :show="showModal" :users="users" :grpId="grpId" :ord="tableDatas.length+1" :savedMembers="[]" @close="closeModal"/>

</template>

<style scoped>

#imgPath{
  display: none;
  visibility: hidden;
  overflow: hidden;
}


</style>