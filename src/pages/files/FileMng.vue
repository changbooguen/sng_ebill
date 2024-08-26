<script setup>
import store from '@/store';
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { VTreeview } from 'vuetify/labs/VTreeview';
import fileMngMenu from "@/modal/FileMngMenu.vue";
import FolderUpdateModal from '@/modal/FolderUpdateModal.vue';
import FileUpdateModal from '@/modal/FileUpdateModal.vue';
import FolderAddModal from '@/modal/FolderAddModal.vue';
import FileAddModal from '@/modal/FileAddModal.vue';
import ShareModal from '@/modal/ShareModal.vue';
import AuthMappModal from '@/modal/AuthMappModal.vue';

/** 변수 선언 */
const treeContents = ref([]);
const schFolder = ref("");
const tableDatas = ref([]);
const headers = [
            { title: '', align: 'center', key: 'favoriteYn', sortable: false},
            { title: '제목', align: 'center', key: 'title', sortable: true ,cellProps:{class:"textLeftClass"}},
            { title: '크기', align: 'center', key: 'fileSize', sortable: true },
            { title: '등록자', align: 'center', key: 'createUserNm', sortable: true },
            { title: '날짜', align: 'center', key: 'regDt', sortable: true },
            { title: '파일', align: 'center', key: 'fileType', sortable: false },
            { title: '기능', align: 'center', key: 'folderYn', sortable: false },
];    
const selectFolderId = ref(null);
const srhTree = ref(null);
const folderNm = ref(null);
const topFolder = ref(null);
const search = ref(null);
const selectedItem = ref(null);
const folderModal = ref(false);
const fileModal = ref(false);
const authCd = ref(null);
const treeKind = ref(null);
const shareModal = ref(false);
const loginInfo = ref(store.getters.loginInfo);
let loginId = loginInfo.value.accountId;
const ownerId = ref(null);
const fileGroupId = ref(null);
const folderId = ref(null);
const folderYn = ref(null);
const authModal = ref(false);
const mngrId = ref(null);
const menu = ref(false);
const folderAddModal = ref(false);
const fileAddModal = ref(false);
const nowFolderId = ref(null);
const userDeptAuthMapp = ref([]);
const userAuth = ref([]);

/** function List */

/** 폴더 트리 */
const fnFolderTree = (item) => {
    
    const listUrl = "/api/folderList";
    const params = {};
    params.API_PATH = listUrl;
    params.folderNm = '';
    params.deptCd = loginInfo.value.deptCd;

    store.dispatch('API_LIST', params).then((data) => {
        treeContents.value = data.resultList;

        //최초 접속 시 첫번째 최상위 폴더 선택 _ 검토필요
        if(item == undefined){
            topFolder.value = treeContents.value.find(data => data.upperFolderId == '#');
            item = topFolder.value.folderId;
        }
            
        nowFolderId.value = item;
        
        selectFolder(nowFolderId.value);
    }).catch(({ message }) => {
        treeKind.value = '';
        console.log("message : " + message);
    });
}

// 트리 아이템 생성 함수
const buildTree = (items, parentId = '#') => {
    const tree = [];

    for (let item of items) {
        if (item.upperFolderId == parentId) {
            const children = buildTree(items, item.folderId);
            const treeNode = {
                id: item.folderId,
                title: item.folderNm,
                children: children.length ? children : undefined
            };
            tree.push(treeNode);
        }
    }

  return tree;
};

/** 폴더 검색 */
const filteredItems = computed(() => {
    if (!srhTree.value) {
        return buildTree(treeContents.value);
    }
    const filtered = treeContents.value.filter(data => data.folderNm.includes(srhTree.value));
    return buildTree(filtered);
});

/** 폴더 선택 */
const selectFolder = (node) => {
    selectedItem.value = [];

    if(node == null){
        return;
    }

    let folderIdx = null;

    if(node.id == undefined){
        folderIdx = node
    } else {
        folderIdx = node.id
    }

    fnGetUserAuth(folderIdx)
    selectFolderId.value = folderIdx

    nowFolderId.value = selectFolderId.value

    fnSearch(nowFolderId.value);
    const setFolderNm = treeContents.value.filter(data => data.folderId == selectFolderId.value).map(data => ({
        folderNm: data.folderNm
    }));
    folderNm.value = setFolderNm[0].folderNm;
};

