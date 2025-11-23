import { Box, FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { inputSx } from "../utils/CommonStyle";
// import "./Form.css";

export default function FormSelect2({
  label,
  valueProp,
  options,
  defaultValue,
  filteringFullOption,
  setFilteredOption,
  filtering,
  readonly,
  labelProp,
  primeryKey,
  px = 0,
  mt = 0,
  setter,
}: any) {
  const [selectedOption, setSelectedOption] = useState({ ...defaultValue });

  const handleOption = (property: any, value: any) => {
    let optionCopy: any = { ...selectedOption };
    if (filtering) {
      optionCopy[property] = value;
      setSelectedOption({ ...optionCopy });
      if (filtering) {
        setFilteredOption([
          ...filteringFullOption.filter((o: any) => o.categoryId === value),
        ]);
      }
    } else {
      optionCopy[property] = value;
      setter(value);
      setSelectedOption({ ...optionCopy });
    }
  };

  return (
    <Box 
    // sx={{ px, width: "100%", mb: 2 }} 
    className="input-root" sx={{ ...inputSx, mb: 1 }}>
      <FormControl
        className="text_item"
        sx={{
          backgroundColor: "white",
          mt: mt,
          width: "100%",
        }}
        fullWidth
        variant="outlined"
        // error={Boolean(errors[valueProp])}
        // className={`text_item ${
        //   errors[valueProp] ? "mui-invalid" : "mui-valid"
        // }`}
      >
        <Select
          placeholder={label}
          value={selectedOption[valueProp] || ""}
          onChange={(e) => handleOption(valueProp, e.target.value)}
          inputProps={{
            readOnly: readonly,
            // ...register(valueProp),
          }}
        >
          {options.map((item: any, index: any) => {
            if (item.label) {
              return (
                <MenuItem value={item.value} key={index}>
                  {item.label}
                </MenuItem>
              );
            } else if (labelProp && item[labelProp]) {
              return (
                <MenuItem value={item[primeryKey]} key={index}>
                  {item[labelProp]}
                </MenuItem>
              );
            } else if (item.name) {
              return (
                <MenuItem value={item.id} key={index}>
                  {item.name}
                </MenuItem>
              );
            } else {
              return (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              );
            }
          })}
        </Select>
        {/* {errors[valueProp] && (
        <FormHelperText>{errors[valueProp].message}</FormHelperText>
      )} */}
      </FormControl>
    </Box>
  );
}
