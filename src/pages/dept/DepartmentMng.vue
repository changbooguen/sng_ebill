<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import store from '@/store';
import DeptTree from '@/pages/dept/DeptTree.vue'
import DeptModal from '@/pages/dept/DeptModal.vue'
import DeptUnuserModal from '@/pages/dept/DeptUnuserModal.vue'
import UserModalSave from "@/modal/UserModalSave.vue";
import DeptMngrModal from '@/pages/dept/DeptMngrModal.vue';

/*변수선언*/
const router = useRouter();
const headers = [
  { title: '아이디', value: 'userId', align: 'center' }, //memberId
  { title: '이름', value: 'userNm', align: 'center' }, //memberNm
  { title: '직위', value: 'posCd', align: 'center' }, //polyNm
]

const deptIdIs = ref('')
const tableDatas = ref([]);
const tabSel = ref(null)
const deptName = ref('')
const userList = ref([])
const loginId = ref(store.getters.userId)
const showModal = ref(false)
const showNewModal = ref(false)
const showNonModal = ref(false)
const showMngrList = ref(false)
const reload = ref(true)
const mngrName = ref(tableDatas.value.mngrId)

/*Function List*/


/*조회*/
const fnSearch = () => {
  let params = {};

  params.API_PATH = `/api/dept/${deptIdIs.value}`;
  params.size = 1000;

  store.dispatch('API_LIST', params).then((data) => {
    tableDatas.value = data.resultList.data;
    deptName.value = data.resultList.data.deptNm

  }).catch(({ message }) => {
    console.log("message : ", message);
  })
}

const handleTree = (e) => {
  deptIdIs.value = e
  fnSearch();
  fnDeptUsers();
}

const fnDeptUsers = () => {
  let params = {};
  params.API_PATH = "/api/dept/mngr";
  params.deptId = deptIdIs.value
  params.deptNon = "no"

  params.size = 1000;

  store.dispatch('API_LIST', params).then((data) => {
    userList.value = data.resultList;
  }).catch(({ message }) => {
    console.log("message : ", message);
  })
}

const fnReloadDept = () => {
  fnDeptUsers()
}

