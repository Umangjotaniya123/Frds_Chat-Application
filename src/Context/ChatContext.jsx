import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";


export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    // console.log(currentUser);

    const INITIAL_STATE = {
        chatId: 'null',
        user: {},
    };

    const chatReducer = (state, action) => {
    
        // console.log(action);

        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser?.displayName > action.payload?.displayName
                        ? currentUser?.displayName + action.payload?.displayName
                        : action.payload?.displayName + currentUser?.displayName,
                };

            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
}