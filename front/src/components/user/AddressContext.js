import React, { createContext, useState, useContext } from "react";

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  const updateAddress = (newAddress) => {
    setAddress(newAddress);
  };

  return (
    <AddressContext.Provider value={{ address, updateAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
