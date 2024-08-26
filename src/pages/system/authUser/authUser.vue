<script setup>
import { onMounted, onUpdated, ref} from "vue";
import store from '@/store';
import memberSearch from "@/modal/ComMemberSearch.vue";
import userSearch from "@/modal/ComUserSearch.vue";

/*변수선언*/
const selectedAuth = ref(0);
const authList = ref([]);//권한리스트
const headers = [
    { title: '아이디', align: 'center', key: 'userId', sortable: false },
    { title: '이름', align: 'center', key: 'userNm', sortable: true },
    { title: '부서', align: 'center', key: 'deptNm', sortable: true ,cellProps:{class:"textLeftClass"}},
    { title: '직무', align: 'center', key: 'posCd', sortable: true ,cellProps:{class:"textLeftClass"}},
    { title: '이메일', align: 'center', key: 'email', sortable: false },
    { title: '전화번호', align: 'center', key: 'mblNo', sortable: false }
]; 
const tableDatas = ref([]);
const delChecked = ref([]);
const memberSearchRef = ref(null);//member serarch ref
const userSearchRef = ref(null);//user serarch ref

/*auth 조회*/
const fnAuthSearch= ()=>{

    const apiUrl = "/api/authMenu/comAuth";
    let params = {};
    params.API_PATH = apiUrl;
    store.dispatch('API_LIST',params).then((data) => {
        authList.value = data.resultList;

        if (authList.value.length > 0) {
            selectedAuth.value = authList.value[0].authId;
            fnAuthUserSearch();
        }

    }).catch(({message}) => {
        console.log("message : ", message);
    })
};

const fnAuthSelect = (newVal)=>{
    selectedAuth.value = newVal;
    delChecked.value = [];
    fnAuthUserSearch();
}

/* 사용자 조회  by auth */
const fnAuthUserSearch = () => {

  const listUrl = "/api/authUser/comAuthUser/"+selectedAuth.value;
  let params = {};
  params.API_PATH = listUrl;
  store.dispatch('API_LIST', params).then((data) => {

    delChecked.value = [];
    tableDatas.value =[];
    tableDatas.value = data.resultList;
    
  }).catch(({message}) => {
    console.log("message : ", message);
  })

}

/* 국회의원조회 팝업 */
const fnAddMember = () => {
    memberSearchRef.value.fnOpen();
};

/* 국회직원조회 팝업 */
const fnAddUser = () => {
    userSearchRef.value.fnOpen();
};

const fnSetMembers = (returnArr) => {

    let userArr = [];
    returnArr.forEach((item) => {
        userArr.push(item.memberId);
    });

    const jsonData = {
        userIds: userArr,
        authId : selectedAuth.value
    };

    console.log(jsonData);
    const apiUrl = "/api/authUser/comAuthUser";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData
    store.dispatch('API_SAVE',params).then((data) => {
        fnAuthUserSearch();
    }).catch(({message}) => {
        console.log("message : ", message);
    })
};

const fnSetUsers = (returnArr) => {

    let userArr = [];
    returnArr.forEach((item) => {
        userArr.push(item.userId);
    });

    const jsonData = {
        userIds: userArr,
        authId : selectedAuth.value
    };

    console.log(jsonData);
    const apiUrl = "/api/authUser/comAuthUser";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData
    store.dispatch('API_SAVE',params).then((data) => {
        fnAuthUserSearch();
    }).catch(({message}) => {
        console.log("message : ", message);
    })
};

const fnAuthUserDelete = () => {

    let userArr = [];
    delChecked.value.forEach((item) => {
        userArr.push(item.userId);
    });

    if(userArr.length == 0) {
        let aMsg = "삭제할 데이터를 선택해주십시요.";
        alert(aMsg);
        return;
    }

    if(!confirm("삭제 하시겠습니까?")){
      return;
    }

    const jsonData = {
        userIds: userArr,
        authId : selectedAuth.value
    };

    const apiUrl = "/api/authUser/deleteAuthUser";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData

    store.dispatch('API_DELETE_DATA',params).then((data) => {
      fnAuthUserSearch();
    }).catch(({message}) => {
      console.log("message : ", message);
    })

}




/*Dom객체 완성이후*/
onMounted( () => {

    fnAuthSearch();//초기조회
});

</script>

<template>
<v-container class="lg-12">
<v-row class="lg-12">
<v-col cols="1"></v-col>
<v-col>

    <v-row>
        <v-col cols="3">

            <v-row>
                <v-col><span>권한목록</span></v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card  class="mx-auto" max-width="300">

                        <v-container fluid>
                            <v-radio-group  :model-value="selectedAuth" @update:modelValue="fnAuthSelect">
                                <v-radio  color="primary"
                                    v-for="(option) in authList"
                                    :key="option.authId"
                                    :label="option.authNm"
                                    :value="option.authId"
                                    >
                                </v-radio>
                            </v-radio-group>
                        </v-container>
                    
                    </v-card>
                </v-col>
            </v-row>

        </v-col>
        <v-col>
            <v-row>
                <v-col cols="2"><span>User List</span></v-col>
                <v-col>
                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <v-btn size="x-small" variant="tonal" @click="fnAddMember">국회의원</v-btn>&nbsp;
                            <v-btn size="x-small" variant="tonal" @click="fnAddUser">국회직원</v-btn>&nbsp;
                            <v-btn size="x-small" variant="tonal" @click="fnAuthUserDelete">Delete Users</v-btn>&nbsp;
                        </v-col>


                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                <v-card  variant="outlined">

                    <v-data-table
                        density="compact"
                        :headers="headers"
                        :items="tableDatas"
                        item-key="id"
                        show-select
                        hover
                        return-object
                        v-model="delChecked"
                        hide-default-footer
                        items-per-page="-1"
                        >
                    </v-data-table>

                </v-card> 
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    
</v-col>
<v-col cols="1"></v-col>
</v-row>

<memberSearch ref="memberSearchRef" @selectedMembers="fnSetMembers"/>
<userSearch ref="userSearchRef" @selectedMembers="fnSetUsers"/>

</v-container>



</template>
<style>



</style>