import React from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import color from "../utils/Colors";

interface PasswordFieldProps {
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  error: boolean;
  helperText: string | false | undefined;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  inputSx?: object;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  showPassword,
  togglePasswordVisibility,
  inputSx,
}) => {
  return (
    <TextField
      sx={inputSx}
      fullWidth
      id={id}
      name={name}
      placeholder={placeholder}
      type={showPassword ? "text" : "password"}
      margin="normal"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              sx={{ color: color.textColor2, marginRight: "5px" }}
              aria-label="toggle password visibility"
              onClick={togglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordField;
