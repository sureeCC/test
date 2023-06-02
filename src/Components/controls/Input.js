import React from 'react';
import { TextField } from '@mui/material';

export default function Input(props) {
    const { name, label, defaultValue, error = null, type, placeholder, onChange, disabled } = props
    return (
        <TextField
            required
            fullWidth
            label={label}
            name={name}
            defaultValue={defaultValue}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            {...(error && { error: true, helperText: error })}
            disabled={disabled}
        />
    )
}