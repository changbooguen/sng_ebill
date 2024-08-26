<template>
  <v-card
      prepend-icon="mdi-dots-grid"
      title="등록·조회"
  >
    <v-card-text>
      <article class="column">
        <div class="bundle">
          <v-table class="compact">
            <tbody>
            <tr>
              <th>코드</th>
              <td colspan="6">
                {{ "1001" }}
              </td>
            </tr>

            <tr>
              <th>불어</th>
              <td colspan="6">
                <v-text-field
                    density="compact"
                    variant="outlined"
                    hide-details
                ></v-text-field>
              </td>
            </tr>

            <tr>
              <th>영어</th>
              <td colspan="6">
                <v-text-field
                    density="compact"
                    variant="outlined"
                    hide-details
                ></v-text-field>
              </td>
            </tr>

            <tr>
              <th>영어</th>
              <td>
                {{ "1001" }}
              </td>
              <th>영어</th>
              <td>
                {{ "1001" }}
              </td>
              <th>영어</th>
              <td>
                {{ "1001" }}
              </td>
            </tr>
            <tr>
              <th>비고</th>
              <td colspan="6">
                <v-textarea variant="outlined" hide-details></v-textarea>
              </td>
            </tr>
            </tbody>
          </v-table>
        </div>

      </article>
    </v-card-text>

    <template v-slot:actions>
      <v-btn variant="tonal">저장</v-btn>
      <v-btn variant="tonal" class="negative">취소</v-btn>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'NewPopup',
}
</script>

<style scoped>

</style>
