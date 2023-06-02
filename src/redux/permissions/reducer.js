import { permissionTypes } from "./actionTypes";

const reducer = (state = {}, action) => {
    switch (action.type) {
        case permissionTypes.GET_PERMISSION_LOADING:
            return {
                ...state,
                loadingPermissions: true,
                permissions: []
            }
        case permissionTypes.GET_PERMISSION_SUCCESS:
            return {
                ...state,
                loadingPermissions: false,
                permissions: action.payload
            }
        case permissionTypes.GET_PERMISSION_FAILURE:
            return {
                ...state,
                loadingPermissions: false,
                permissions: []
            }
        default:
            return state
    }
}

export default reducer;