const fnGoAllSave = async () => {
  try {
    await router.push('/deptMngAllSave');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
}

const fnDelBtn = () => {
  let params = {}
  let deleteItems = [];
  deleteItems.push(`${deptIdIs.value}`);
  params.API_PATH = `/api/deleteDept/${deptIdIs.value}/${tableDatas.value.mngrId}`

  store.dispatch('API_DELETE', params).then((data) => {
    reload.value = !reload.value
  }).catch(({ message }) => {
    console.log(message)
  })

}

const fnPutDept = () => {
  let params = {}
  params.API_PATH = `/api/putDept/${deptIdIs.value}`

  const jsondata = {
    deptNm: tableDatas.value.deptNm,
    shrtNm: tableDatas.value.shrtNm,
    bgDt: tableDatas.value.bgDt,
    edDt: tableDatas.value.edDt,
    useYn: tableDatas.value.useYn,
    modId: loginId.value,
    ord: tableDatas.value.ord,
    mngrId: tableDatas.value.mngrId
  }

  params.JSON_DATA = jsondata
  store.dispatch('API_UPDATE', params).then((data) => {
    console.log(data)
    reload.value = !reload.value
  }).catch(({ message }) => {
    console.log(message)
  })
}

const fncheckValue = () => {
  if (deptIdIs.value === '') {
    alert("부서를 선택해주세요")
  } else {
    fnOpenNon()
  }
}

const fnOpen = () => {
  showModal.value = true;
}

const fnOpenNew = () => {
  showNewModal.value = true;
}

const fnOpenNon = () => {
  showNonModal.value = true;
}

const fnOpenMngr = () => {
  showMngrList.value = true;
}


const fnReload = (data) => {
  reload.value = !reload.value
}

const fnUserDept = (data) => {
  mngrName.value = data
}

const handleMngr = (id) => {
  tableDatas.value.mngrId = id
}

/*Dom객체 완성이후*/
onMounted(() => {
});

</script>

<template>

  <v-container class="lg-12">

    <v-row class="lg-12">
      <v-col cols="1"></v-col>

      <v-col cols="3">
        <v-card class="cardArea">
          <v-row dense>
            <v-col><v-btn @click="fnOpen" variant="outlined">부서등록</v-btn></v-col>
            <DeptModal v-if="showModal" :show="showModal" @close="showModal = false" :deptIdIs="deptIdIs"
              @reload="fnReload" />
            <v-col><v-btn @click="fnGoAllSave" variant="outlined">부서일괄등록</v-btn></v-col>
          </v-row>
          <v-row>
            <DeptTree @deptValue="handleTree" :reload="reload" />
          </v-row>
        </v-card>
      </v-col>

      <v-col>
        <v-card class="cardArea" min-height="640">

          <v-tabs v-model="tabSel">
            <v-row>
              <v-tab text="부서정보" value="deptTab"></v-tab>
              <v-tab text="부서원 목록" value="listTab"></v-tab>
              <v-col align="end">

                <v-btn variant="outlined" style="margin-right : 10px;" @click="fnOpenNew">신규등록</v-btn>
                <UserModalSave v-if="showNewModal" :show="showNewModal" @close="showNewModal = false" :data="deptName"
                  :selectedDeptId="deptIdIs" :deptNm="deptName" @reload="fnReloadDept" />


                <v-btn variant="outlined" @click="fncheckValue">미지정 직원등록</v-btn>
                <DeptUnuserModal @close="showNonModal = false" v-if="showNonModal" :show="showNonModal"
                  :deptId="deptIdIs" @reload="fnReloadDept" />

              </v-col>
            </v-row>
          </v-tabs>

          <v-row><v-col></v-col></v-row>
          <v-row>
            <v-col>{{ deptName ? '■ ' + deptName : '' }}</v-col>
          </v-row>
          <v-row><v-col></v-col></v-row>

          <v-tabs-window v-model="tabSel">
            <v-tabs-window-item value="deptTab">
              <div v-if="deptIdIs === ''" style="margin: 10px;">부서를 선택하세요.</div>
              <v-container v-else>
                <v-row dense><v-col><v-input :readonly="true">{{ '부서코드 : ' + deptIdIs }}</v-input></v-col></v-row>
                <v-row dense>
                  <v-col><v-text-field v-model="tableDatas.mngrId" label="담당자 ID" density="compact"
                      :readonly="true"></v-text-field>
                  </v-col>
                  <v-col align="end" cols="3"><v-btn @click="fnOpenMngr">담당자 조회</v-btn></v-col>
                  <DeptMngrModal v-if="showMngrList" :show="showMngrList" @close="showMngrList = false"
                    :deptIdIs="deptIdIs" @mngrId="handleMngr" @userId="fnUserDept" :clickMng="true" />
                </v-row>
                <v-row dense><v-col><v-text-field variant="outlined" v-model="tableDatas.deptNm">부서명 : </v-text-field>
                  </v-col></v-row>

                <v-row dense>
                  <v-col>
                    <v-text-field variant="outlined" v-model="tableDatas.shrtNm">부서약칭 :</v-text-field>
                  </v-col>
                </v-row>


                <v-row dense>
                  <v-col><v-text-field variant="outlined" v-model="tableDatas.ord" type="number">순서
                      :</v-text-field>
                  </v-col>
                </v-row>


                <v-row dense>
                  <v-col>
                    <v-text-field variant="outlined" v-model="tableDatas.bgDt" type="date">부서신설일 :</v-text-field>
                  </v-col>
                  <v-col><v-text-field variant="outlined" v-model="tableDatas.edDt" type="date">부서폐쇄일 :</v-text-field>
                  </v-col>
                </v-row>


                <v-btn class="delBtn" @click="fnDelBtn" variant="outlined">삭제</v-btn>
                <v-btn variant="outlined" @click="fnPutDept">저장</v-btn>
              </v-container>
            </v-tabs-window-item>



            <v-tabs-window-item value="listTab">
              <div v-if="deptIdIs === ''" style="margin: 10px;">부서를 선택하세요.</div>
              <v-card v-else class="tableScroll" variant="outlined">
                <v-row><v-col></v-col></v-row>

                <v-data-table :headers="headers" :items="userList" density="compact" style="text-align: center;">
                  <!--hide-default-footer-->
                  <template v-slot:item="{ item }">
                    <tr>
                      <td>{{ item.userId }}</td>
                      <td>{{ item.userNm }}</td>
                      <td>{{ item.posCd }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>

        </v-card>
      </v-col>


      <v-col cols="1"></v-col>
    </v-row>

  </v-container>

</template>

<style scoped>
.cardArea {
  padding: 20px;
}
</style>