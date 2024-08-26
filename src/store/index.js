import { createStore } from 'vuex';
import VueCookies from 'vue-cookies';
import createPersistedState from 'vuex-persistedstate';
import axios from "@/axios";
import {checkTokenValidity} from "@/router";

export default createStore({
  state: {
    token: null,
    user: {
      id: '' // 예시로 설정한 로그인 아이디
    },
    isLogin:false,
    loginInfo: null,
    snackbarQueue: [],
    snackbar: {
      visible: false,
      message: '',
      timeout:2000
    },
    progressbar: {
      loading: false
    },
    codeList: [],
    inputCodeList: []
  },
  mutations: {
    setUser(state, payload) {
      state.user.id = payload.userId;
      state.token = payload.token;
      state.loginInfo = payload.loginInfo;
    },
    clearAuth(state) {
      state.token = null;
      state.user.id = '';
      state.isLogin = false;
      state.loginInfo = null;
    },
    setLoginStatus(state, status) {
      state.isLogin = status;
    },
    enqueueSnackbar(state, { message ,visible, timeout }) {
      state.snackbarQueue = [];
      state.snackbarQueue.push({ message,visible,timeout});
      if (!state.snackbar.visible) {
        this.commit('displayNextSnackbar');
      }
    },
    displayNextSnackbar(state) {
      if (state.snackbarQueue.length > 0) {
        const nextSnackbar = state.snackbarQueue.shift();
        state.snackbar.message = nextSnackbar.message;
        state.snackbar.visible = nextSnackbar.visible;
        state.snackbar.timeout = nextSnackbar.timeout;
      }
    },
    hideSnackbar(state) {
      state.snackbar.visible = false;
      setTimeout(() => {
        this.commit('displayNextSnackbar');
      }, 500);
    },
    setProgressbar(state, payload) {
      state.progressbar.loading = payload;
    },
    setCodeList(state, _codeList) {
      state.codeList = _codeList;
    },
    setInputCodeList(state, _codeList) {
      state.inputCodeList = _codeList;
    },
  },
  actions: {
    updateUser({ commit }, payload) {
      commit('setUser', payload);
      commit('setLoginStatus', checkTokenValidity());
    },
    logout({ commit }) {
      commit('clearAuth');
      VueCookies.remove('jwtToken'); // 쿠키에서 토큰 제거
    },
    API_LIST({ commit },_API_PARAMS) {

      let tmpParams = {};
      tmpParams['params'] = _API_PARAMS;

      return axios.get(_API_PARAMS.API_PATH,tmpParams)
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;

          if(success){
            return {
              "resultList": data.data
            }
          } else {
            console.error(data);
          }

      }).catch(error => {
        console.error(error);

      });
    },
    API_SAVE({ commit },_API_PARAMS) {

      commit('setProgressbar',true);

      return axios.post(_API_PARAMS.API_PATH, _API_PARAMS.JSON_DATA
        ,{headers: {'Content-Type': 'application/json'}})
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;

          if(success){

            const msgvar = '정상적으로 저장되었습니다.';
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});
            commit('setProgressbar',false);

            return {
              "resultObj": data.data
            }
          } else {
            commit('setProgressbar',false);
            console.error(data);
          }
          
        }).catch(error => {
          commit('setProgressbar',false);
          console.log(error);
        });

    },
    API_UPDATE({ commit },_API_PARAMS) {

      return axios.put(_API_PARAMS.API_PATH, _API_PARAMS.JSON_DATA
        ,{headers: {'Content-Type': 'application/json'}})
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          if(success){
            const msgvar = '정상적으로 수정되었습니다.';
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

            return {
              "resultObj": data.data
            }
          } else {
            console.error(data);
          }

        }).catch(error => {
          console.log(error);
        });

    },
    API_DELETE({ commit },_API_PARAMS) {

      let tmpParams = {};
      tmpParams['data'] = _API_PARAMS.deleteItems;

      return axios.delete(_API_PARAMS.API_PATH,tmpParams)
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          if(success){
            const msgvar = '정상적으로 삭제되었습니다.';
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

            return {
              "resultList": data.data.data
            }
          } else {
            console.error(data);
          }

        }).catch(error => {
          console.log(error);
        });
    },
    API_DELETE_DATA({ commit },_API_PARAMS) {

      let tmpParams = {};
      tmpParams['data'] = _API_PARAMS.JSON_DATA;

      return axios.delete(_API_PARAMS.API_PATH,tmpParams)
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          if(success){
            const msgvar = '정상적으로 삭제되었습니다.';
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

            return {
              "resultList": data.data.data
            }
          } else {
            console.error(data);
          }

        }).catch(error => {
          console.log(error);
        });
    },
    API_BILL_FILE_SAVE({ commit },_API_PARAMS) {

      commit('setProgressbar',true);
      let returnMsg = {};
      const msgvar = "파일을 업로드중입니다.";
      commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

      return axios.post(_API_PARAMS.API_PATH, _API_PARAMS.FORM_DATA
        ,{headers: {'Content-Type': 'multipart/form-data'}})
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          commit('setProgressbar',false);

          if(success) {
            returnMsg.code = 200;
            returnMsg.billId = data.data.data.billId;
            returnMsg.procId = data.data.data.procId;
            return {
              "data": returnMsg
            }
          } else {
            returnMsg.code = 500;
            returnMsg.billId = '';
            returnMsg.procId = '';
            return {
              "data": returnMsg
            }
          }

        }).catch(error => {
          commit('setProgressbar',false);
          console.log(error.message);
          returnMsg.code = 500;
          returnMsg.billId = '';
          returnMsg.procId = '';
          return {
            "data": returnMsg
          }
        });

    },
    API_FILE_DOWN({ commit },_API_PARAMS) {

      commit('setProgressbar',true);

      let msgvar = "파일을 다운로드중입니다.";
      commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

      return axios.get(_API_PARAMS.API_PATH,{responseType: 'blob'})
        .then(response => {
          
          const blob = new Blob([response.data], {type: response.headers['content-type']});
          const objectURL = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = objectURL;
          link.setAttribute("download",_API_PARAMS.orgFileNm);
          document.body.appendChild(link);
          link.click();
          commit('setProgressbar',false);
      }).catch(error => {
        console.log(error);
        commit('setProgressbar',false);
        commit('enqueueSnackbar', { message: error,visible:true,timeout:2000});
      });
  
    },
    API_FILE_DELETE({ commit },_API_PARAMS) {

      let msgvar = '파일삭제가 정상적으로 처리되었습니다.';

      return axios.delete(_API_PARAMS.API_PATH)
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          if(success) {
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});
            return {
              "resultObj": data.data
            }
          } else {
            msgvar = 'Error Msg:'+data;
            commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});
          }

      }).catch(error => {
        console.log(error);
        msgvar = 'Error Msg:'+error;
        commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});
      });
  
    },
    async API_CODE_LIST({ commit },_API_PARAMS) {

      return axios.get('/api/comCode/all',{})
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;

          if(success){

            const codes = [{codeId: '', codeNm: ':::전체:::',grpCode:'',ord:'',rmk:'',useYn:'Y' }, ...data.data];
            const inputCodes = [{codeId: '', codeNm: '선택하기',grpCode:'',ord:'',rmk:'',useYn:'Y' }, ...data.data];

            commit('setCodeList',codes);
            commit('setInputCodeList',inputCodes);

          } else {
            commit('setCodeList', []);
            commit('setInputCodeList',[]);
            console.error(data);
          }

      }).catch(error => {
        commit('setCodeList', []);
        commit('setInputCodeList',[]);
        console.error(error);
      });
    },
    API_FILE_SAVE({ commit },_API_PARAMS) {

      commit('setProgressbar',true);
      let returnMsg = {};
      const msgvar = "파일을 업로드중입니다.";
      commit('enqueueSnackbar', { message: msgvar,visible:true,timeout:2000});

      return axios.post(_API_PARAMS.API_PATH, _API_PARAMS.FORM_DATA
        ,{headers: {'Content-Type': 'multipart/form-data'}})
        .then(data => {

          const success = parseInt(data.status / 100) == 2 ||  parseInt(data.status / 100) == 3 ? true:false;
          commit('setProgressbar',false);

          if(success) {
            returnMsg.code = 200;
            returnMsg.fileGroupId = data.data.data.fileGroupId;
            return {
              "data": returnMsg
            }
          } else {
            returnMsg.code = 500;
            returnMsg.fileGroupId = '';
            return {
              "data": returnMsg
            }
          }

        }).catch(error => {
          commit('setProgressbar',false);
          console.log(error.message);
          returnMsg.code = 500;
          returnMsg.fileGroupId = '';
          return {
            "data": returnMsg
          }
        });

    },

  },
  getters: {
    isLoggedIn: state => state.isLogin,
    userId: state => state.user.id,
    token: state => state.token,
    loginInfo: state => state.loginInfo,
    codeList: state => state.codeList,
    inputCodeList: state => state.inputCodeList
  },
  plugins: [
    createPersistedState()
  ]
});