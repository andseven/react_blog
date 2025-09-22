import {
    SET_NAME, SET_AVATAR, SET_EMAIL
} from './constants';

export const setName = (name: string) => ({
    type: SET_NAME,
    payload: name,
});

export const setAvatar = (avatar: string) => ({
    type: SET_AVATAR,
    payload: avatar,
});

export const setEmail = (email: string) => ({
    type: SET_EMAIL,
    payload: email,
});