import { Dispatch, SetStateAction, useRef, useState } from "react";
import { CommentService } from "../services/comment.service";
import { Toast } from "primereact/toast";
import { useAppSelector } from "../hooks/hooks";
import { FirebaseError } from "firebase/app";

type addCommentPropType = {
  comment?: any;
  setDisplayAddModal?: Dispatch<SetStateAction<boolean>> | undefined;
  setCommentForm?: Dispatch<SetStateAction<boolean>> | undefined;
};

const AddComment = ({
  comment,
  setDisplayAddModal,
  setCommentForm,
}: addCommentPropType) => {
  const [commentContent, setCommentContent] = useState<string>("");
  const authUser = useAppSelector((state) => state.auth.authUser);
  const commentservice = new CommentService();
  const toastRef = useRef<any>(null);

  const submitComment = () => {
    if (commentContent) {
      if (comment) {
        const newReply = {
          id: new Date().getTime(),
          content: commentContent,
          createdAt: new Date().toUTCString(),
          score: [],
          replyingTo: comment.id,
          user: {
            email: authUser?.email,
            uid: authUser?.uid,
            image: authUser?.image,
          },
        };

        const updatedComment = {
          ...comment,
          replies: [newReply, ...comment?.replies],
        };

        setCommentContent("");
        updateCommentReplyInDb(updatedComment, comment.id);
      } else {
        const newComment = {
          content: commentContent,
          createdAt: new Date().toUTCString(),
          score: [],
          user: {
            email: authUser?.email,
            uid: authUser?.uid,
            image: authUser?.image,
          },
          replies: [],
        };
        setCommentContent("");
        addNewCommentToDb(newComment);
        setDisplayAddModal!(false);
      }
    } else {
      toastRef.current?.show({
        severity: "warn",
        summary: "Add Comment",
        detail: "Add Content to submit",
        life: 3000,
      });
    }
  };

  const addNewCommentToDb = (newComment: any) => {
    commentservice
      .addComment(newComment)
      .then((querySnapshot) => {
        setCommentContent("");
      })
      .catch((error: FirebaseError) => {
        toastRef.current?.show({
          severity: "error",
          summary: error.name,
          detail: error.code,
          life: 3000,
        });
      });
  };

  const updateCommentReplyInDb = (updatedComment: any, commentId: any) => {
    commentservice
      .updateCommentReplies(commentId, updatedComment)
      .then((querySnapshot) => {
        setCommentContent("");
      })
      .catch((error: FirebaseError) => {
        toastRef.current?.show({
          severity: "error",
          summary: error.name,
          detail: error.code,
          life: 3000,
        });
      });
  };

  const closeCommentForm = () => {
    setCommentForm!(false);
  };

  return (
    <>
      <section className="card add-comment-card">
        <div className="card-body p-4">
          <div className="mr-4 auth-profile">
            <img
              src={
                authUser && authUser.image
                  ? require(`../assets/avatars/${authUser.image}`)
                  : require("../assets/avatars/default.jpg")
              }
              className="w-10 h-10 rounded-full mx-auto"
              alt=""
            />
          </div>
          <div className="form-group">
            <textarea
              name="addComment"
              id="addComment"
              rows={3}
              className="w-full rounded-md p-3 form-control"
              placeholder="Enter your comment..."
              required
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
          </div>
          <div className="send-btn flex items-start justify-center">
            <button
              type="button"
              className="bg-red-600 px-3 py-2 text-white rounded-md text-sm ml-4 hover:bg-red-800 active:bg-red-800 active:ring-1 ring-red-500 ring-offset-2"
              onClick={closeCommentForm}
            >
              Close
            </button>
            <button
              type="button"
              className="bg-moderateBlue px-3 py-2 text-white rounded-md text-sm ml-4 hover:bg-blue-800 active:bg-blue-800 active:ring-1 ring-blue-500 ring-offset-2"
              onClick={submitComment}
            >
              SEND
            </button>
          </div>
        </div>
      </section>
      <Toast ref={toastRef} />
    </>
  );
};

export default AddComment;
