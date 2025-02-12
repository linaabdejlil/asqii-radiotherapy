import axiosParam from "./axiosParam";

export const getUser = async () => {
  try {
    const response = await axiosParam.get(`/users/getUser`);
    const responseData = await response.data?.message;
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUser = async (page, limit, nom) => {
  try {
    let url = `/users/getAllUser?page=${page}&limit=${limit}`;
    if (nom) {
      url += `&nom=${encodeURIComponent(nom)}`;
    }
    const response = await axiosParam.get(url);
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOtherUser = async (OtherUserId) => {
  try {
    const response = await axiosParam.get(`/users/getOtherUser/${OtherUserId}`);
    const responseData = await response.data?.message;
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
