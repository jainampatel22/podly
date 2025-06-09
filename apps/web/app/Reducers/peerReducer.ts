export const peerReducer = (state: any, action: any) => {
    switch (action.type) {
        case "ADD_PEER":
            return {
                ...state,
                [action.payload.peerId]: {
                    ...(state[action.payload.peerId] || {}),
                    stream: action.payload.stream
                }
            }
        case "UPDATE_PEER_USERNAME":
            return {
                ...state,
                [action.payload.peerId]: {
                    ...(state[action.payload.peerId] || {}),
                    username: action.payload.username,
                },
            }
        case "UPDATE_PEER_VIDEO_STATUS":
            return {
                ...state,
                [action.payload.peerId]: {
                    ...(state[action.payload.peerId] || {}),
                    isVideoOff: action.payload.isVideoOff
                }
            }
        case "REMOVE_PEER":
            const { [action.payload.peerId]: removed, ...rest } = state
            return rest
        default:
            return state
    }
}