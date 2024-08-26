<script>
export default {
  name: "totalCount",
  props:['totalCount']

}
</script>

<template>
<div class="countArea">
  <div class="totalText">
    Total :
  </div>
  <div class="countText">
    {{totalCount}}
  </div>
</div>
</template>
<style scoped>
  .countArea{
    display: flex;
  }
  .totalText{
    font-weight: bold;
  }
  .countText{
    color: #1890FD;
    font-weight: bold;
  }

</style>