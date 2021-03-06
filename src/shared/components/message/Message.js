import React, { useState, useContext } from "react";
import {
  SingleMessageWrapper,
  MessageBody,
  IconsWrapper,
  SingleIconWrapper,
  Icon,
  IconTag,
  FooterWrapper,
  Date,
  CommentWrapper,
  Button,
  CommentAndMessageWrapper,
  CommentBody,
  CommentInputWrapper,
  Input,
  CommentButton,
  DeleteWrapper,
  DeleteText,
} from "./messageElments";
import deleteIcon from "../../../assets/delete.png";
import coloredDeleteIcon from "../../../assets/delete-colored.png";
import favouriteIcon from "../../../assets/heart.png";
import redFavouriteIcon from "../../../assets/heart-red.png";
import commentIcon from "../../../assets/reply.png";
import coloredCommentIcon from "../../../assets/reply-colored.png";
import shareIcon from "../../../assets/share.png";
import { useHttpCleint } from "../../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import loader from "../../../assets/singleGifLoader.gif";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Message = ({
  id,
  isFavourite,
  isPublic,
  messageBody,
  date,
  comment,
  mode,
}) => {
  const auth = useContext(AuthContext);
  const [isPublicState, setISPublic] = useState({ isPublic, loadState: false });
  const [isFavouriteState, setIsFavourite] = useState({
    isFavourite,
    loadState: false,
  });
  const [toInputComment, setToInputComment] = useState({
    toInput: false,
    comment: comment,
    commentState: comment,
    loaderState: false,
  });
  const [toDelete, setToDelete] = useState({
    toDeleteState: false,
    loadState: false,
  });
  const modeIsTotal = mode === "total";
  const { isError, error, errorHandler, sendRequset, setIsError } =
    useHttpCleint();

  const onFavouriteIconClick = (e) => {
    e.preventDefault();
    setIsFavourite((prev) => ({ ...prev, loadState: true }));
    sendRequset(
      "https://serr-secret.herokuapp.com/api/message/setIsFavourite",
      "PATCH",
      JSON.stringify({
        messageId: id,
      }),
      {
        "Content-Type": "application/json",
        Authorization:
          "Bear " + auth.token || window.localStorage.getItem("token"),
      }
    ).then(() => {
      setIsFavourite((prev) => ({
        ...prev,
        isFavourite: !prev.isFavourite,
        loadState: false,
      }));
    });
  };

  const onPublicButtonClick = (e) => {
    e.preventDefault();
    setISPublic((prev) => ({ ...prev, loadState: true }));
    sendRequset(
      "https://serr-secret.herokuapp.com/api/message/setIsPublic",
      "PATCH",
      JSON.stringify({
        messageId: id,
      }),
      {
        "Content-Type": "application/json",
        Authorization:
          "Bear " + auth.token || window.localStorage.getItem("token"),
      }
    ).then(() => {
      setISPublic((prev) => ({
        ...prev,
        loadState: false,
        isPublic: !prev.isPublic,
      }));
      window.location.reload();
    });
  };

  const sendCommentButtonHandler = (e) => {
    e.preventDefault();
    setToInputComment((prev) => ({ ...prev, loaderState: true }));
    sendRequset(
      "https://serr-secret.herokuapp.com/api/message/setComment",
      "PATCH",
      JSON.stringify({
        messageId: id,
        commentBody: toInputComment.comment,
      }),
      {
        "Content-Type": "application/json",
        Authorization:
          "Bear " + auth.token || window.localStorage.getItem("token"),
      }
    )
      .then((response) => {
        setToInputComment((prev) => ({
          ...prev,
          toInput: false,
          commentState: prev.comment,
          loaderState: false,
        }));
      })
      .catch((err) => {});
  };

  const deleteIconClickHandler = (e) => {
    e.preventDefault();
    setToInputComment((prev) => ({ ...prev, toInput: false }));
    setToDelete((prev) => ({ ...prev, toDeleteState: !prev.toDeleteState }));
  };

  const replyIconClickHandler = (e) => {
    e.preventDefault();
    setToDelete(false);
    setToInputComment((prev) => ({ ...prev, toInput: !prev.toInput }));
  };

  const onInputChangeHandler = (e) => {
    setToInputComment((prev) => ({ ...prev, comment: e.target.value }));
  };

  const deleteMessageButtonHandler = (e) => {
    e.preventDefault();
    setToDelete((prev) => ({ ...prev, loadState: true }));
    sendRequset(
      `https://serr-secret.herokuapp.com/api/message?messageId=${id}`,
      "DELETE",
      {},
      {
        Authorization:
          "Bear " + auth.token || window.localStorage.getItem("token"),
      }
    ).then(() => {
      setToDelete((prev) => ({
        ...prev,
        toDeleteState: false,
        loadState: true,
      }));
      window.location.reload();
    });
  };

  const onShareIconClickHandler=(e)=>{
     e.preventDefault();
     navigator.clipboard.writeText(
       ":???????????????? ???? ???????????? " +
         window.localStorage.getItem("name") +
         " ??????" +
         "\n" +
         messageBody +
         "\nhttps://serr-seccret.web.app/ ?????????? ???????? ???????????? ?????????????? ???? ???? ???????? ?????????? ???? ?????????? ???? ????????????\n https://play.google.com/store/apps/details?id=com.azem.sserr ???? ???? ???????????? ?????????????? ?????????????????? ???? ????????"
     );
     toast("copied to clipboard");
  }

  return (
    <>
      <CommentAndMessageWrapper>
        {toInputComment.commentState && (
          <CommentWrapper>
            <CommentBody>{"????????: " + toInputComment.commentState}</CommentBody>
          </CommentWrapper>
        )}
        <SingleMessageWrapper>
          <MessageBody>{messageBody}</MessageBody>
          {modeIsTotal && (
            <IconsWrapper>
              <SingleIconWrapper>
                <Icon
                  onClick={onFavouriteIconClick}
                  src={
                    isFavouriteState.loadState
                      ? loader
                      : isFavouriteState.isFavourite
                      ? redFavouriteIcon
                      : favouriteIcon
                  }
                />
                <IconTag>??????????????</IconTag>
              </SingleIconWrapper>
              <SingleIconWrapper>
                <Icon
                  src={
                    toDelete.loadState
                      ? loader
                      : toDelete.toDeleteState
                      ? coloredDeleteIcon
                      : deleteIcon
                  }
                  onClick={deleteIconClickHandler}
                />
                <IconTag>??????</IconTag>
              </SingleIconWrapper>
              <SingleIconWrapper>
                <Icon
                  src={
                    toInputComment.loaderState
                      ? loader
                      : toInputComment.toInput
                      ? coloredCommentIcon
                      : commentIcon
                  }
                  onClick={replyIconClickHandler}
                />
                <IconTag>????</IconTag>
              </SingleIconWrapper>
              <SingleIconWrapper>
                <Icon src={shareIcon} onClick={onShareIconClickHandler}/>
                <IconTag>????????????</IconTag>
              </SingleIconWrapper>
            </IconsWrapper>
          )}
          {toInputComment.toInput && modeIsTotal && (
            <CommentInputWrapper onSubmit={sendCommentButtonHandler}>
              <Input
                type="text"
                placeholder="???????? ?????? ??????..."
                value={toInputComment.comment}
                onChange={onInputChangeHandler}
              />
              <CommentButton type="submit">??????????</CommentButton>
              <CommentButton
                onClick={() =>
                  setToInputComment((prev) => ({ ...prev, toInput: false }))
                }
                colored={true}
              >
                ??????????
              </CommentButton>
            </CommentInputWrapper>
          )}
          {toDelete.toDeleteState && modeIsTotal && (
            <DeleteWrapper>
              <DeleteText>???? ?????? ?????????? ???? ?????? ????????????????</DeleteText>
              <CommentButton onClick={deleteMessageButtonHandler}>
                ??????
              </CommentButton>
              <CommentButton onClick={() => setToDelete(false)} colored={true}>
                ??????????
              </CommentButton>
            </DeleteWrapper>
          )}
          <FooterWrapper>
            <Date>{date}</Date>
            {modeIsTotal && (
              <Button
                isPublic={isPublicState.isPublic}
                onClick={onPublicButtonClick}
              >
                {isPublicState.loadState ? (
                  <Icon src={loader} />
                ) : isPublicState.isPublic ? (
                  "?????????? ???? ????????????"
                ) : (
                  "?????????? ????????????"
                )}
              </Button>
            )}
          </FooterWrapper>
        </SingleMessageWrapper>
      </CommentAndMessageWrapper>
    </>
  );
};

export default Message;
