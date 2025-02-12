import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const CustomAutocomplete = ({
  id,
  options,
  defaultValue,
  renderInput,
  getOptionLabel,
  multiple,
  onChange,
  onBlur,
  onClick,
  className,
  renderOption,
}) => {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Autocomplete
        id={id}
        size="small"
        options={options}
        getOptionLabel={getOptionLabel}
        defaultValue={defaultValue}
        renderInput={renderInput}
        renderOption={renderOption}
        multiple={multiple}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        className={className}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip key={key} label={option.nom} {...tagProps} />;
          })
        }
      />
    </Stack>
  );
};

export default CustomAutocomplete;
