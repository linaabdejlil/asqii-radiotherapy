import axiosParam from "./axiosParam";

export const sendMessage = async (messageProps) => {
  try {
    console.log("message api", messageProps);
    const response = await axiosParam.post(
      `/messages/sendMessage/${messageProps.message_idDiscussion}`,
      {
        content: messageProps.message_content,
      }
    );
    const responseData = response.data?.message;

    return responseData;
  } catch (error) {
    console.log("error :", error);
    return undefined;
  }
};

export const getAllMessage = async (message_idDiscussion) => {
  try {
    const response = await axiosParam.get(
      `/messages/getAllMessage/${message_idDiscussion}`
    );
    const responseData = response.data.message;

    return responseData;
  } catch (error) {
    return undefined;
  }
};

export const getMessageById = async (idMessage) => {
  try {
    const response = await axiosParam.get(`/messages/${idMessage}`);
    const responseData = response.data?.message;
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
