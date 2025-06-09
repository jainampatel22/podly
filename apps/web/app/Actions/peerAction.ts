export const ADD_PEER = "ADD_PEER" as const;
export const REMOVE_PEER = "REMOVE_PEER" as const;
export const UPDATE_PEER_VIDEO_STATUS = 'UPDATE_PEER_VIDEO_STATUS';
export const UPDATE_PEER_USERNAME = "UPDATE_PEER_USERNAME";

export const addPeerAction = (peerId: string, stream: MediaStream) => ({
    type: ADD_PEER,
    payload: {peerId, stream}
});

export const removePeerAction = (peerId: string) => ({
    type: REMOVE_PEER,
    payload: {peerId}
});
export const updatePeerVideoStatusAction = (peerId: string, isVideoOff: boolean) => ({
  type: UPDATE_PEER_VIDEO_STATUS,
  payload: { peerId, isVideoOff }
});