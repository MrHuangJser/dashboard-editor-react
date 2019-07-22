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
    state.selected = new Set([...state.selected]);
  },
  GROUP_ITEM: (state, payload) => {
    const groupId = `group_${Date.now()}_${Math.round(Math.random() * 100000)}`;
    payload.forEach(item => {
      item.groupId = groupId;
    });
    state.selected = new Set([...state.selected]);
  },
  MOVE_ITEM: (state, payload) => {
    payload.forEach(({ x, y }, item) => {
      item.transform.x = Math.round(x);
      item.transform.y = Math.round(y);
    });
    state.selected = new Set([...state.selected]);
  },
  RESIZE_ITEM: (state, payload) => {
    payload.forEach(({ width, height }, item) => {
      item.size = { width: Math.round(width), height: Math.round(height) };
    });
    state.selected = new Set([...state.selected]);
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
    state.selected = new Set([...state.selected]);
  },
  SELECT_GROUP: (state, payload) => {
    const items = state.editorInstance.items.filter(i => i.groupId === payload);
    state.bordered = new Set(items);
    state.selected = new Set(items);
  },
  SELECT_ITEM: (state, payload) => {
    state.bordered.add(payload);
    state.selected.add(payload);
    state.bordered = new Set([...state.bordered]);
    state.selected = new Set([...state.selected]);
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
    state.bordered = new Set([...state.bordered]);
    state.selected = new Set([...state.selected]);
  },
  SET_ITEM_DATA: (state, payload) => {
    state.editorInstance.items = state.editorInstance.items.map(item => {
      if (item.id === payload.id) {
        item.props = payload.data;
      }
      return item;
    });
  }
};

export default actions;
