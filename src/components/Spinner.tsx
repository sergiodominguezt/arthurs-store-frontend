import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
      {message && (
        <Typography variant="h6" style={{ marginTop: "10px" }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Spinner;
