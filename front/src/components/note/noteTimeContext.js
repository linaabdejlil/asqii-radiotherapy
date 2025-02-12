import React, { createContext, useState, useContext } from "react";

const NoteTimeContext = createContext();

export const useNoteTime = () => useContext(NoteTimeContext);

export const NoteTimeProvider = ({ children }) => {
  const [newNoteTime, setNewNoteTime] = useState("");

  const updateNoteTime = (newNoteTime) => {
    setNewNoteTime(newNoteTime);
  };

  return (
    <NoteTimeContext.Provider value={{ newNoteTime, updateNoteTime }}>
      {children}
    </NoteTimeContext.Provider>
  );
};
