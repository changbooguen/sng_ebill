<template>
  <v-table class="hasRowRank border">
    <thead>
    <tr>
      <th class="text-center">의안번호</th>
      <th class="text-center">의안명</th>
      <th class="text-center">접수일자</th>
      <th class="text-center hasRow" style="width: 10%;">
        <div>위원회</div>
        <span class="row_rank">접수</span>
        <span class="row_rank">의결</span>
      </th>
      <th class="text-center hasRow" style="width: 10%;">
        <div>본회의</div>
        <span class="row_rank">부의</span>
        <span class="row_rank">의결</span>
      </th>
      <th class="text-center" style="width: 10%;">헌법위원회</th>
      <th class="text-center" style="width: 10%;">정부이송</th>
      <th class="text-center" style="width: 10%;">공포</th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="item in desserts"
        :key="item.name"
    >
      <td class="text-center">{{ item.tableData01 }}</td>
      <td class="text-center">{{ item.tableData02 }}</td>
      <td class="text-center">{{ item.tableData03 }}</td>

      <td class="progress_bar" colspan="5">
        <v-progress-linear
          color="light-blue"
          height="10"
          :model-value="item.progressValue"
          striped
        ></v-progress-linear>
      </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  data: () => ({
    desserts: [
      {
        tableData01: "2132133",
        tableData02: "국회법 일부개정법률안",
        tableData03: "2022-07-19",
        progressValue: 40,
      },

    ],
  }),
}
</script>

<style lang="scss" scoped>

</style>