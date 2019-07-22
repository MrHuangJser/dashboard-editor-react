import _ from "lodash";
import { IEventTypes } from "../types";
import { IState } from "./store";

const actions: { [K in keyof IEventTypes]: (state: IState, payload: IEventTypes[K]) => void } = {
  SET_CANVAS_SIZE: (state, payload) => {
    state.editorInstance.canvasSize = payload;
  },
  SET_CANVAS_TRANSFORM: (state, payload) => {
    state.editorInstance.canvasTransform = payload;
  },
  ADD_ITEM: (state, payload) => {
    state.editorInstance.items = [...state.editorInstance.items, payload];
  },
  ADD_ITEM_BORDER: (state, payload) => {
    if (Array.isArray(payload)) {
      payload.forEach(item => state.bordered.add(item));
    } else {
      state.bordered.add(payload);
    }
  },
  CLEAR_ITEM_BORDER: state => {
    state.bordered = new Set();
  },
  CLEAR_ITEM_SELECT: state => {
    state.bordered = new Set();
    state.selected = new Set();
  },
  DELETE_ITEM: (state, payload) => {
    state.editorInstance.items = _.pull(state.editorInstance.items, ...payload);
  },
  GROUP_ITEM: (state, payload) => {
    const groupId = `group_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    payload.forEach(item => {
      item.groupId = groupId;
    });
  },
  MOVE_ITEM: (state, payload) => {
    payload.items.forEach(item => {
      item.transform.x += payload.mx;
      item.transform.y += payload.my;
    });
  },
  RESIZE_ITEM: (state, payload) => {
    payload.forEach(({ item, size }) => {
      item.size = size;
    });
  },
  REMOVE_ITEM_BORDER: (state, payload) => {
    if (Array.isArray(payload)) {
      payload.forEach(item => state.bordered.delete(item));
    } else {
      state.bordered.delete(payload);
    }
  },
  ROTATE_ITEM: (state, payload) => {
    payload.item.transform.r = payload.r;
  },
  SELECT_GROUP: (state, payload) => {
    const items = state.editorInstance.items.filter(i => i.groupId === payload);
    state.selected = new Set(items);
  },
  SELECT_ITEM: (state, payload) => {
    state.selected.add(payload);
  },
  UN_GROUP_ITEM: (state, payload) => {
    state.editorInstance.items.forEach(item => {
      if (item.groupId && item.groupId === payload) {
        item.groupId = undefined;
      }
    });
  },
  UN_SELECT_ITEM: (state, payload) => {
    if (Array.isArray(payload)) {
      payload.forEach(item => {
        state.bordered.delete(item);
        state.selected.delete(item);
      });
    } else {
      state.bordered.delete(payload);
      state.selected.delete(payload);
    }
  }
};

export default actions;
