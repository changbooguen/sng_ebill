<template>
  <section class="content_bundle">

    <TitleComp>
      <template #titleName>본회의표결정정보 상세</template>
    </TitleComp>

    <article class="basic panel">
      <div class="panel_bundle">
        <div class="detail_unit">
          <h5>의안명</h5>
          <span>국회법 일부개정법률안</span>
        </div>
        <div class="detail_unit">
          <h5>발의자·제안자</h5>
          <span>Ababacar MBAYE, Abass FALL, Abdou DIENG</span>
        </div>
      </div>
    </article>

    <article class="basic">
      <MultiTdTableComp>

      </MultiTdTableComp>
    </article>


  </section>
</template>

<script>
export default {
  data: () => ({
    select: { state: 'Florida', abbr: 'FL' },
    items: [
      { state: 'Florida', abbr: 'FL' },
      { state: 'Georgia', abbr: 'GA' },
      { state: 'Nebraska', abbr: 'NE' },
      { state: 'California', abbr: 'CA' },
      { state: 'New York', abbr: 'NY' },
    ],
  }),
}
</script>

<style lang="scss" scoped>

</style>