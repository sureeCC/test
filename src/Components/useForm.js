import React, { useState } from 'react'

export function useForm(initialFValues, validateOnChange = false, validate) {


    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        setName(
            name
        )
        if (validateOnChange)
            validate({ [name]: value })
    }

    const resetForm = () => {
        setValues(initialFValues);
        setErrors({})
    }


    return {
        values,
        setValues,
        name,
        setName,
        errors,
        setErrors,
        handleInputChange,
        resetForm

    }
}


// const useStyles = makeStyles(theme => ({
//     root: {
//         '& .MuiFormControl-root': {
//             width: '80%',
//             margin: theme.spacing(1)
//         }
//     }
// }))

export function Form(props) {

    //const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form  autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}