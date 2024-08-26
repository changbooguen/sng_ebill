<script setup>


</script>

<template>

  <div class="mainArea">
    <div class="contentMainArea">
      <div class="currentTitle">
        사용자관리
      </div>
      <div class="searchArea">
        <div>
          직무
          <select name="">
            <option>전체</option>
            <option value="1">의원</option>
            <option value="2">보좌관</option>
            <option value="3">공무원</option>
          </select>
        </div>
        <div>
          부서
          <select name="">
            <option>전체</option>
          </select>
        </div>
        <div>
          사용자명
          <input type="text">
        </div>
        <div class="searchIconArea">
          <div class="searchButton">조회</div>
          <div class="resetButton">초기화</div>
        </div>
      </div>
      <div class="mainContentArea">
        <div class="contentTopArea">
          <div class="countArea">
            <div class="totalText">
              Total :
            </div>
            <div class="countText">
              3
            </div>
          </div>
          <div class="addDeleteButtonArea">
            <button class="insertButton">등록</button>
            <button class="deleteButton">삭제</button>
          </div>
        </div>
        <div class="contentData">
          <div class="contentHead">
            <div class="">연번</div>
            <div class="">부서</div>
            <div class="">직무</div>
            <div class="">사용자명</div>
            <div class="">아이디</div>
            <div class="">이메일</div>
          </div>
          <div class="contentBody" id="contentBody">
            <!--Todo for문을 이용하여 데이터 뿌려주기 -->
              <div class="contentList" >
                <div class="">1</div>
                <div class="">의사국</div>
                <div class="">주무관</div>
                <div class="">강병원</div>
                <div class="">Aaaa2</div>
                <div class="">aaa2@gmail.com</div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leftMenuTitle{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  font-size: 1.3rem;
  font-weight: bold;
  border-bottom: 1px solid black;
}
.subMenuArea{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.subMenu{
  display: flex;
  align-items: center;
  width: 93%;
  height: 40px;
  padding: 10px;
  font-size: 1.2rem;
  border-bottom: 1px solid black;
}
.mainArea{
  position: relative;
  border-top: 1px solid #AFAFAF;
  width: 100%;
  height: 90vh;
  background: #EEF1F5;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
}
.leftMenuArea{
  display: flex;
  background-color: white;
  width: 12vw;
  height: 80%;
  border-radius: 20px;
  padding: 20px;
  flex-direction: column;
}
.searchArea{
  background: white;
  position: relative;
  width: 70vw;
  height: 8vh;
  background: white;
  margin: 20px 0 20px 0;
  padding: 0 10px 0 10px;
  border-radius: 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mainContentArea{
  background: white;
  width: 70vw;
  height: 60vh;
  border-radius: 20px;
  margin: 10px 0 10px 0;
  padding: 0 10px 0 10px;
}
.searchIconArea{
  display: flex;
}
.searchIconArea div{
  margin: 10px
}
.searchButton, .resetButton{
  cursor: pointer;
}
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
.insertButton{
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #007bff;
  margin: 10px;
  width: 60px;
  height: 30px;
}
.contentTopArea{
  display: flex;
  justify-content: space-between;
  height: 6vh;
  align-items: center;
}
.contentHead{
  display: grid;
  grid-template-columns: 4vw 8vw 6vw 20vw 12vw 15vw ;
  background: #3FBAFE;
  color: white;
  height: 4vh;
  align-items: center;
  font-weight: bold;
}
.contentHead div{
  display: flex;
  align-items: center;
  justify-content: center;
}
.contentList{
  display: grid;
  grid-template-columns: 4vw 8vw 6vw 20vw 12vw 15vw;
  align-items: center;
  height: 4vh;
  border-bottom: 1px solid #C7C7C7;
  cursor: pointer;
}
.contentList div{
  display: flex;
  align-items: center;
  justify-content: center;
}
.contentList:hover{
  background: #E3F7FF;
}
.deleteButton{
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #C7C7C7;
  margin: 10px;
  width: 60px;
  height: 30px;
}
select{
  width: 220px;
  height: 24px;
}
.currentTitle{
  font-size: 1.2rem;
  font-weight: bold;
  background: white;
  position: relative;
  width: 70vw;
  height: 5vh;
  border-radius: 30px;
  padding: 0 10px 0 10px;
  display: flex;
  align-items: center;
}
</style>