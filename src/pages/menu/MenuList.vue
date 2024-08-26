<script setup>

import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import axios from "@/axios";
import TotalCount from "@/components/TotalCount.vue";
import Sortable from 'sortablejs';
import {computed, inject, onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const pageSize = ref(100);
const count = ref(0);
const router = useRouter();
const data = ref([]);
const isOrderChange = ref(false);
const dataTable = ref(null);

const headers = [
    {title : "연번", value : "index", sortable: false },
    {title : "메뉴명", value : "menuNm1"},
    {title : "상위메뉴", value :  "uprMenuName"},
    {title : "경로" , value : "path"},
    {title : "비고", value: "rmk"},
    {title : "순서", value: "ord"},
    {title : "순서변경", value : "order"}
]

const getData = ()=>{
  axios.get("/api/menus?page=0" + "&size="+pageSize.value+"&sort=ord,asc")
      .then(s=>{
        let datas = s.data.data.content
        data.value = datas;
        count.value = s.data.data.count
      }).catch(e=>{
        console.log(e)
      })
}

const bodyClick= (e, row)=>{
  router.push({
    name : 'menuDetail',
    params : {
      menuId : row.item.menuId
    }
  });
}

const saveClick = ()=>{
  router.push("/menu/save");
}

// drag
onMounted(async () => {
  await getData();
  const tbody = dataTable.value.$el.querySelector('tbody');
  let selectedItem = null;
  Sortable.create(tbody, {
    handle: '.drag-handle',
    onChoose: (evt) => {
      selectedItem = data.value[evt.oldIndex];
    },
    onUnchoose: (evt) => {
      selectedItem = null;
    },
    onEnd: (evt) => {
      let itemMoved = data.value.splice(evt.oldIndex, 1)[0];
      data.value.splice(evt.newIndex, 0, itemMoved);
      data.value.forEach((d,i)=>{
        if(d)
          d.ord = (i+1);
      })
      isOrderChange.value = true;
    }
  });
});

const orderUpdate = ()=>{
  axios.put("/api/menu/order", data.value)
      .then(s=>{
        alert("success");
        isOrderChange.value = false;
      })
      .catch(e=>{
        alert("error");
        cancel();
      })
}

const cancel = ()=>{
  isOrderChange.value = false;
  getData();
}

const getMenuName= (upperMenuId)=>{
  const menu = data.value.find(i=>i.menuId === upperMenuId)
  return menu ?menu.menuNm1 : '-';
}

const computedData = computed(()=>{
  return data.value.map(i=>({
        ...i,
        uprMenuName : getMenuName(i.uprMenuId)
  }));
})
</script>

<template>
  <top-title-and-nav></top-title-and-nav>

  <div class="mainContentArea">
    <div class="contentTopArea">
      <div class="countArea">
        <total-count :totalCount="count"></total-count>
      </div>
      <div class="addDeleteButtonArea">
        <template v-if="isOrderChange">
          <div>
            changeOrder
          </div>
          <v-btn
              variant="outlined"
              @click="orderUpdate"
          >
            저장
          </v-btn>
          <v-btn
              variant="outlined"
              color="red"
              @click="cancel"
          >
            취소
          </v-btn>
        </template>
        <template v-else>
          <v-btn
              variant="outlined"
              color="primary"
              @click='saveClick'
          >등록</v-btn>
        </template>
      </div>
    </div>
    <div class="contentData">
      <v-data-table
          :headers="headers"
          :items="computedData"
          item-value="menuId"
          @click:row="bodyClick"
          ref="dataTable"
          :items-per-page="-1"
          hide-default-footer
          height = "800"
      >
        <template v-slot:[`item.index`]="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:[`item.order`]>
          <span class="drag-handle"><v-icon size="40">mdi-drag-horizontal</v-icon></span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<style scoped>
.drag-handle {
  cursor: move;
  color: #999;
}
.searchIconArea button{
  margin: 10px;
}
.mainContentArea{
  background: white;
  border-radius: 20px;
  margin: 10px 0 10px 0;
  padding: 0 10px 0 10px;
}
.addDeleteButtonArea{
  display : flex;
  align-items : center;
  width: 300px;
  justify-content: space-around;

}
.contentTopArea{
  display: flex;
  justify-content: space-between;
  height: 6vh;
  align-items: center;
}

</style>