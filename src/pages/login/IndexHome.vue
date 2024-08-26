<script>
import axios from '@/axios';
import VueCookies from 'vue-cookies';

export default {
  data() {
    return {
      userId: '',
      pswd: '',
      token:''
    };
  },
  methods: {
    submitForm() {

      const formData = new FormData();

      formData.append("userId", this.userId);
      formData.append("pswd ", this.pswd);

      axios.post(`http://localhost:8080/api/authenticate`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        
        VueCookies.set('jwtToken', response.data.token, {path: '/', secure: true, httpOnly: true });
        console.log('토큰',response.data.token);
        
        this.$store.dispatch('updateUser',  { userId: response.data.loginInfo.accountId, token: response.data.token, loginInfo:response.data.loginInfo });
        console.log('응답',response.data.loginInfo);
        if(response.data.token!=null){
          this.$router.push(`/MainComp`);
        }

      }).catch(error => {
        
        if(error.response.data.msg == 'LOGIN_FAIL'){
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");

        }else if(error.response.data.msg == 'AUTH_FAIL'){
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      });

    }
  }
}



</script>

<template>
    <section id="login">
    <div class="login_layout">
        <div class="login_logo">
          <img src="@\img\logo.png" class="logo"/>
          <h2 style="align-items:center;">
            E-Bill System
          </h2>

        </div>
        <form @submit.prevent="submitForm">
            <div class="id_password">
                <div class="login_id">
                    <p>ID</p>
                    <input type="text" id="userId" v-model="userId" value="" placeholder="Enter your ID!">
                </div>
                <div class="login_pw">
                    <p>PW</p>
                    <input type="password"  id="pswd" v-model="pswd" value="" placeholder="Enter your password!">
                </div>
            </div>

            <div class="login_button">
              <button class="" tabindex=3 id="btn_login" type="submit">Login</button>
            </div>
        </form>
    </div>

    </section>
</template>

<style scoped>
#login {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 100px 0;
  justify-content: center;
  align-items: center;
  background: #F5F7FC;
}
#login .login_layout {
  padding: 4rem;
  width: 30rem;
  height: 30rem;
  flex-shrink: 0;
  border-radius: 10px;
  background: #FFF;
  box-shadow: 0px 4px 25px 0px rgba(31, 31, 43, 0.1);
}
#login .login_layout .login_logo {
  display: inline-flex;
  height: 6rem;
  align-items: center;
  gap: 2rem;
}
#login .login_layout .login_logo img {
  display: flex;
  width: 66px;
  height: 66px;
  justify-content: center;
  align-items: center;
}
#login .login_layout .login_logo h2 {
  color: #333D54;
  font-family: Noto Sans KR;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
#login .login_layout .id_password {
  display: flex;
  width: 22rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
}
#login .login_layout .id_password .login_id {
  display: flex;
  width: 22rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
#login .login_layout .id_password .login_id p {
  color: var(--grayscale-gray-70, #555);
  font-family: Noto Sans KR;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
#login .login_layout .id_password .login_id input {
  width: 22rem;
  height: 45px;
  flex-shrink: 0;
  border-radius: 2px;
  border: 1px solid var(--secondary-color-40, #B5BACB);
  font-family: Noto Sans KR;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 1rem;
}

#login .login_layout .id_password .login_pw {
  display: flex;
  width: 22rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
#login .login_layout .id_password .login_pw p {
  color: var(--grayscale-gray-70, #555);
  font-family: Noto Sans KR;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
#login .login_layout .id_password .login_pw input {
  width: 22rem;
  height: 45px;
  flex-shrink: 0;
  border-radius: 2px;
  border: 1px solid var(--secondary-color-40, #B5BACB);
  font-family: Noto Sans KR;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 1rem;
}

#login .login_layout .login_button {
  display: flex;
  width: 22rem;
  height: 45px;
  min-width: 70px;
  margin-top: 3rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
#login .login_layout .login_button button {
  border-radius: 2px;
  background: var(--point-primary, #1890FD);
  width: 22rem;
  height: 3rem;
  text-align: center;
  font-family: Noto Sans KR;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  color:#FFF;
}

</style>