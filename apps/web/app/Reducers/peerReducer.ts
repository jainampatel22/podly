import { ADD_PEER, REMOVE_PEER,UPDATE_PEER_USERNAME } from "../Actions/peerAction";

export type PeerState = Record<string, { stream: MediaStream; isVideoOff: boolean; username?:string }>;

type PeerAction =
  | {
      type: typeof ADD_PEER;
      payload: {
        peerId: string;
        stream: MediaStream;
      };
    }
  | {
      type: 'UPDATE_PEER_VIDEO_STATUS';
      payload: {
        peerId: string;
        isVideoOff: boolean;
      };
    }
    |{
type:'UPDATE_PEER_USERNAME'    
payload:{
  peerId:string,
  username:string
}  
    }
  | {
      type: typeof REMOVE_PEER;
      payload: { peerId: string };
    };

export const peerReducer = (state: PeerState, action: PeerAction): PeerState => {
  switch (action.type) {
    case ADD_PEER:
      return {
        ...state,
        [action.payload.peerId]: {
          stream: action.payload.stream,
          isVideoOff: false, // default to false
        },
      };

    case 'UPDATE_PEER_VIDEO_STATUS': {
  const existingPeer = state[action.payload.peerId];
  if (!existingPeer) return state; // don't update if peer not found

  return {
    ...state,
    [action.payload.peerId]: {
      stream: existingPeer.stream, // retain existing stream
      isVideoOff: action.payload.isVideoOff,
    },
  };
}
 case UPDATE_PEER_USERNAME: {
  const existingPeer = state[action.payload.peerId];
  if (!existingPeer) {
    // Peer doesn't exist, can't update username alone, just return state
    return state;
  }
  return {
    ...state,
    [action.payload.peerId]: {
      ...existingPeer, // keep stream and isVideoOff intact
      username: action.payload.username, // add or update username
    },
  };
}



    case REMOVE_PEER:
      const newState = { ...state };
      delete newState[action.payload.peerId];
      return newState;

    default:
      return state;
  }
};
