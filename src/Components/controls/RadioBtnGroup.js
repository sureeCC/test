import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioButtonGroup(props) {
    const { name, label, value, onChange, items } = props;
    return (
        <FormControl>
            <FormLabel>label</FormLabel>
            <RadioGroup
                name={name}
                value={value}
                onChange={onChange}>

                {
                    items.map(
                        item => (
                            <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                        )
                    )
                }
            </RadioGroup>
        </FormControl>
    );
}
