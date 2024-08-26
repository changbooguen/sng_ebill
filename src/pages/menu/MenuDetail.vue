<script setup>
import {defineProps, ref, inject, onMounted} from "vue";
import axios from "@/axios";
import TopTitleAndNav from "@/components/TopTitleAndNav.vue";
import {useRouter} from "vue-router";

const isModify = ref(false);
const isReadOnly = ref(true);
// data
const menuNm1 = ref("");
const ord = ref(0);
const path = ref("");
const rmk = ref("");
const menuId = ref("")
const upperMenu = ref([{"menuNm1" : "전체", "menuId" : 0}]);
const selectUpperMenu = ref("");

const router = useRouter();
const props = defineProps({
  menuId : String, Number
})
const data = ref({});

const getData = onMounted(()=>{
  axios.get("/api/menu/"+props.menuId)
      .then((s)=>{
        let ss= s.data.data;
        data.value = ss;
        menuId.value = ss.menuId;
        menuNm1.value =ss.menuNm1;
        ord.value = ss.ord;
        path.value = ss.path;
        selectUpperMenu.value = ss.uprMenuId ;
        rmk.value = ss.rmk;
      })
      .catch(e=>{
        console.log(e);
      })
})
const getUpperMenu= onMounted(()=>{
  axios.get("/api/menu/upper")
      .then(s=>{
        upperMenu.value =[{menuNm1: "None", menuId: 0}, ...s.data.data];
      }).catch(e=> console.log(e))
})
const back = ()=>{
  router.go(-1)
}
const modifyButton = ()=>{
  isReadOnly.value =false;
  isModify.value= true;
}
const cancel = ()=>{
  const v = data.value ;

  menuNm1.value = v.menuNm1;
  ord.value= v.ord ;
  path.value = v.path;
  selectUpperMenu.value = v.uprMenuId;
  rmk.value = v.rmk;
  isReadOnly.value =true;
  isModify.value= false;
}

const save = ()=>{
  //TODO 검증 필요
  const formData = new FormData();
  formData.append("menuId", menuId.value);
  formData.append("menuNm1", menuNm1.value);
  formData.append("ord", ord.value);
  formData.append("path", path.value);
  formData.append("uprMenuId", selectUpperMenu.value);
  formData.append("rmk", rmk.value);


  axios.put("/api/menu", formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((s)=>{
    alert("success");
    router.push("/menu");
  }).catch(e=>console.log(e))

}
const deleteButton = ()=>{
  axios.delete("/api/menu/"+props.menuId)
      .then((s)=>{
        alert("success")
        router.push("/menu");
      }).catch(e=>console.log(e))
}

</script>

<template>
  <top-title-and-nav></top-title-and-nav>
  <div class="infoArea">
    <div class="infoOne">
      <div>id : </div>
      <v-text-field
          id="menuId"
          :value = "menuId"
          variant="outlined"
          placeholder="name"
          readonly
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>메뉴명 : </div>
      <v-text-field
          v-model="menuNm1"
          variant="outlined"
          placeholder="name"
          :readonly ="isReadOnly"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>순서 : </div>
      <v-text-field
          v-model="ord"
          variant="outlined"
          placeholder="order"
          :readonly ="isReadOnly"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>경로 : </div>
      <v-text-field
          v-model="path"
          variant="outlined"
          placeholder="order"
          :readonly ="isReadOnly"
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>상위메뉴 : </div>
      <v-select
          v-model="selectUpperMenu"
          label ="upperMenu"
          :items = "upperMenu"
          item-title = "menuNm1"
          item-value="menuId"
          :readonly="isReadOnly"
      >
      </v-select>
    </div>
    <div class="infoOne">
      <div>만든날짜 : </div>
      <v-text-field
          :value = "data.regDt"
          variant="outlined"
          placeholder="upperMenuId"
          readOnly
      ></v-text-field>
    </div>
    <div class="infoOne">
      <div>비고 : </div>
      <v-text-field
          v-model="rmk"
          variant="outlined"
          placeholder="rmk"
          :readonly ="isReadOnly"
      ></v-text-field>
    </div>
  </div>
  <div class="buttonArea">
    <v-btn @click="back">
      목록
    </v-btn>
    <template v-if="!isModify">
      <v-btn @click="modifyButton">
        수정
      </v-btn>
      <v-btn @click="deleteButton">
        삭제
      </v-btn>
    </template>
    <template v-else>
      <v-btn @click = "save">
        저장
      </v-btn>
      <v-btn @click="cancel">
        취소
      </v-btn>
    </template>

  </div>
</template>

<style scoped>
.infoArea{
  margin :10px;
  border : 1px solid #C7C7C7;
  border-radius : 4px;
  display: flex;
  flex-direction: column;
  justify-items : center;
  padding : 30px;
}
.infoOne{
  display: grid;
  grid-template-columns :20% 75%;
  height: 75px;
  grid-gap: 10px;
  align-items: center;
}
.buttonArea button{
  margin-left : 10px
}
.buttonArea{
  display : flex;
  justify-content: center;
}
</style>