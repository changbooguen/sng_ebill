<template>
<v-select v-model="selectedValue" :items="resultCodes" item-value="codeId" item-title="codeNm" density="compact"></v-select>
</template>
<script>
import { useStore } from 'vuex';
import {ref,toRef,computed} from 'vue';
export default {
  name: 'BillCodeComponent',
  props: {
      groupCode: {
        type: String,
        required: true
      },
  },
  setup(props, context) {
    
    const store = useStore();
    const pGroupCode = toRef(props, 'groupCode');
    const codeList = computed(() => store.getters.inputCodeList);
    const resultCodes = ref([]);
    const selectedValue = ref('');
    resultCodes.value = codeList.value.filter((item) => (item.grpCode === pGroupCode.value || item.grpCode === ''));

    const getCode = () => {
      return selectedValue.value;
    }
    const setCode = (_argCode) => {
        selectedValue.value = _argCode;
    }

    return {
        ...props,
        pGroupCode,
        resultCodes,
        selectedValue,
        getCode,
        setCode
    }
  },
}
</script>
<style>

</style>