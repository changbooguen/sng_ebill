<script>
import axios from "@/axios";

let username = '';
let userId = '';
let password = '';
let passwordChk = '';
let phoneNumber = '';
let position = '';
let telNumber = '';
let fax = '';
let email = '';
let work = '';
let rank = '';
let departmentId = '';
let role = '';

export default{
  name: "UserSave",
  props: [
    "id"
  ],
  data(){
    return {a : {}}
  },
  methods: {
    goUserList() {
      this.$router.push("/userMng");
    },
    validateInput() {

    if (username.length < 2) {
      alert("아이디는 2글자 이상이어야 합니다.");
      return false;
    }
    if (userId.length < 2) {
      alert("이름은 2글자 이상이어야 합니다.");
      return false;
    }
    if (password !== passwordChk) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }

    return true;
    },
    saveBtn() {
      username = document.getElementById("username").value;
      userId = document.getElementById("userId").value;
      password = document.getElementById("password").value;
      passwordChk = document.getElementById("passwordChk").value;
      phoneNumber = document.getElementById("phoneNumber").value;
      position = document.getElementById("position").value;
      telNumber = document.getElementById("telNumber").value;
      fax = document.getElementById("fax").value;
      email = document.getElementById("email").value;
      work = document.getElementById("work").value;
      rank = document.getElementById("rank").value;
      role = "USER"
      departmentId = "1";

      //role, departmentId 확인필요

      if (!this.validateInput()) {
        return; 
      }

      axios.post(`http://localhost:8080/api/users`, {
        username: username,
        userId: userId,
        password: password,
        passwordCheck: passwordChk,
        phoneNumber: phoneNumber,
        position: position,
        telNumber: telNumber,
        email: email,
        fax: fax,
        work: work,
        rank: rank,
        departmentId: departmentId,
        role: role,

      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        this.$emit('close', false);
        window.location.href = '/userMng';
      }).catch(error => {
        console.error(error);
      });
    }
  },
}

</script>

<template>
  <transition name="modal" appear>
  <div class="modal-wrapper">
    <h1>■ 사용자 관리 등록</h1>
    <div>
      <table class="sub-table" >
          <tr>
            <td>아이디</td>
            <td><input type="text" id="username"></td>
            <td class="tableGray">이름</td>
            <td><input type="text" id="userId"></td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td><input type="password" id="password"></td>
            <td class="tableGray">비밀번호 확인</td>
            <td><input type="password" id="passwordChk"></td>
          </tr>
          <tr>
            <td>전화번호</td>
            <td><input type="text" id="telNumber"></td>
            <td class="tableGray">FAX</td>
            <td><input type="text" id="fax"></td>
          </tr>
          <tr>
            <td>휴대전화</td>
            <td><input type="text" id="phoneNumber"></td>
            <td class="tableGray">부서</td>
            <td><input type="text" id="departmentId"><button>조회</button></td>
          </tr>
          <tr>
            <td>이메일</td>
            <td><input type="text" id="email"></td>
            <td class="tableGray">재직구분</td>
            <td>
              <select id="work">
                <option value="true">재직</option>
                <option value="false">퇴직</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>직위</td>
            <td>
              <select id="position">
                <option value="직위">직위</option>
              </select>
            </td>
            <td class="tableGray">직급</td>
            <td>
              <select id="rank">
                <option value="직급">직급</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>권한</td>
            <td colspan="3">
              <input type="checkbox" id="role1" value="관리자"> 관리자
              <input type="checkbox" id="role2" value="국회의원"> 국회의원
              <input type="checkbox" id="role3" value="일반사용자"> 일반사용자
            </td>
          </tr>
        </table>
    </div>
    <div>
      <button @click="saveBtn">저장</button>
      <button class="close-button" @click="$emit('close', false)">닫기</button>
    </div>
  </div>
  </transition>
<userModalSave v-if="modalVisible" @close="closeModal()"/>
</template>
<style scoped>
.sub-table {
  width: 100%;
  flex: 1; /* To make it take remaining space */
  border-collapse: collapse;
  margin-bottom: 10px;
}

.sub-table td:first-child, .tableGray {
  background-color: lightgray;
}

.sub-table th,
.sub-table td {
  padding: 10px;
  border: 1px solid #ccc;
}

.sub-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

input:read-only{
  background-color: rgba(202, 196, 196, 0.67);
}

.modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

</style>