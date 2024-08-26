<script setup>
import { defineEmits, ref, defineProps, onMounted } from 'vue';
import store from '@/store';
import DeptMngrModal from '@/pages/dept/DeptMngrModal.vue';

/*변수선언*/
const props = defineProps({
    show: String,
    deptIdIs: String
})

const emit = defineEmits(['close', 'reload'])
const modalShow = ref(props.show)
const loginId = ref(store.getters.userId);
const saveForm = ref(null);
const formValid = ref(null);
const deptId = ref('')
const mngrId = ref('')
const deptNm = ref('')
const shrtNm = ref('')
const ord = ref('')
const defOrd = ref('')
const bgDt = ref('')
const edDt = ref('')
const showModal = ref(false)
const userId = ref('')

const cd_rules = [
    value => {
        if (value) return true;
        return '필수 입력값입니다.'
    },
]

const nm_rules = [
    value => {
        if (value) return true;
        return '필수 입력값입니다.'
    },
]

const mngr_rules = [
    value => {
        if (value) return true;
        return '필수 입력값입니다.'
    },
]


/*Function List*/

const fnValidate = (e) => {
    saveForm.value?.validate();
    return formValid.value;
}

const fnSaveDept = () => {
    if (!fnValidate()) {
        return;
    }
    if (deptId.value !== '') {

        const jsonData = {
            mngrId: `${mngrId.value}`,
            uprDeptId: `${props.deptIdIs}`,
            deptId: deptId.value,
            deptNm: `${deptNm.value}`,
            shrtNm: `${shrtNm.value}`,
            ord: ord.value,
            bgDt: `${bgDt.value}`,
            edDt: `${edDt.value}`,
            regId: loginId.value
        }
        let params = {}
        params.API_PATH = "/api/departments"
        params.JSON_DATA = jsonData

        fnMngrDept();
        store.dispatch('API_SAVE', params).then((data) => {
            emit('close')
            emit('reload')
            
            deptNm.value = data.resultObj.data.deptNm;
            fnAddFolder(deptId.value, deptNm.value);

        }).catch(({ message }) => {
            console.log(message)
        })
    }
}

const fnMngrDept = () => {
    let params = {};
    const jsonData = {
        deptId : `${deptId.value}`,
        memberId : `${mngrId.value}`
    }

    params.API_PATH = "/api/dept/update";
    params.JSON_DATA = jsonData
    params.size = 1000;

    store.dispatch('API_UPDATE',params).then((data) => {
        console.log(data)
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

const fnUserDept = (data) => {
    userId.value = data
}

const fnOrd = () => {
    if (ord.value != defOrd.value) {
        ord.value = defOrd.value
    }
}


const fnLastOrd = () => {
    let params = {}
    params.API_PATH = "/api/lastOrd"

    store.dispatch('API_LIST', params).then((data) => {
        ord.value = data.resultList + 1
        defOrd.value = data.resultList + 1
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnOpen = () => {
        showModal.value = true;
}

const handleMngr = (id) => {
    mngrId.value = id;
}

/** 부서 등록시 부서 폴더 생성 */
const fnAddFolder = (deptId, deptNm) => {
    const apiUrl = "/api/dept/folderAdd";

    const jsonData = {
        authCd: deptId,
        folderNm: deptNm
    }

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE',params).then((data) => {
        fnAddAuth(data.resultObj.data)
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

const fnAddAuth = (item) => {
    const apiUrl = '/api/mngrAuthMapp';

    const jsonData = {
        userId : mngrId.value,
        folderId :  item.folderId,
        searchYn : true,
        deleteYn : true,
        updateYn : true,
        createYn : true,
        deptCd : item.authCd
    }

    console.log("json :: " + jsonData)

    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_SAVE', params).then((data) => {
        console.log(data);
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

onMounted(() => {
    fnLastOrd();
})

</script>

<template>
    <v-dialog v-model="modalShow" max-width="600" @update:modelValue="val => !val && emit('close')">
        <v-card>
            <v-row class="lg-12">
                <v-col><v-card-title>■ 부서 등록</v-card-title></v-col>
            </v-row>

            <v-container>
                <v-form class="formbox" @submit.prevent ref="saveForm" v-model="formValid">
                    <v-row dense>
                        <v-col cols="12">
                            <v-input :readonly="true" density="compact">{{ props.deptIdIs ? '상위부서코드 : ' + props.deptIdIs : '상위부서코드 : 없음' }}</v-input>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field label="부서코드" v-model="deptId" density="compact" required
                                :rules="cd_rules"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col><v-text-field v-model="userId" label="담당자 ID" density="compact"
                                :readonly="true"></v-text-field>
                        </v-col>
                        <v-col align="end" cols="3"><v-btn @click="fnOpen">담당자 조회</v-btn></v-col>
                        <DeptMngrModal v-if="showModal" :show="showModal" @close="showModal = false"
                            :deptIdIs="deptId" @mngrId="handleMngr" @userId="fnUserDept"/>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field label="부서명" v-model="deptNm" density="compact" required
                                :rules="nm_rules"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field label="부서약칭" density="compact" v-model="shrtNm"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="6">
                            <v-text-field label="부서생성일" type="date" v-model="bgDt"></v-text-field>
                        </v-col>
                        <v-col><v-text-field label="부서폐쇄일" type="date" v-model="edDt"></v-text-field></v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field type="number" label="순서" v-model="ord" @click="fnOrd"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="close" variant="plain" @click="emit('close')"></v-btn>
                <v-btn text="save" variant="tonal" @click="fnSaveDept" type="submit" color="primary"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>



</template>


<style scoped></style>