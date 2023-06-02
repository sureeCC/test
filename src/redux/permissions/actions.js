import { permissionTypes } from "./actionTypes"
import store from "../../state/store"

export const addCapabilities = (permission) => {
    store.dispatch({
        type: permissionTypes.ADD_CAPABILITIES,
        payload: permission
    })
}

const loadingPermission = () => {
    store.dispatch({
        type: permissionTypes.GET_PERMISSION_LOADING
    })
}