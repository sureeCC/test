import store from "../../state/store"

export const addProjectPortalTabIndex = (index) => {
    store.dispatch({
        type: "TAB-INDEX",
        payload: index
    })
}