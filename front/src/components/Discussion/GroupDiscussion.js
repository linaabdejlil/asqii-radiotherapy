import React, { useState, useEffect } from "react";
import axios from "axios";
import "./groupe.css";

import CustomAutocomplete from "./CustomAutocomplete";
import { TextField } from "@mui/material";
import Image from "./Image/Image";
import CustomInput from "./CustomInput";

const GroupDiscussion = ({ allUsers, handleCreateGroupDiscussion }) => {
  const [groupDiscussionMembers, setGroupDiscussionMembers] = useState([]);
  const [name, setName] = useState("");
  const [isValidName, setIsValidName] = useState(undefined);

  const handleUpdateGroup = async (newGroup) => {
    setGroupDiscussionMembers(newGroup);
  };

  const handleCreateGroup = async (event) => {
    event.stopPropagation();
    handleCreateGroupDiscussion(groupDiscussionMembers, name);
  };

  const handleNameChange = (event) => {
    if (event.target.value === "") {
      setIsValidName(false);
    } else {
      setIsValidName(true);
    }
    setName(event.target.value);
  };

  const annuler = async () => {
    window.location.reload();
  };
  return (
    <div className="boxGroupe">
      <div className="groupGroupe">
        <div className="overlapGroupe">
          <div className="nouveau-Groupe-wrapperGroupe">
            <div className="nouveau-Groupe">Nouveau groupe</div>
          </div>
          <div className="close">
            <button className="exit-button" onClick={annuler}>
              <span className="line"></span>
              <span className="line"></span>
            </button>
          </div>

          <div className="w-50 py-2 mt-20 ml-40">
            <label
              htmlFor="name"
              className="relative w-full font-medium nomGroupe"
            >
              Nom du groupe :
              <CustomInput
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="block w-full text-sm p-2 rounded bg-blue-100 placeholder-sky-950 mt-4"
                placeholder="exemple : Groupe des medecins"
                isValid={isValidName}
                required
              />
            </label>
          </div>
          <div className="w-50 py-2 mt-5 ml-40">
            <CustomAutocomplete
              id="size-small-filled-multi"
              options={allUsers}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                return `${option.nom} ${option.prenom}` || "";
              }}
              defaultValue={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="choose user"
                  placeholder="users "
                  className="bg-blue-100"
                />
              )}
              renderOption={(props, option) => (
                <li
                  {...props}
                  key={option.id}
                  className={`flex items-start cursor-pointer hover:bg-blue-200 my-1  ${
                    groupDiscussionMembers.some((item) => item.id === option.id)
                      ? "bg-blue-200"
                      : ""
                  }`}
                >
                  <Image
                    src={option.image}
                    title={`${option.nom} ${option.prenom}`}
                    alt={`${option.nom} ${option.prenom}`}
                    onErrorHandler={(e) =>
                      console.error("Image failed to load", e)
                    }
                    className="rounded-full h-8 w-8"
                  />
                  <p className="text-sm font-medium p-2">
                    {option.nom} {option.prenom}
                  </p>
                </li>
              )}
              multiple
              onChange={(event, value) => {
                event.stopPropagation();
                handleUpdateGroup(value);
              }}
            />
          </div>
          <div className="divGroupe">
            <button className="champ-textGroupe" onClick={handleCreateGroup}>
              <label className="text-wrapperGroupe">Valider</label>
            </button>
            <button className="div-wrapperGroupe" onClick={annuler}>
              <label className="text-wrapperGroupe">Annuler</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDiscussion;
