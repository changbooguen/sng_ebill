import { createRouter, createWebHistory } from 'vue-router';
import axios from '@/axios';
import store from '@/store';
import VueCookies from 'vue-cookies';
import {jwtDecode} from 'jwt-decode';

import LoginCompNew from "@/views/LoginComp.vue"
import LoginComp from "@/pages/login/IndexHome.vue"

import FrameComp from "@/views/FrameComp.vue"

import NewPopup from "@/components/DetailComponents/NewPopup.vue"

const routes = [
  {
    path: '/',
    component: LoginCompNew,
  },
  {
    path: '/MainComp',
    component: FrameComp,
    children: [
      {
        path: "",
        name: "MainComp",
        components: {
          mainContentViews: () => import('@/views/content/MainComp.vue'),
        },
        children: [
          {
            path: "",
            name: "TypeFirst",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeFirst.vue'),
            }
          },
          {
            path: "2",
            name: "TypeSecond",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeSecond.vue'),
            }
          },
          {
            path: "3",
            name: "TypeThird",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeThird.vue'),
            }
          },
          {
            path: "4",
            name: "TypeFourth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeFourth.vue'),
            }
          },
          {
            path: "5",
            name: "TypeFifth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeFifth.vue'),
            }
          },
          {
            path: "6",
            name: "TypeSixth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeSixth.vue'),
            }
          },
          {
            path: "7",
            name: "TypeSeventh",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeSeventh.vue'),
            }
          },
          {
            path: "8",
            name: "TypeEighth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeEighth.vue'),
            }
          },
          {
            path: "9",
            name: "TypeNinth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeNinth.vue'),
            }
          },
          {
            path: "10",
            name: "TypeTenth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeTenth.vue'),
            }
          },
          {
            path: "11",
            name: "TypeEleventh",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeEleventh.vue'),
            }
          },
          {
            path: "12",
            name: "TypeTwelfth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeTwelfth.vue'),
            }
          },
          {
            path: "13",
            name: "TypeThirteenth",
            components: {
              mainContentType: () => import('@/views/content/contentsComponent/TypeThirteenth.vue'),
            }
          },
          { path: "sampleGridList", name: "sampleGridList",components: { mainContentType: () => import('@/views/content/sample/SampleGridList.vue')}},


        ],
      },
    ],
  },
  {
    path: "/NewPopup",
    name: "NewPopup",
    component: NewPopup,
  },
];




const router = createRouter({
  history: createWebHistory(),
  routes,
});




export function checkTokenValidity () {
  // 쿠키에서 토큰 가져오기
  const token = VueCookies.get('jwtToken');
  if (!token) {
      console.log('토큰이 존재하지 않습니다.');
      return false;
  }

  // JWT 디코딩하여 payload 추출
  const decodedToken = jwtDecode(token);
  console.log('Decoded Token:', decodedToken);

  // 토큰의 만료 시간 가져오기 (만료 시간은 'exp' 필드에 있음)
  const tokenExpiration = decodedToken.exp;
  const currentTimestamp = Math.floor(Date.now()/1000); // 현재 시간 (초 단위 타임스탬프)
  console.log('currentTimestamp:', currentTimestamp);
  // 만료 시간 비교
  if (currentTimestamp > tokenExpiration) {
      console.log('토큰이 만료되었습니다.');
      // 만료된 토큰 처리: 로그아웃 등의 동작 수행
      VueCookies.remove('jwtToken');
      store.dispatch('updateUser', { userId: null, token: null, loginInfo:null });
      alert('로그인 정보가 만료 되었습니다. 다시 로그인 해주십시오.');
      return false;
  } else {
      console.log('토큰이 유효합니다.');
      return true;
  }
}

router.beforeEach((to, from, next) => {

  axios.post('/api/save-route', {
    params:{
      path: to.path,
    }
  })
  .then(response => {
      console.log('Route saved:', response.data);
  })
  .catch(error => {
      console.error('Error saving route:', error);
  });


    // 모든 경로에 대해 토큰 유효성 검사 수행
  const isTokenValid = checkTokenValidity();

  if (to.path === '/') {
    // 로그인 페이지로 이동하려는 경우
    next();
  } else {

    // 로그인 상태가 아니면 로그인 페이지로 리디렉션
    if (!isTokenValid) {

      next('/');
    } else {
      next();
    }

  }

});





export default router;