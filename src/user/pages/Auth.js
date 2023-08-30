import React, { useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/Validators";
import { useForm } from "../../shared/hooks/Form-hook";
import { AuthContext } from "../../shared/Context-auth/auth-context";
import ImageUpload from '../../shared/components/FormElements/ImageUpload';


import './Auth.css';

const Authorize = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setisLoginMode] = useState(true);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);


    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },
                formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        }
        else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setisLoginMode(prevMode => !prevMode);
    }

    const authSubmitHandler = async (e) => {
        e.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+'/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId , responseData.token);
            }
            catch (err) {

            }
        }
        else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL+'/users/signup',
                    'POST',
                    formData
                );

                auth.login(responseData.userId, responseData.token);
            }
            catch (err) {

            }
        }
    }


    return <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>{isLoginMode ? 'Login' : 'SignUp'} Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && <Input
                    element="input"
                    id="name"
                    type="text"
                    label="Name"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter your name"
                    onInput={inputHandler}
                />}

                {!isLoginMode && <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide a profile picture." />}
                <Input
                    id="email"
                    type="email"
                    element="input"
                    label="Email"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email."
                    onInput={inputHandler}
                />
                <Input
                    id="password"
                    type="password"
                    element="input"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(8)]}
                    errorText="Please enter a valid password (at least 8 characters)."
                    onInput={inputHandler}
                />
                <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'SignUp'}</Button>
            </form>
            <Button inverse onClick={switchModeHandler}>{isLoginMode ? 'SignUp' : 'Login'} instead</Button>

        </Card>;
    </React.Fragment>
}

export default Authorize;



