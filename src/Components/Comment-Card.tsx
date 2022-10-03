import buttonPlus from "../assets/icons/icon-plus.svg";
import buttonMinus from "../assets/icons/icon-minus.svg";
import replyIcon from "../assets/icons/icon-reply.svg";
import { CommentType, ScoreType } from "../hooks/states";
import { formatDistance } from "date-fns";
import { useEffect, useRef, useState } from "react";
import AddComment from "./AddComment";
import { useAppSelector } from "../hooks/hooks";
import { CommentService } from "../services/comment.service";
import { FirebaseError } from "firebase/app";

import * as _ from "lodash";
import { useDispatch } from "react-redux";
import {
  openConfirmDialog,
  setCommentInfo,
  setInfoType,
} from "../hooks/commentSlice";
import { Toast } from "primereact/toast";

type commentProp = {
  comment: CommentType;
  replyIndex?: any;
};

const CommentCard = ({ comment, replyIndex }: commentProp) => {
  const [commentForm, setCommentForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editCommentField, setEditCommentField] = useState<string>("");
  const authUser = useAppSelector((state) => state.auth.authUser);
  const commentservice = new CommentService();
  const dispatch = useDispatch();
  const allComments = useAppSelector((state) => state.comments.comments);
  const toastRef = useRef<any>(null);

  const getUpvoteTotal = (): number => {
    return comment
      ? comment.score.filter((score: ScoreType) => score.vote).length
      : 0;
  };

  const getUsernameFromEmail = (): string | null => {
    if (comment) {
      const userEmailArray = comment.user.email?.split("@")[0];
      return userEmailArray ? userEmailArray : null;
    } else {
      return null;
    }
  };

  const formatCommentDate = () => {
    if (comment) {
      return formatDistance(new Date(comment.createdAt), new Date(), {
        addSuffix: true,
      });
    } else {
      return null;
    }
  };

  const upVote = () => {
    const allScores = _.cloneDeep(comment.score);

    const userVoteExist = allScores.find(
      (score) => score.user === authUser?.email
    );
    if (userVoteExist) {
      if (userVoteExist.vote === true) {
        const newScore = allScores.filter(
          (score) => score.user !== authUser?.email
        );
        const updatedComment = {
          ...comment,
          score: newScore,
        };
        updateDocInDb(updatedComment);
      } else {
        const existingVoteIndex = allScores.indexOf(userVoteExist);
        userVoteExist.vote = true;

        allScores.splice(existingVoteIndex, 1, userVoteExist);

        const updatedComment = {
          ...comment,
          score: allScores,
        };

        updateDocInDb(updatedComment);
      }
    } else {
      const updatedComment = {
        ...comment,
        score: [
          ...comment.score,
          {
            user: authUser?.email,
            vote: true,
          },
        ],
      };

      updateDocInDb(updatedComment);
    }
  };

  const downVote = () => {
    const allScores = _.cloneDeep(comment.score);

    const userVoteExist = allScores.find(
      (score) => score.user === authUser?.email
    );
    if (userVoteExist) {
      if (userVoteExist.vote === false) {
        const newScore = allScores.filter(
          (score) => score.user !== authUser?.email
        );

        const updatedComment = {
          ...comment,
          score: newScore,
        };

        updateDocInDb(updatedComment);
      } else {
        const existingVoteIndex = allScores.indexOf(userVoteExist);
        userVoteExist.vote = false;

        allScores.splice(existingVoteIndex, 1, userVoteExist);

        const updatedComment = {
          ...comment,
          score: allScores,
        };

        updateDocInDb(updatedComment);
      }
    } else {
      const updatedComment = {
        ...comment,
        score: [
          ...comment.score,
          {
            user: authUser?.email,
            vote: false,
          },
        ],
      };

      updateDocInDb(updatedComment);
    }
  };

  const updateDocInDb = (updatedComment: any) => {
    if (updatedComment.hasOwnProperty("replyingTo")) {
      const parentComment = allComments.find(
        (parComment) => parComment.id === updatedComment.replyingTo
      );

      const allReplies = _.cloneDeep(parentComment!.replies);
      // const replyIndex = allReplies!.indexOf(comment);

      allReplies?.splice(replyIndex, 1, updatedComment);

      const updatedParentComment = {
        ...parentComment,
        replies: allReplies,
      };

      commentservice
        .updateCommentReplies(updatedParentComment.id, updatedParentComment)
        .then((querySnapshot) => {
          console.log(querySnapshot);
        })
        .catch((error: FirebaseError) => {
          toastRef.current?.show({
            severity: "error",
            summary: error.name,
            detail: error.code,
            life: 3000,
          });
        });
    } else {
      commentservice
        .updateComment(comment.id, updatedComment)
        .then((querySnapshot) => {
          console.log(querySnapshot);
        })
        .catch((error: FirebaseError) => {
          toastRef.current?.show({
            severity: "error",
            summary: error.name,
            detail: error.code,
            life: 3000,
          });
        });
    }
  };

  // CHECK IF USER HAS VOTED
  const checkIfUserVotedTrue = () => {
    if (comment && authUser) {
      return (
        comment.score.find((score) => score.user === authUser?.email)?.vote ===
        true
      );
    } else {
      return false;
    }
  };

  // CHECK IF USER HAS VOTED
  const checkIfUserVotedFalse = () => {
    if (comment && authUser) {
      return (
        comment.score.find((score) => score.user === authUser?.email)?.vote ===
        false
      );
    } else {
      return false;
    }
  };

  // DISPLAY REPLY BUTTON
  const displayReplyButton = () => {
    if (authUser && comment && authUser.email === comment.user.email) {
      if (!comment.hasOwnProperty("replyingTo")) {
        return (
          <div className="replyButton flex items-center justify-end mt-3 sm:mt-3 md:mt-0 lg:mt-0">
            <button
              onClick={() => setCommentForm((current) => !current)}
              type="button"
              className="text-moderateBlue font-bold flex items-center hover:text-blue-400 active:text-blue-400"
            >
              <img src={replyIcon} className="mr-2" alt="reply" />
              Reply
            </button>

            <button
              type="button"
              className="text-red-600 font-bold ml-4 hover:text-red-400 active:text-red-400"
              onClick={deleteComment}
            >
              <i className="pi pi-trash mr-1 text-xs"></i>
              <span className="hidden sm:hidden md:inline lg:inline">
                Delete
              </span>
            </button>

            <button
              type="button"
              className="text-moderateBlue font-bold ml-2 hover:text-blue-400 active:text-blue-400"
              onClick={() => setEditMode((current) => !current)}
            >
              <i className="pi pi-pencil mr-1 text-xs"></i>

              <span className="hidden sm:hidden md:inline lg:inline">Edit</span>
            </button>
          </div>
        );
      } else {
        return (
          <div className="replyButton flex items-center justify-end mt-3 sm:mt-3 md:mt-0 lg:mt-0">
            <button
              type="button"
              className="text-red-600 font-bold ml-4 hover:text-red-400 active:text-red-400"
              onClick={deleteComment}
            >
              <i className="pi pi-trash mr-1 text-xs"></i>
              <span className="hidden sm:hidden md:inline lg:inline">
                Delete
              </span>
            </button>

            <button
              type="button"
              className="text-moderateBlue font-bold ml-2 hover:text-blue-400 active:text-blue-400"
              onClick={() => setEditMode((current) => !current)}
            >
              <i className="pi pi-pencil mr-1 text-xs"></i>
              <span className="hidden sm:hidden md:inline lg:inline">Edit</span>
            </button>
          </div>
        );
      }
    } else {
      if (comment && !comment.hasOwnProperty("replyingTo")) {
        return (
          <div className="replyButton flex items-center justify-end mt-3 sm:mt-3 md:mt-0 lg:mt-0">
            <button
              onClick={() => setCommentForm((current) => !current)}
              type="button"
              className="text-moderateBlue font-bold flex items-center hover:text-blue-400 active:text-blue-400"
            >
              <img src={replyIcon} className="mr-2" alt="reply" />
              Reply
            </button>
          </div>
        );
      }
    }
  };

  // DELETE COMMENT
  const deleteComment = () => {
    if (comment.hasOwnProperty("replyingTo")) {
      // DELTE REPLY
      dispatch(setInfoType("reply"));
      dispatch(openConfirmDialog());
      dispatch(setCommentInfo(comment));
    } else {
      // DELETE COMMENT
      dispatch(setInfoType("comment"));
      dispatch(openConfirmDialog());
      dispatch(setCommentInfo(comment));
    }
  };

  // TOGGLE EDIT FIELD

  const toggleEditComment = () => {
    return editMode ? (
      <>
        <div className="comment-text text-sm text-gray-500 font-medium mt-3">
          <textarea
            name="editCommentField"
            id="editCommentField"
            rows={2}
            className="form-control"
            value={editCommentField}
            onChange={(e) => setEditCommentField(e.target.value)}
          ></textarea>
          <div className="text-right">
            <button
              type="button"
              className="bg-moderateBlue px-5 py-3 text-white rounded-md text-sm"
              onClick={updateCommentContent}
            >
              UPDATE
            </button>
          </div>
        </div>
      </>
    ) : (
      <div className="comment-text text-sm text-gray-500 font-medium mt-3">
        {comment.content}
      </div>
    );
  };

  useEffect(() => {
    editMode ? setEditCommentField(comment.content) : setEditCommentField("");
  }, [comment.content, editMode]);

  const updateCommentContent = () => {
    if (editCommentField) {
      if (comment.hasOwnProperty("replyingTo")) {
        const parentComment = allComments.find(
          (parComment) => parComment.id === comment.replyingTo
        );

        const updatedContent = {
          ...comment,
          content: editCommentField,
        };

        if (parentComment) {
          const allReplies = _.cloneDeep(parentComment.replies);
          // const replyIndex = allReplies!.indexOf(comment);

          allReplies?.splice(replyIndex, 1, updatedContent);

          const updatedParentContent = {
            ...parentComment,
            replies: allReplies,
          };

          commentservice
            .updateCommentReplies(updatedParentContent.id, updatedParentContent)
            .then((response) => {
              setEditMode(false);
              setEditCommentField("");
            })
            .catch((error: FirebaseError) => {
              toastRef.current?.show({
                severity: "error",
                summary: error.name,
                detail: error.code,
                life: 3000,
              });
            });
        }
      } else {
        const updatedContent = {
          ...comment,
          content: editCommentField,
        };

        commentservice
          .updateCommentContent(comment.id, updatedContent)
          .then((response) => {
            setEditMode(false);
            setEditCommentField("");
          })
          .catch((error: FirebaseError) => {
            toastRef.current?.show({
              severity: "error",
              summary: error.name,
              detail: error.code,
              life: 3000,
            });
          });
      }
    }
  };

  return (
    <>
      {comment && (
        <div className="card comment-card">
          <div className="card-body">
            <div className="upvote-section">
              <button
                type="button"
                className={`voteBtn ${checkIfUserVotedTrue() && "active"}`}
                onClick={upVote}
              >
                <img src={buttonPlus} alt="button plus" />
              </button>
              <span className="block text-moderateBlue font-extrabold">
                {getUpvoteTotal()}
              </span>
              <button
                type="button"
                className={`voteBtn ${checkIfUserVotedFalse() && "active"}`}
                onClick={downVote}
              >
                <img src={buttonMinus} alt="button minus" />
              </button>
            </div>
            <div className="user-info flex items-center">
              <div className="mr-2">
                <img
                  src={
                    comment.user.image
                      ? require(`../assets/avatars/${comment.user.image}`)
                      : require("../assets/avatars/default.jpg")
                  }
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
              </div>
              <span className="block mr-3 text-darkBlue font-extrabold">
                {getUsernameFromEmail()}
              </span>
              <span className="block text-xs text-gray-500 font-medium">
                {formatCommentDate()}
              </span>
            </div>

            {displayReplyButton()}

            {toggleEditComment()}
          </div>
        </div>
      )}

      {commentForm && <AddComment comment={comment} />}
      <Toast ref={toastRef} />
    </>
  );
};

export default CommentCard;
