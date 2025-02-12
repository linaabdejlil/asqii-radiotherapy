import axiosParam from "./axiosParam";

export const getAllDiscussion = async () => {
  try {
    const response = await axiosParam.get(`/discussions/getAllDiscussion`);
    const responseData = response.data.message;
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const existingDiscussion = async (idOtherUser) => {
  try {
    const response = await axiosParam.get(
      `/discussions/existingDiscussion/${idOtherUser}`
    );
    const responseData = await response.data?.message;

    if (responseData) {
      return response.data?.discussion;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addDiscussion = async (payload) => {
  try {
    const response = await axiosParam.post(`/discussions/createDiscussion`, {
      idOthersUser: payload.idOthersUser,
      typeDiscussion: payload.type,
      name: payload.name,
    });
    const responseData = response.data?.message;
    return responseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
