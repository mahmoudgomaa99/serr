import React, { useState, useContext } from "react";
import img from "../assets/homeimg.jpg";
import "./styles/home.css";
import { Button } from "../shared/components/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from "../utils/validators";
import Input from "../shared/components/input";
import { AuthContext } from "../shared/context/auth-context";
import serrIcon from "../assets/serr.png";
import googleIcon from "../assets/google.png";
import facebokIcon from "../assets/facebook.png";
import { useForm } from "../hooks/form-hook";
import { useHttpCleint } from "../hooks/http-hook";
import ErrorModal from "../shared/components/ErrorModal";
import gifLoader from "../assets/gifLoader.gif";
import { GoogleLogin } from "react-google-login";

const Home = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isError, isLoading, error, errorHandler, sendRequset, setIsError } =
    useHttpCleint();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prev) => !prev);
  };
  const successResponseGoogle = async (response) => {
    console.log(response.tokenId);
    try {
      const data = await sendRequset(
        "https://serr-secret.herokuapp.com/api/user/googleSign",
        "POST",
        JSON.stringify({
          tokenId: response.tokenId,
        }),
        { "Content-Type": "application/json" }
      );
      console.log(data);
      auth.logIn(data.userId, data.token, data.name, data.email, data.img,data.username);
    } catch (error) {}
  };
  const failureResponseGoogle = (response) => {
    console.log(response);
  };

  const facebookIconClickHandler = (e) => {
    e.preventDefault();
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      try {
        const data = await sendRequset(
          "https://serr-secret.herokuapp.com/api/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.logIn(
          data.userId,
          data.token,
          data.name,
          data.email,
          data.img,
          data.username
        );
      } catch (error) {}
    } else {
      try {
        const data = await sendRequset(
          "https://serr-secret.herokuapp.com/api/user/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.logIn(
          data.userId,
          data.token,
          data.name,
          data.email,
          data.img,
          data.username
        );
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <>
      {isError && (
        <ErrorModal
          showModal={isError}
          setShowModal={setIsError}
          header={"something went wrong"}
          body={error}
          buttonText={"cancel"}
          oncancel={errorHandler}
        />
      )}
      <div className={`loader-container ${!isLoading && "fade-out"}`}>
        <img src={gifLoader} />
      </div>
      <section className="homeSection" id="home">
        <div className="image">
          <img src={img} alt="home_image" />
        </div>
        <div className="form-wrapper">
          <form className="log-form" onSubmit={onFormSubmit}>
            <img src={serrIcon} className="forrm-icon" />
            <h4>The website is under contruction</h4>
            {!isLoginMode ? (
              <Input
                element="input"
                id="name"
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
                placeholder="?????? ????????????????"
                errorText="?????? ???????????????? ???? ?????? ???? ???????? ??????????"
              />
            ) : null}
            <Input
              element="input"
              id="email"
              type="email"
              placeholder="???????????? ????????????????????"
              validators={[VALIDATOR_EMAIL()]}
              errorText="???? ???????????? ?????????????????????????? ????????"
              onInput={inputHandler}
            />
            <Input
              element="input"
              id="password"
              type="password"
              placeholder="???????? ????????????"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="???????? ???????????? ?????? ???? ?????????? ?????? ?????????? ?????? 6 ????????"
              onInput={inputHandler}
            />
            {/* {isLoading && <reactBootstrap.Spinner animation="grow" />} */}
            <Button type="submit" disabled={!formState.isValid}>
              {isLoginMode ? "????????" : "?????????? ????????"}
            </Button>
            {isLoginMode ? (
              <p className="switch">
                ?????? ?????? ???? ?????????? ?????????? ????{" "}
                <span onClick={switchModeHandler}>???????????? ???????? ????????</span>
              </p>
            ) : (
              <p className="switch">
                ?????? ?????? ?????????? ?????????? ????{" "}
                <span onClick={switchModeHandler}>???????????? ???????????? ????????</span>
              </p>
            )}
            <hr style={{ width: "100%" }} />
            <p className="orWith">
              {isLoginMode
                ? "???? ???? ?????????????? ????????????????"
                : "???? ???? ???????????? ???????? ????????????????"}
            </p>
            <br />
            <br />
            <div>
              <img
                src={facebokIcon}
                className="loginIcon"
                onClick={facebookIconClickHandler}
              />
              <GoogleLogin
                clientId="951458547942-k3hcfssnc6r7tue6ufvc4acptbojjtsi.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={successResponseGoogle}
                onFailure={failureResponseGoogle}
                cookiePolicy={"single_host_origin"}
                render={(renderProps) => (
                  <img
                    src={googleIcon}
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="loginIcon"
                  />
                )}
              />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;
