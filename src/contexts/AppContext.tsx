import { ReactNode, createContext, useEffect, useReducer } from "react";

type AppContextState = {
  isLoading: boolean;
  chattingOfCustomer: boolean;
  chattingOfCustomerId: string;
};

const initialState = {
  isLoading: false,
  chattingOfCustomer: false,
  chattingOfCustomerId: "",
  chattingOfCustomerArtworkId: "",
};

enum Types {
  INITIALIZE = "INITIALIZE",
  EnableLoading = "EnableLoading",
  DisableLoading = "DisableLoading",
  EnableChattingOfCustomer = "EnableChattingOfCustomer",
  DisableChattingOfCustomer = "DisableChattingOfCustomer",
}

const reducer = (state: AppContextState, action: any) => {
  switch (action.type) {
    case Types.INITIALIZE:
      return {
        ...state,
        initialState,
      };
    case Types.EnableLoading:
      return {
        ...state,
        isLoading: true,
      };
    case Types.DisableLoading:
      return {
        ...state,
        isLoading: false,
      };
    case Types.EnableChattingOfCustomer:
      return {
        ...state,
        chattingOfCustomer: true,
        chattingOfCustomerId: action.payload.chattingOfCustomerId,
        chattingOfCustomerArtworkId: action.payload.chattingOfCustomerArtworkId,
      };
    case Types.DisableChattingOfCustomer:
      return {
        ...state,
        chattingOfCustomer: false,
        chattingOfCustomerId: "",
        chattingOfCustomerArtworkId: "",
      };
    default:
      return state;
  }
};

const AppContext = createContext<any | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        dispatch({
          type: Types.INITIALIZE,
        });
      } catch {}
    };

    initialize();
  }, []);

  const enableLoading = () => {
    dispatch({
      type: Types.EnableLoading,
    });
  };

  const disableLoading = () => {
    dispatch({
      type: Types.DisableLoading,
    });
  };

  const enableChattingOfCustomer = (
    chattingOfCustomerId: string,
    chattingOfCustomerArtworkId: string
  ) => {
    dispatch({
      type: Types.EnableChattingOfCustomer,
      payload: {
        chattingOfCustomerId: chattingOfCustomerId,
        chattingOfCustomerArtworkId: chattingOfCustomerArtworkId,
      },
    });
  };

  const disableChattingOfCustomer = () => {
    dispatch({
      type: Types.DisableChattingOfCustomer,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        method: "AppContext",
        enableLoading,
        disableLoading,
        enableChattingOfCustomer,
        disableChattingOfCustomer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