/** 파일 및 폴더 리스트 */
const fnSearch = (node) => {

    const listUrl = `/api/folderFileList`;
    const params = {};
    params.API_PATH = listUrl;
    params.folderId = node;

    store.dispatch('API_LIST', params).then((data) => {
        tableDatas.value = data.resultList;

    }).catch(({ message }) => {
        console.log("message : " + message);
    });
}

/** 중요 설정 */
const fnSetFav = (item) => {
    const getFav = ref(item.favoriteYn);
    const setFav = ref(null);

    if(getFav.value == 'N'){
        setFav.value = 'Y'
    } else {
        setFav.value = 'N'
    }

    const jsonData = {
        fileGroupId : item.fileGroupId,
        favoriteYn : setFav.value,
    }

    const apiUrl = `/api/changeFav`
    let params = {};
    params.API_PATH = apiUrl;
    params.JSON_DATA = jsonData;

    store.dispatch('API_UPDATE', params).then((data) => {
        fnView(treeKind.value);
        
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 휴지통 삭제 */
const fnDelete = () => {

    if(!confirm("삭제 하시겠습니까?")){
      return;
    }

    let deleteItems = [];
    selectedItem.value.forEach(item => deleteItems.push({ fileGroupId: item.fileGroupId, folderYn: item.folderYn }));

    const apiUrl = "/api/bsInfoDelete";

    let params = {};
    params.API_PATH = apiUrl;
    params.deleteItems = deleteItems;

    store.dispatch('API_DELETE',params).then((data) => {
        fnSearchBin();
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

const udtFolderId = ref(null);
const udtFolderNm = ref(null);

/** 수정 */
const fnOpenUpdate = (e, row) => {
    if(treeKind.value == 'trash'){
        return false;
    }

    udtFolderId.value = row.item.fileGroupId;
    udtFolderNm.value = row.item.title;

    authCd.value = row.item.authCd;
    
    const folderYn = row.item.folderYn;

    if (folderYn === 'Y') {
        if(userAuth.value?.searchYn != true){
            alert("조회 권한이 없습니다.");
            return;
        }    

        // folderModal.value = true;
        nowFolderId.value = row.item.fileGroupId
        selectFolder(nowFolderId.value);
    } else if (folderYn === 'N') {
        if(userAuth.value?.updateYn != true){
            alert("수정 권한이 없습니다.");
            return;
        }
        fileModal.value = true;
    }

}

/** 파일 다운로드 */
const fnFileDownload = (item) => {

    const apiUrl = `/api/bsFileDown/`+item.fileGroupId;
    let params = {};
    params.API_PATH = apiUrl;
    params.orgFileNm = item.title;

    store.dispatch('API_FILE_DOWN', params).then((data) => {
        
    }).catch(({message}) => {
        console.log("message : " , message);
    })

}

/** 닫기 */
const fnClose = (kind) => {

    if(kind == 'folder'){
        fnFolderTree(nowFolderId.value);
        folderModal.value = false
        folderAddModal.value = false
    } else if (kind == 'file'){
        selectFolder(nowFolderId.value);
        fileModal.value = false;
        fileAddModal.value = false;
    } else if (kind == 'share'){
        shareModal.value = false;
        // selectFolder();
    } else if (kind == 'auth'){
        authModal.value = false;
    } 

}

/** 문서 선택 */
const fnView = (kind) => {

    if(kind == 'dept'){
        treeKind.value = kind;
        selectFolder(nowFolderId.value);
    } else if (kind == 'star'){
        treeKind.value = kind; 
        fnSearchStar();
    } else if (kind == 'share'){
        treeKind.value = kind;
        fnSearchShare();
    } else if (kind == 'trash'){
        treeKind.value = kind;
        fnSearchBin();
    }
}

/** 중요문서 목록조회 */
const fnSearchStar = () => {
    const apiUrl = '/api/starList';

    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch("API_LIST",params).then((data) => {
        tableDatas.value = data.resultList;
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 공유문서 목록조회 */
const fnSearchShare = () => {
    const apiUrl = '/api/shareList';

    let params = {};
    params.API_PATH = apiUrl;
    params.targetId = loginId;

    store.dispatch("API_LIST",params).then((data) => {
        tableDatas.value = data.resultList;
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 모달 */
const openModal = (item) => {
    if(item == 'menu'){
        if (userAuth.value?.createYn !== true) {
            alert("등록 권한이 없습니다.");
            return;
        }
        menu.value = true;
    } else {
        shareModal.value = true;
        fileGroupId.value = item.fileGroupId;
        folderId.value = item.fileGroupId;
        ownerId.value = item.regId;
        folderYn.value = item.folderYn;
    }
}

/** 휴지통 목록 */
const fnSearchBin = () => {
    const apiUrl = '/api/trashList';

    let params = {};
    params.API_PATH = apiUrl;

    store.dispatch("API_LIST",params).then((data) => {
        tableDatas.value = data.resultList;
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 휴지통 이동 */
const moveTrash = async () => {
    if(userAuth.value?.deleteYn != true){
        alert("삭제 권한이 없습니다.");
        return;
    } 

    if (!confirm("삭제 하시겠습니까?")) {
        return;
    }

    let deleteItems = [];
    selectedItem.value.forEach(item => deleteItems.push({ fileGroupId: item.fileGroupId, folderYn: item.folderYn }));

    let folderDeleteItems = deleteItems.filter(item => item.folderYn === 'Y').map(item => Number(item.fileGroupId));
    let fileDeleteItems = deleteItems.filter(item => item.folderYn === 'N').map(item => item.fileGroupId);

    const deletePromises = [];

    if (folderDeleteItems.length > 0) {
        const jsonData = {
            deleteItems: folderDeleteItems,
            loginId: loginId,
        };

        let params = {};
        params.API_PATH = "/api/delFolder";
        params.JSON_DATA = jsonData;

        deletePromises.push(store.dispatch('API_UPDATE', params));
    }

    if (fileDeleteItems.length > 0) {
        const jsonData = {
            deleteItems: fileDeleteItems,
            loginId: loginId,
        };

        let params = {};
        params.API_PATH = "/api/delFile";
        params.JSON_DATA = jsonData;

        deletePromises.push(store.dispatch('API_UPDATE', params));
    }

    try {
        await Promise.all(deletePromises);
        store.commit('enqueueSnackbar', { message: '정상적으로 삭제되었습니다.', visible: true, timeout: 2000 });
    } catch (error) {
        console.log("message: ", error);
    }
    
    selectFolder(nowFolderId.value);
    // fnSearchBin();
}

/** 휴지통 복구 */
const fnRestore = async () => {
    
    if (!confirm("복구 하시겠습니까?")) {
        return;
    }

    let restoreItems = [];
    selectedItem.value.forEach(item => restoreItems.push({ fileGroupId: item.fileGroupId, folderYn: item.folderYn }));

    let folderRestore = restoreItems.filter(item => item.folderYn === 'Y').map(item => Number(item.fileGroupId));
    let fileRestore = restoreItems.filter(item => item.folderYn === 'N').map(item => item.fileGroupId);

    const promises = [];

    if (folderRestore.length > 0) {
        const jsonData = {
            deleteItems: folderRestore,
            loginId: loginId,
        };

        let params = {};
        params.API_PATH = "/api/restoreFolder";
        params.JSON_DATA = jsonData;

        promises.push(store.dispatch('API_UPDATE', params));
    }

    if (fileRestore.length > 0) {
        const jsonData = {
            deleteItems: fileRestore,
            loginId: loginId,
        };

        let params = {};
        params.API_PATH = "/api/restoreFile";
        params.JSON_DATA = jsonData;

        promises.push(store.dispatch('API_UPDATE', params));
    }

    try {
        await Promise.all(promises);
        store.commit('enqueueSnackbar', { message: '정상적으로 저장되었습니다.', visible: true, timeout: 2000 });
    } catch (error) {
        console.log("message: ", error);
    }

    // selectFolder();
    fnSearchBin();
}

const fnSetAuth = (item) => {
    authModal.value = true;

    authCd.value = item.authCd;
    folderId.value = item.fileGroupId;
}

const folderMnager = () => {
    const apiUrl = "/api/folder/mngrId";

    let params = {};
    params.API_PATH = apiUrl;
    params.deptCd = loginInfo.value.deptCd;

    store.dispatch('API_LIST',params).then((data) => {
        mngrId.value = data.resultList.data.mngrId;
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 모달창 */
const setMenuKind = (kind) => {
    
    if(selectFolderId.value == undefined){
        return;
    }
    
    if (kind === 'folderAdd') {
        authCd.value = loginInfo.value.deptCd;
        folderAddModal.value = true;
    } else if (kind === 'fileAdd') {
        fileAddModal.value = true;
    }
}

/** 부서별 유저 권한 조회 */
const fnGetAuthMapp = () => {
    const apiUrl = "/api/userAuthMapp";

    let params = {};
    params.API_PATH = apiUrl;
    params.userId = loginId;
    params.deptId = loginInfo.value.deptCd;

    store.dispatch('API_LIST',params).then((data) => {
        userDeptAuthMapp.value = data.resultList;

        fnFolderTree(); 
    }).catch(({message}) => {
        console.log("message : ", message);
    })
}

/** 폴더별 유저 권한조회 */
const fnGetUserAuth = (folderId) => {
    userAuth.value = userDeptAuthMapp.value.filter(item => item.folderId == folderId)[0];
}

const fnInit = () => {
    treeKind.value = 'dept';
    folderMnager();
    fnGetAuthMapp();
}

/** DOM 객체 완성 이후 */
onMounted(() => {
    fnInit();
});
</script>

<template>
    <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="3">
            <v-card variant="outlined">
                <v-row><v-col></v-col></v-row>
                
                <v-row>
                    <v-col>
                        <!-- new버튼 -->
                        <fileMngMenu :show="menu" @close="menu = false" v-if="menu" @menuKind="setMenuKind"/>
                        <v-btn color="indigo" @click="openModal('menu')"> NEW </v-btn>
                        <!--  -->

                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="1"></v-col>
                    <v-col cols="10">
                        <v-text-field
                            variant="solo"
                            label="폴더 검색"
                            prepend-inner-icon="mdi-magnify"
                            clearable
                            v-model="srhTree"
                        >
                        </v-text-field>
                    </v-col>
                </v-row>

                    <v-divider></v-divider>
                    
                <v-row>
                    <v-col>
                        <v-btn variant="text" @click="fnView('dept')">부서 문서</v-btn>
                    </v-col>
                </v-row>
                
                <v-row v-if="treeKind == 'dept'">
                    <v-col>
                        <v-treeview
                            v-model="tree"
                            :items="filteredItems"
                            selected-color="indigo"
                            item-value="id"
                            return-object
                            :active-strategy="'independent'"
                            @click:select="selectFolder"
                            @click:open="selectFolder"
                        ></v-treeview>
                    </v-col>
                </v-row>

                    <v-divider></v-divider>
                
                <!-- <v-row>
                    <v-col>
                        <v-btn variant="text" >내 문서</v-btn>
                    </v-col>
                </v-row>

                    <v-divider></v-divider> -->

                <v-row>
                    <v-col>
                        <v-btn variant="text" @click="fnView('share')">공유 문서</v-btn>
                    </v-col>
                </v-row>
                
                    <v-divider></v-divider>

                <v-row>
                    <v-col>
                        <v-btn variant="text" @click="fnView('star')">중요 문서</v-btn>
                    </v-col>
                </v-row>
                
                    <v-divider></v-divider>

                <v-row>
                    <v-col>
                        <v-btn variant="text" @click="fnView('trash')">휴지통</v-btn>
                    </v-col>
                </v-row>

                <v-row><v-col></v-col></v-row>
            </v-card>
        </v-col>
        <v-col cols="7">
            <v-card variant="outlined">
                <v-row><v-col></v-col></v-row>
                <template v-slot:text>
                    <v-row align="center" justify="space-between">
                        <v-col cols="auto">
                            <v-text-field
                                v-model="search"
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                hide-details
                                single-line
                                style="width: 400px;"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="auto">
                            <v-row>
                                <v-col cols="auto">
                                    <v-btn @click="moveTrash" v-if="treeKind != 'trash'">삭제</v-btn>
                                    <v-btn @click="fnRestore" v-if="treeKind == 'trash'">복구</v-btn>
                                    <v-btn @click="fnDelete" v-if="treeKind == 'trash'">삭제</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </template>

                <v-data-table
                    :headers="headers"
                    :items="tableDatas"
                    :search="search"
                    density="compact"
                    item-key="id"
                    show-select
                    return-object
                    v-model="selectedItem"
                    @dblclick:row="fnOpenUpdate"
                >
                    <template v-slot:[`item.favoriteYn`]="{ item }">
                        <v-btn v-if="item.folderYn == 'N' && treeKind != 'share' && treeKind != 'trash'"
                            :class="item.favoriteYn !== 'N' ? 'text-yellow-darken-2' : ''"
                            icon="mdi-star"
                            variant="text"
                            @click="fnSetFav(item)"
                        ></v-btn>
                        <v-icon v-if="item.folderYn == 'Y'" icon="mdi-folder" color="blue"></v-icon>
                    </template>
                    <template v-slot:[`item.fileSize`]="{ item }">
                        {{ item.fileSize != 0 ? Math.floor(item.fileSize / 1024) + ' KB' : '' }}
                    </template>
                    <template v-slot:[`item.fileType`]="{ item }">
                        <!-- 묶음 파일??? -->
                        <v-btn v-if="item.fileType && item.fileGroupCnt == 1 && treeKind != 'trash'"
                            variant="tonal" 
                            @click="fnFileDownload(item)" 
                            size="x-small"
                        >Download</v-btn>
                    </template>
                    <template v-slot:[`item.folderYn`]="{ item }">
                            <v-card-actions v-if="item.regId == loginId && treeKind != 'trash'">
                                <v-btn
                                    prepend-icon="mdi-share-variant"
                                    @click="openModal(item)"
                                >
                                </v-btn>
                                <v-btn v-if="item.folderYn == 'Y' && loginId == mngrId"
                                    prepend-icon="mdi-account-multiple-outline"
                                    @click="fnSetAuth(item)"
                                >
                                </v-btn>
                                <!-- 
                                <v-icon class="me-2" size="small" @click="openModal(item)">
                                    mdi-share-variant
                                </v-icon>
                                <v-icon v-if="item.folderYn == 'Y'" size="small" @click="fnSetAuth(item)"> mdi-account-multiple-outline </v-icon>
                                -->
                            </v-card-actions>
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>

    <AuthMappModal :authInfo="{ authCd: authCd, folderId: folderId }" :show="authModal" v-if="authModal" @close="fnClose('auth')"/>
    <ShareModal :shareInfo="{ ownerId: ownerId, folderId: folderId, fileGroupId: fileGroupId, folderYn: folderYn }" :show="shareModal" v-if="shareModal" @close="fnClose('share')"/>
    <FolderAddModal :show="folderAddModal" :nowFolder="{ folderId: selectFolderId, folderNm: folderNm, authCd :authCd }" @close="fnClose('folder')" v-if="folderAddModal"/>
    <FileAddModal :show="fileAddModal" :nowFolder="{ folderId: selectFolderId, folderNm: folderNm }" @close="fnClose('file')" v-if="fileAddModal"/>
    <!-- <FolderUpdateModal :show="folderModal" :nowFolder="{ folderId: udtFolderId, folderNm: udtFolderNm, authCd:authCd }" @close="fnClose('folder')" v-if="folderModal"/> -->
    <FileUpdateModal :show="fileModal" :nowFolder="{ folderId: selectFolderId, fileGroupId: udtFolderId, folderNm: folderNm }" @close="fnClose('file')" v-if="fileModal"/> 
    
</template>

<style scoped>

</style>
