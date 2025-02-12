import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  LocalizationProvider,
  StaticDateTimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";

// Extend dayjs with required plugins
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);
dayjs.locale("fr");

function NoteTime({ closeModal, onNoteTimeSelect }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleValidate = () => {
    // Format the date as 'YYYY-MM-DDTHH:mm' for `datetime-local`
    const formattedDate = selectedDate.format("YYYY-MM-DDTHH:mm");
    onNoteTimeSelect(formattedDate);
    closeModal();
  };

  return (
    <div className="boxAdresseUser">
      <div className="groupAdresseUser">
        <div className="nouveau-AdresseUser-wrapperAdresseUser">
          <div style={{ marginTop: 50 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                orientation="landscape"
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={(params) => <div {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="divAdresseUser">
            <button onClick={handleValidate} className="champ-textAdresseUser">
              <label className="text-wrapperAdresseUser">Valider</label>
            </button>
            <button onClick={closeModal} className="div-wrapperAdresseUser">
              <label className="text-wrapperAdresseUser">Annuler</label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteTime;
