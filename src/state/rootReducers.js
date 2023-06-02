import { combineReducers } from "redux";
import permissions from "../redux/permissions/reducer"
import sprints from "../redux/sprints/reducer"
import tabIndex from "../redux/tab-index/reducer"

const rootReducer = combineReducers({
    permissions,
    sprints,
    tabIndex
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    return rootReducer(state, action);
};