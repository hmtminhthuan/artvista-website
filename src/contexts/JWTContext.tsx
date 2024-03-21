import { createContext, ReactNode, useEffect, useReducer } from "react";
// utils
import axiosInstances from "@/config/axios";
import { isValidToken, setSession } from "@/utils/jwt";
import { getUserInfo, setUserInfo } from "@/utils/utils";
import sweetAlert from "@/utils/sweetAlert";
// @types
import {
  ActionMap,
  AuthState,
  AuthUser,
  JWTContextType,
} from "@/types/authentication";
import { Role } from "@/enums/accountRole";
import { useRouter } from "next/navigation";
import useAppContext from "@/hooks/useAppContext";
import { PATH_ADMIN, PATH_AUTH } from "@/routes/paths";

// ----------------------------------------------------------------------

enum Types {
  Initial = "INITIALIZE",
  Login = "LOGIN",
  Logout = "LOGOUT",
  Register = "REGISTER",
  ChangeUser = "CHANGE_USER",
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
  [Types.ChangeUser]: {
    user: AuthUser;
  };
};

export type JWTActions =
  ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user,
      };
    case "LOGIN":
      setUserInfo(action.payload.user);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case "CHANGE_USER":
      setUserInfo(action.payload.user);
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(JWTReducer, initialState);
  const { enableLoading, disableLoading } = useAppContext();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        const userRaw = getUserInfo();
        if (accessToken && isValidToken(accessToken) && userRaw) {
          setSession(accessToken);

          const user = JSON.parse(userRaw);

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          if (accessToken && !isValidToken(accessToken)) {
            logout();
            sweetAlert.alertInfo(
              "Sesstion Timeout",
              "You need to sign in again...",
              5000,
              25
            );
          }

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      enableLoading();
      await axiosInstances.auth
        .post("/auth/login", {
          username,
          password,
        })
        .then((response) => {
          if (
            response.data.isSuccess &&
            response.data.result != null &&
            response.data.result.user != null
          ) {
            const { id, name, email, phoneNumber, role, address } =
              response.data.result.user;

            const user = {
              id: id,
              name: name,
              email: email,
              phoneNumber: phoneNumber,
              role: role,
              address: address,
            };

            const accessToken = response.data.result.token;

            setSession(accessToken);
            setUserInfo(user);

            dispatch({
              type: Types.Login,
              payload: {
                user,
              },
            });
            router.push("/");
            disableLoading();
          } else {
            disableLoading();
            sweetAlert.alertFailed(
              `Login failed.`,
              ` Please check your email and password and try again.`,
              1200,
              20
            );
          }
        })
        .catch((error) => {
          console.log(error);
          disableLoading();
          sweetAlert.alertFailed(
            `Login failed.`,
            ` Please check your email and password and try again.`,
            4000,
            22
          );
          router.push(PATH_AUTH.signin);
        })
        .finally(() => {
          if (getUserInfo()) {
            setTimeout(() => {
              sweetAlert.alertSuccess("Sign In Successfully", "", 1200, 20);
            }, 200);
          }
        });
    } catch (error) {
      console.log(error);
      disableLoading();
      sweetAlert.alertFailed(
        `Login failed.`,
        ` Please check your email and password and try again.`,
        4000,
        22
      );
      router.push(PATH_AUTH.signin);
    }
  };

  const loginWithEmail = async (email: string) => {
    try {
      enableLoading();
      await axiosInstances.auth
        .post("/auth/LoginGoogle", email)
        .then((response) => {
          if (
            response.data.isSuccess &&
            response.data.result != null &&
            response.data.result.user != null
          ) {
            console.log(response);

            const { id, name, email, phoneNumber, role } =
              response.data.result.user;

            const user = {
              id: id,
              name: name,
              email: email,
              phoneNumber: phoneNumber,
              role: role,
            };

            const accessToken = response.data.result.token;

            setSession(accessToken);
            setUserInfo(user);

            dispatch({
              type: Types.Login,
              payload: {
                user,
              },
            });
            router.push("/");
            disableLoading();
          } else {
            disableLoading();
            sweetAlert.alertFailed(
              `Login failed.`,
              `This email is not registered yet.`,
              1500,
              25
            );
          }
          console.log(response);
        })
        .catch((error) => {
          console.log("haha", error);
          disableLoading();
          sweetAlert.alertFailed(
            `Login failed.`,
            `This email is not registered yet.`,
            1500,
            25
          );
          // router.push(PATH_AUTH.signin);
        })
        .finally(() => {
          if (getUserInfo()) {
            setTimeout(() => {
              sweetAlert.alertSuccess("Sign In Successfully", "", 1200, 20);
            }, 200);
          }
        });
    } catch (error) {
      console.log(error);
      disableLoading();
      sweetAlert.alertFailed(
        `Login failed.`,
        ` Please check your email and password and try again.`,
        4000,
        22
      );
      router.push(PATH_AUTH.signin);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    role: string,
    address: string
  ) => {
    enableLoading();

    const trimmedPhone = phoneNumber.replace(/^0+/, "");
    const parsedPhone = "+84" + trimmedPhone;
    const response = await axiosInstances.auth.post("/auth/register", {
      email,
      password,
      name,
      phoneNumber: parsedPhone,
      role,
      address,
    });

    console.log({
      email,
      password,
      name,
      phoneNumber: parsedPhone,
      role,
      address,
    });

    if (response.data.isSuccess && response.data.result.succeeded) {
      localStorage.setItem(
        "REGISTER_CONFIRMING_USER",
        JSON.stringify({
          email,
          password,
        })
      );
      assignRole(email, password, name, parsedPhone, role, address);
      disableLoading();
      router.push(PATH_AUTH.signupInfo);
    }

    if (
      response.data.isSuccess &&
      !response.data.result.succeeded &&
      response.data.result.errors[0] != null
    ) {
      disableLoading();
      localStorage.setItem(
        "REGISTER_CONFIRMING_ERROR",
        response.data.result.errors[0].description
      );
    }
  };

  const assignRole = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string,
    role: string,
    address: string
  ) => {
    const response = await axiosInstances.auth.post("/auth/AssignRole", {
      email,
      password,
      name,
      phoneNumber,
      role,
      address,
    });
  };

  const logout = async () => {
    setSession(null);
    setUserInfo({});
    localStorage.removeItem("USER_INFO");
    dispatch({ type: Types.Logout });
    router.push("/");
  };

  const resetPassword = (email: string) => {};

  const updateProfile = () => {};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        loginWithEmail,
        logout,
        register,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
