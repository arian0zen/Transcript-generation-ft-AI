import React, { useState, useRef } from "react";
import axios from "axios";
import Card from "../UI/Card/Card";
import classes from "./QnaComponent.module.css";
import GoHomeButton from "../UI/Buttons/GoHome";
import typingRed from "../../assets/typing-red.gif";
import loadingGif from "../../assets/loading-crop.gif";
import { FaArrowRight } from "react-icons/fa";

const QnaComponent = (props) => {
  const [Error, setError] = useState(null);
  const [Loading, setLoading] = useState(null);
  const [Question, setQuestion] = useState(null);
  const [Answer, setAnswer] = useState(null);

  const questionRef = useRef("");
  const formTextAreaClass = Error ? classes["form-error"] : "";
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const question = questionRef.current.value;
      if (question.trim().length === 0) {
        setError("Please enter a valid question");
        return;
      }
      setQuestion(question);
      questionRef.current.value = "";

      setLoading(true);
      setAnswer(null);
      setError(null);
      const axiosConfig = {
        headers: {
          // origin: "https://transcript-generation-ft-ai-react.vercel.app",
          origin: "http://localhost:3000",
        },
      };
      // Set the origin header to your server's domain
      const response = await axios.post(
        // "https://transcript-generator-api.onrender.com/api/qna",
        "http://localhost:5000/api/qna",
        {
          query: question,
        },
        axiosConfig
      );
      setLoading(false);
      if (response.data.error) {
        setError(
          "Ohh hoo! Probably my OpenAI trial is over, hey! would you sponsor me ? 🙌"
        );
        return;
      } else {
        setAnswer(response.data.text);
        setError(null);
        return;
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
      setAnswer(null);
      setQuestion(null);
      return;
    }
  };
  const changeHandler = () => {
    if (questionRef.current.value.trim().length > 0) {
      setError(null);
      setLoading(null);
    }
    return;
  };

  return (
    <Card>
      <div className={classes["qna-component"]}>
        {Question && (
          <div className={classes["chat"]}>
            <div className={classes["chat-human"]}>{Question}</div>
            <div className={classes["chat-bot"]}>
              {Answer ? Answer : Loading ? <img src={typingRed} alt="" /> : ""}
            </div>
          </div>
        )}

        <form
          action=""
          className={classes["qna-form"]}
          onSubmit={submitHandler}
        >
          <textarea
            className={formTextAreaClass}
            ref={questionRef}
            type="text"
            name=""
            id=""
            placeholder="Enter your question here.."
            onChange={changeHandler}
          />
          <button type="submit" disabled={Loading}>
            <FaArrowRight />
          </button>
        </form>
        {Error && <p className={classes["error-message"]}>{Error}</p>}
        {Loading && (
          <div className={classes["loading-message"]}>
            <img
              className={classes["loading"]}
              src={loadingGif}
              alt="loading"
            />
            Loading... Please wait, this may take a while
          </div>
        )}
      </div>
      <div className={classes["go-back-btn"]}>
        <GoHomeButton onClick={props.onGoBack}></GoHomeButton>
      </div>
    </Card>
  );
};

export default QnaComponent;
