<script setup>
import { defineProps, ref, defineEmits, onMounted, watch } from 'vue';
import store from '@/store';

/** 변수선언 */
const props = defineProps({
    visible: Boolean
})
const emit = defineEmits(['close', 'rcvs'])

const modalShow = ref(props.visible)
const selectTab = ref('membersTab')
const members = ref([])
const users = ref([])
const rcvNm = ref('')
const deptList = ref([])
const deptIdIs = ref('')
const selectRcv = ref([])

const headers = [
    { title: '이름', value: 'memberNm', align: 'center' },
    { title: '정당명', value: 'polyNm', align: 'center' },
    { title: '소속위원회', value: 'cmitCd', align: 'center' }
]

const headers2 = [
    { title: '이름', value: 'userNm', align: 'center' },
    { title: '부서', value: 'deptId', align: 'center' },
    { title: '직위', value: 'posCd', align: 'center' }
]

/** function List */
const fnSearchMembers = () => {
    let params = {};
    params.API_PATH = "/api/dept/members"
    params.memberNm = rcvNm.value

    store.dispatch('API_LIST', params).then((data) => {
        members.value = data.resultList
    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnSearchUsers = () => {
    let params = {};
    params.API_PATH = "/api/dept/users"
    params.userNm = rcvNm.value
    params.deptId = deptIdIs.value

    store.dispatch('API_LIST', params).then((data) => {
        users.value = data.resultList
    }).catch(({ message }) => {
        console.log(message)
    })
}

const getDeptList = () => {
    let params = {}
    params.API_PATH = "/api/departments"

    store.dispatch('API_LIST', params).then((data) => {
        deptList.value = data.resultList.map(dept => ({
            title: dept.deptNm,
            value: dept.deptId
        }))

        deptList.value.unshift({
            title: '부서없음',
            value: ''
        })

    }).catch(({ message }) => {
        console.log(message)
    })
}

const fnDeptUsers = (deptId) => {
    deptIdIs.value = deptId
}

watch(selectRcv, (newValue, oldValue) => {
    const mid = [];
    const uid = [];

    newValue.forEach(rcv => {
        if (rcv.memberId) {
            mid.push(rcv.memberId);
        } else if (rcv.userId) {
            uid.push(rcv.userId);
        }
    });

    const rcvs = mid.concat(uid);

    emit('rcvs', rcvs)
})


/** DOM 객체 완성 이후 */
onMounted(() => {
    fnSearchUsers();
    fnSearchMembers();
    getDeptList();
});

</script>

<template>
    <transition name="modal" appear>
        <v-dialog v-model="modalShow" max-width="600" @update:modelValue="val => !val && emit('close')">
            <v-card max-height="550">
                <v-row></v-row>
                <v-row class="lg-12">
                    <v-col cols="1"></v-col>
                    <v-col>
                        <v-tabs v-model="selectTab">
                            <v-tab text="의원" value="membersTab"></v-tab>
                            <v-tab text="직원" value="usersTab"> </v-tab>
                        </v-tabs>
                    </v-col>
                </v-row>

                <v-row class="lg-12">
                    <v-col cols="1"></v-col>
                    <v-col>
                        <v-tabs-window v-model="selectTab">
                            <v-tabs-window-item value="membersTab">
                                <v-row align="center">
                                    <v-col>
                                        <v-text-field label="이름" v-model="rcvNm" variant="outlined"
                                            @keydown.enter="fnSearchMembers"></v-text-field>
                                    </v-col>
                                    <v-col><v-btn @click="fnSearchMembers">검색</v-btn></v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <v-data-table density="compact" :headers="headers" :items="members"
                                            item-text="title" show-select return-object
                                            v-model="selectRcv"></v-data-table>
                                    </v-col>
                                    <v-col cols="1"></v-col>
                                </v-row>
                            </v-tabs-window-item>

                            <v-tabs-window-item value="usersTab">
                                <v-row>
                                    <v-col>
                                        <v-select label="부서" :items="deptList" item-text="title"
                                            @update:model-value="fnDeptUsers"></v-select></v-col>
                                    <!-- :rules="[v => !!v || '필수 입력값입니다.']" -->
                                    <v-col>
                                        <v-text-field variant="outlined" v-model="rcvNm" @keydown.enter="fnSearchUsers"
                                            label="이름"></v-text-field></v-col>
                                    <v-col><v-btn @click="fnSearchUsers">검색</v-btn></v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <v-data-table :headers="headers2" :items="users" item-text="title" show-select
                                            return-object v-model="selectRcv">
                                            <template v-slot:[`item.deptId`]="{ item }">
                                                {{ item.deptId ? deptNmIs : '' }}
                                            </template>
                                        </v-data-table>
                                    </v-col>
                                    <v-col cols="1"></v-col>
                                </v-row>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-col>
                </v-row>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="plain" @click="emit('close')"></v-btn>
                    <v-btn color="primary" text="save" variant="tonal" type="submit" @click="emit('close')"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </transition>
</template>

<style scoped></style>