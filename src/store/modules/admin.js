import { login, logout, getInfo } from "@/api/admin";
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken
} from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    refresh_token: getRefreshToken(),
    name: "",
    avatar: "",
    roles: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refresh_token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  }
};

const actions = {
  // admin login

  // 这里的 {commit} 是es6 中的解构赋值,
  // 相当于 context.commit
  login({ commit }, userInfo) {
    // 解构赋值
    const { username, password } = userInfo;

    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      })
        .then(response => {
          const { data } = response;

          commit("SET_TOKEN", data.token.access_token);
          commit("SET_REFRESH_TOKEN", data.token.refresh_token);

          setToken(data.token.access_token);
          setRefreshToken(data.token.refresh_token);

          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // get admin info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response;

          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const {
            roles,
            username,
            avatar
          } = data;

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject("getInfo: roles must be a non-null array!");
          }

          commit("SET_ROLES", roles);
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          removeRefreshToken();

          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      removeRefreshToken();
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
