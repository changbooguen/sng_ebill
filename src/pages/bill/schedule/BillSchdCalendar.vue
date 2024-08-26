<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import store from '@/store';

const cmtList = ref([])
const eventIs = ref([])
const selectDt = ref(new Date())
const showDt = ref(formatDate(selectDt.value));
const allList = ref([])
const tabList = ref([{ cmtNm: '본회의', openDtm: '2024-07-18', closeDtm: '', mtngPlc: '회의실201' }]) //todo 본회의 db로 연결
const dayCk = ref(0)


function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const props = defineProps({
  selectTab: String
})


const masks = {
  weekdays: 'WWW',
};

watch(() => selectDt.value, () => {
  showDt.value = selectDt.value;
});


const fnGetplenary = () => {
  let params = {}
  params.API_PATH = "/api/plenary"

  store.dispatch('API_LIST', params).then((data) => {
  }).catch(({ message }) => {
    console.log(message)
  })
}

const fnGetMtng = () => {
  let params = {}

  params.API_PATH = "/api/mtng/list"
  params.size = 1000;
  params.mtngSj = '';

  store.dispatch('API_LIST', params).then((data) => {
    data.resultList.data.forEach(element => {
      allList.value.push({
        cmtNm: element.cmtNm,
        openDtm: element.openDtm,
        closeDtm: element.closeDtm,
        mtngPlc: element.mtngPlc,
      })
    });

    fnArrt(allList.value)

  }).catch(({ message }) => {
    console.log(message)
  })
}


const fnArrt = (arrayIs) => {
  eventIs.value = []
  for (let i = 0; i < arrayIs.length; i++) {
    eventIs.value.push({
      key: arrayIs[i].openDtm,
      customData: {
        title: arrayIs[i].cmtNm
      },
      dot: true,
      dates: new Date(arrayIs[i].openDtm),
      color: 'red'
    })
  }

  eventIs.value.push({
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light',
      contentClass: 'italic',
    },
    dates: new Date(),
    color: 'green'
  })
}


const dateClick = (day) => {
  dayCk.value = day.day
  if (props.selectTab === '0') {
    return null; //todo 수정  
  } else if (props.selectTab === '1') {
    dtClickPlenary(day);
  } else {
    dtClickMtng(day, false)
  }
};

const dtClickMtng = (data, clickYn) => {
  tabList.value = []
  cmtList.value = []

  //todo 회의 등록시 날짜 형식 참고 후 수정 (현재 : 2023-07-12 형식)
  if (clickYn) {
    selectDt.value = data
  } else if (!clickYn) {
    selectDt.value = data.id
  }

  let params = {}
  params.API_PATH = "/api/getDateMtng"
  params.selectDt = selectDt.value

  store.dispatch('API_LIST', params).then((data) => {
    data.resultList.data.forEach(element => {
      cmtList.value.push({
        cmtNm: element.cmtNm,
        openDtm: element.openDtm,
        closeDtm: element.closeDtm,
        mtngPlc: element.mtngPlc,
      })
    });
    tabList.value = cmtList.value

  }).catch(({ message }) => {
    console.log(message)
  })
}

const dtClickPlenary = (day) => {
  let params = {}
  params.API_PATH = "/api/getDatePlenary"
  params.selectDt = day.id

  store.dispatch('API_LIST', params).then((data) => {
  }).catch(({ message }) => {
    console.log(message)
  })
}

const calendarColor = computed(() => {
  if (props.selectTab === '0') {
    return 'blue';
  } else if (props.selectTab === '1') {
    return 'red';
  } else {
    return 'blue';
  }
});

onMounted(() => {
  let newTab = props.selectTab

  if (newTab === '0') {
    // tabList.value = []
    fnGetMtng();
    tabList.value = allList.value
  } else if (newTab == '1') {
    fnGetplenary();
    fnArrt(tabList.value)
  } else if (newTab === '2') {
    fnGetMtng();
    dtClickMtng(showDt.value, true)
    tabList.value = cmtList.value
  }
})

</script>



<template>

<v-container>
  <v-row class="lg-12">
    <v-row  class="lg-12">
      <v-col cols="8">
        <v-calendar :masks="masks" mode="dateTime" :attributes="eventIs" expanded locale="eng" :color="calendarColor" @dayclick="dateClick">
        </v-calendar>
      </v-col>

      <v-col cols="4">
        <v-card variant="none" class="detailArea">
          <div style="font-weight: bold;">{{ showDt }}</div>
          <hr>
          <template v-for="(item, i) in tabList" :key="i">
            <div class="dotTitle">
              <div class="dotComt" :class="{ colorIs: props.selectTab === '1' }"></div>
              <div>{{ item.cmtNm }}</div>
            </div>
            <div class="dotDetail">{{ item.openDtm + " " + item.mtngPlc }}</div>
            <hr>
          </template>
          <template v-if="tabList.length <= 0">
            일정이 없습니다.
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-row>
</v-container>
</template>


<style>
div.vc-day {
  padding: 15px;
}

.detailArea {
  height: 65vh;
  overflow-y: auto;
}

.dotTitle {
  display: flex;
}

.dotComt {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(109, 126, 201);
  margin: 3px 10px 0 0;
}

.dotComt.colorIs {
  background-color: red;
}

.dotDetail {
  margin-left: 20px;
  color: #858585;
}

</style>
