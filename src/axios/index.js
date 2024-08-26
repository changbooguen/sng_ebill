import axios from 'axios';
import router from '@/router';
import store from "@/store";
import VueCookies from 'vue-cookies';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 기본 URL을 설정합니다.
});

// Request 인터셉터 설정
instance.interceptors.request.use(
  function (config) {
    const token =VueCookies.get('jwtToken'); 
    if (token && !config.url.includes('/api/save-route')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response && error.response.status === 401) {
        // 401 에러 발생 시 로그인 페이지로 리디렉션
        VueCookies.remove('jwtToken');
        store.dispatch('updateUser', { userId: null, token: null, loginInfo: null });
        router.push('/login'); // 'login'은 로그인 페이지의 이름입니다.
      }

      return Promise.reject(error);
    }
  );


export default instance;