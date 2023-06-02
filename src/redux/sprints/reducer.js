import { sprintTypes } from "./actionTypes"

const reducer = (state = {}, action) => {
    switch (action.type) {
        case sprintTypes.GET_SPRINTS_LOADING:
            return {
                ...state,
                loadingSprints: true,
                sprints: ""
            }
        case sprintTypes.GET_SPRINTS_SUCCESS:
            return {
                ...state,
                loadingSprints: false,
                sprints: action.payload
            }
        case sprintTypes.GET_SPRINTS_FAILURE:
            return {
                ...state,
                loadingSprints: false,
                sprints: ""
            }
        case sprintTypes.ADD_SPRINT_ID:
            return {
                ...state,
                sprints: action.payload
            }
        case sprintTypes.RESET_SPRINT_ID:
            return {
                ...state,
                sprints: ""
            }
        default:
            return state
    }
}

export default reducer;