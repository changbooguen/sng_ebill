<script setup>
import { onMounted, onUpdated, ref} from "vue";
import store from '@/store';
import { VTreeview } from 'vuetify/labs/VTreeview'

/*변수선언*/
const selectedAuth = ref(0);
const authList = ref([]);//권한리스트
const menus = ref([]);//메뉴리스트
const reftreeview = ref(null);

/*auth 조회*/
const fnAuthSearch= ()=>{

    const apiUrl = "/api/authMenu/comAuth";
    let params = {};
    params.API_PATH = apiUrl;
    store.dispatch('API_LIST',params).then((data) => {
        authList.value = data.resultList;

        if (authList.value.length > 0) {
            selectedAuth.value = authList.value[0].authId;
            fnAuthMenuSearch();
        }

    }).catch(({message}) => {
        console.log("message : ", message);
    })
};

const fnAuthSelect = (newVal)=>{
    selectedAuth.value = newVal;
    fnAuthMenuSearch();
}

/*auth menu 조회*/
const fnAuthMenuSearch = ()=>{

    const apiUrl = "/api/authMenu/comAuthMenu/"+selectedAuth.value;
    let params = {};
    params.API_PATH = apiUrl;
    store.dispatch('API_LIST',params).then((data) => {
        menus.value = data.resultList;

    }).catch(({message}) => {
        console.log("message : ", message);
    })
};

const fnSave= ()=>{

    let tmpArr = [];
    menus.value.forEach((item, index) => {
        const returnArr = fnFlattenJson(item);
        tmpArr.push(...returnArr);
    });

    const jsonData = {
        authMenus: tmpArr,
        authId : selectedAuth.value
    };

    const apiUrl = "/api/authMenu/comAuthMenu";
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData
    store.dispatch('API_SAVE',params).then((data) => {
        fnAuthMenuSearch();
    }).catch(({message}) => {
        console.log("message : ", message);
    })

}

const fnFlattenJson= (json)=>{

    let result = [];
    const selectedAuthId = selectedAuth.value;

    const recurse= (node)=>{
    
        result.push({
            menuId: node.id,
            menuNm: node.title,
            menuChecked: node.checked,
            menuAuth: node.menuAuth,
            authId : selectedAuthId
        });

        if (node.children) {
            node.children.forEach(child => {
                recurse(child);
            });
        }
    }

    recurse(json);
    return result;
}

const fnHandleUpdate = (item)=>{

    if(item.checked) {
        if(item.children) {
            item.children.forEach((childItem, index) => {
                childItem.checked = true;
            });
        }
    } else {
        if(item.children) {
            item.children.forEach((childItem, index) => {
                childItem.checked = false;
            });
        }
    }
}

let selectAllMenuFlag = true;

const fnSelMenu = () => {

    selectAllMenuFlag = !selectAllMenuFlag;

    const recurse= (item)=>{
        item.checked = selectAllMenuFlag;
        if (item.children) {
            item.children.forEach(child => {
                recurse(child);
            });
        }
    }

    menus.value.forEach((item) => {
        recurse(item);
    });
};

const fnSelAuth = (_val) => {

    const recurse= (item)=>{
        item.menuAuth = _val;
        if (item.children) {
            item.children.forEach(child => {
                recurse(child);
            });
        }
    }

    menus.value.forEach((item) => {
        recurse(item);
    });
};


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
                <v-col cols="2"><span>메뉴목록</span></v-col>
                <v-col>

                    <v-row align="center" justify="center">
                        <v-col cols="auto">
                            <v-btn size="x-small" variant="tonal" @click="fnSave">Save</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn size="x-small" variant="outlined" @click="fnSelMenu">Menu All Select</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn size="x-small" variant="outlined" @click="fnSelAuth(4)">Auth All Read</v-btn>
                        </v-col>
                        <v-col cols="auto">
                            <v-btn size="x-small" variant="outlined" @click="fnSelAuth(6)">Auth All Edit</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row>
                <v-col>

                <v-treeview hide-details width="500" ref="reftreeview"
                    density="compact"
                    :items="menus"
                    open-all
                    open-strategy="multiple"
                    active-strategy="classic"
                    >

                    <template v-slot:prepend="{ item }">
                        <v-checkbox style="margin-right: 4px;" hide-details
                        v-model="item.checked"
                        @click.stop
                        @update:modelValue="fnHandleUpdate(item)"
                        ></v-checkbox>
                    </template>

                    <template v-slot:append="{ item }">
                        <v-radio-group  v-if="!item.children" v-model="item.menuAuth" @click.stop hide-details inline>
                            <v-radio label="Read" :value="4" ></v-radio>
                            <v-radio label="Edit" :value="6" ></v-radio>
                        </v-radio-group>
                    </template>

                </v-treeview>

                </v-col>
            </v-row>

        </v-col>
    </v-row>
    
</v-col>
<v-col cols="1"></v-col>
</v-row>
</v-container>



</template>
<style>



</style>