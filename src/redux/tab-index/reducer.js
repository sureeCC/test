const reducer = (state = 0, action) => {
    switch (action.type) {
        case "TAB-INDEX":
            return {
                ...state,
                tabIndex: action.payload
            }
        default:
            return state
    }
}

export default reducer;