import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Apis from "../../shared/Apis";

const initialState = {
  account : [],
  idCheck:[],
  nickCheck:[],
  detail : {},
  feeds : [],
  isLoading : false,
  error : null,
  user: {
    location: "",
    gu: "",
    nickName: "",
    ageRange: "",
    gender: "",
    profileImage: "",
    email: "",
    site: "",
  },  
};

//네이버 로그인
export const __naverLogin = createAsyncThunk(
  "account/__naverLogin",
  async (payload, thunkAPI) => {
    
    try {
      const res = await Apis.naverloginAX(payload)
      const Access_Token = res.headers.access_token;
      localStorage.setItem("Access_Token", Access_Token);
      localStorage.setItem("user-userId", res.data.data.email);
      localStorage.setItem("user-nickname", res.data.data.nickname);
      localStorage.setItem("userImage", res.data.data.userImage);
      // // 토큰 받았고 로그인됐으니 메인으로 화면 전환시켜줌
      window.location.replace("/home")
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
);

// 카카오톡 로그인
export const __kakaoLogin = (code) => {
  return function (dispatch, getState) {
      axios.get(`https://wepungsan.kro.kr/auth/member/kakao/callback?code=${code}`)
          .then((res) => {
              if(res.data.status === 200){
              const Access_Token = res.headers.access_token;
              localStorage.setItem("Access_Token", Access_Token);
              localStorage.setItem("user-userId", res.data.data.email);
              localStorage.setItem("user-nickname", res.data.data.nickname);
              localStorage.setItem("userImage", res.data.data.userImage);
              window.location.replace("/home")
            }
          })
          .catch((error) => {
            window.alert("로그인에 실패하였습니다.");
          })
  }
};

// 회원가입
export const  __userSignUp = createAsyncThunk(
  "account/userSignUp",
  async (payload, thunkAPI) => {
    try {
      const res = await Apis.signupAX(payload)
      .then((response)=>{
      })
      return thunkAPI.fulfillWithValue(res)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

//이메일중복검사
export const __userCheck = createAsyncThunk(
  "idCheck/userCheck",
  // login : reducer name, 경로 정해줘야
  async (payload, thunkAPI) => {
    try {
      const res = await Apis.usernameAX(payload)
      alert(res.data.message)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

//닉네임 중복검사
export const __NickCheck = createAsyncThunk(
  "account/NickCheck",
  // login : reducer name, 경로 정해줘야
  async (payload, thunkAPI) => {
    try {
      const res = await Apis.nicknameAX(payload)
      alert(res.data.message)
      return thunkAPI.fulfillWithValue(res.data)
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  } 
);

//로그인
export const __userLogin = createAsyncThunk(
  "account/userLogin",
  // login : reducer name, 경로 정해줘야
  async (payload, thunkAPI) => {
    try {
      await Apis.loginAX(payload)
      .then((response)=>{
        if (response.data.status === 200) {
          localStorage.setItem("Access_Token", response.headers.access_token)
          localStorage.setItem("user-nickname", response.data.data.nickname)
          localStorage.setItem("user-userId", response.data.data.userId)
          window.location.replace('/home');
          alert(response.data.message)
        }else{
          alert(response.data.message)
        }
        return thunkAPI.fulfillWithValue(response.data)
      })
    } catch (error) {
      if (error.response.data.status === 500) {
        window.location.reload();
        alert("로그인 정보를 다시 확인해주세요")
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const LoginSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: {
    [__naverLogin.pending]: (state) => {
      state.isLoading = true
    },
    [__naverLogin.fulfilled]: (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.user = action.payload
    },
    [__naverLogin.rejected]: (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.error = action.payload
    },
    [__userSignUp.pending]: (state) => {
      state.isLoading = true; 
    },
    [__userSignUp.fulfilled]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.account=action.payload; 
    },
    [__userSignUp.rejected]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.error = action.payload; 
    },
    [__userCheck.pending]: (state) => {
      state.isLoading = true;
    },
    [__userCheck.fulfilled]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.idCheck=action.payload; 
    },
    [__userCheck.rejected]: (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.error = action.payload; 
    },
    [__userLogin.pending]: (state) => {
      state.isLoading = true; 
    },
    [__userLogin.fulfilled]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.account=action.payload; 
    },
    [__userLogin.rejected]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.error = action.payload; 
    },

    [__NickCheck.pending]: (state) => {
      state.isLoading = true; 
    },
    [__NickCheck.fulfilled]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.nickCheck=action.payload; 
    },
    [__NickCheck.rejected]: (state, action) => {
      state.isLoading = false; 
      state.isSuccess = false;
      state.error = action.payload;
    },
  }
})

export const { userLogin, userSignUp, userSignUpGet} = LoginSlice.actions;
export default LoginSlice.reducer;
