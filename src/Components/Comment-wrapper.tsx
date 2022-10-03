import React, { useRef, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { Dialog } from "primereact/dialog";
import CommentCard from "./Comment-Card";
import AddComment from "./AddComment";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useAppDispatch } from "./../hooks/hooks";
import {
  closeConfirmDialog,
  removeCommentInfo,
  resetInfoType,
} from "../hooks/commentSlice";
import { CommentService } from "../services/comment.service";
import { FirebaseError } from "firebase/app";
import { Toast } from "primereact/toast";
import SpeedDial from "./SpeedDialBtn";

const CommentWrapper = () => {
  const AllComments = useAppSelector((state) => state.comments.comments);
  const [displayAddModal, setDisplayAddModal] = useState<boolean>(false);
  const confirmDialogState = useAppSelector(
    (state) => state.comments.showConfirmDialog
  );
  const commentInfo = useAppSelector((state) => state.comments.commentInfo);
  const allComments = useAppSelector((state) => state.comments.comments);
  const commentInfoType = useAppSelector((state) => state.comments.infoType);

  const dispatch = useAppDispatch();
  const commentservice = new CommentService();
  const toastRef = useRef<any>(null);

  const deleteComment = () => {
    commentservice
      .deleteComment(commentInfo?.id)
      .then((response) => {
        dispatch(removeCommentInfo());
        dispatch(resetInfoType());
      })
      .catch((error: FirebaseError) => {
        console.log(error);
        toastRef.current?.show({
          severity: "error",
          summary: error.name,
          detail: error.code,
          life: 3000,
        });
      });
  };

  const deleteReply = () => {
    const parentComment = allComments.find(
      (parComment) => parComment.id === commentInfo!.replyingTo
    );

    if (parentComment) {
      const filteredReplies = parentComment.replies?.filter(
        (reply) => reply.id !== commentInfo!.id
      );

      const updatedComment = {
        ...parentComment,
        replies: filteredReplies,
      };

      commentservice
        .updateCommentReplies(updatedComment.id, updatedComment)
        .then((response) => {
          dispatch(removeCommentInfo());
          dispatch(resetInfoType());
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

  return (
    <section id="comment-wrapper" className="mt-[70px]">
      {AllComments.length ? (
        AllComments.map((comment) => {
          return (
            <React.Fragment key={comment.id}>
              <div className="comment-section">
                <CommentCard comment={comment} />
              </div>

              {comment?.replies?.length
                ? comment.replies.map((reply, index) => {
                    return (
                      <React.Fragment key={reply.id}>
                        <div className="comment-reply-section">
                          <CommentCard comment={reply} replyIndex={index} />
                        </div>
                      </React.Fragment>
                    );
                  })
                : []}
            </React.Fragment>
          );
        })
      ) : (
        <div className="text-center">
          <h5 className="italic mb-3">No Comment Available!!!</h5>
          <button
            type="button"
            className="bg-moderateBlue text-white px-5 py-3 rounded-lg text-sm"
            onClick={() => setDisplayAddModal(true)}
          >
            Add Comment
          </button>
        </div>
      )}

      <Dialog
        header="New Comment"
        visible={displayAddModal}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "40vw", "768px": "40vw", "320px": "95vw" }}
        onHide={() => setDisplayAddModal(false)}
        className="addCommentDialog"
      >
        <AddComment setDisplayAddModal={setDisplayAddModal}></AddComment>
      </Dialog>

      <ConfirmDialog
        className="commentConfirmDialog"
        style={{ width: "30vw" }}
        visible={confirmDialogState}
        onHide={() => dispatch(closeConfirmDialog())}
        message="Are you sure you want to delete this comment? This will remove the comment and can't be undone"
        header="Delete Comment"
        icon="pi pi-exclamation-triangle"
        accept={
          commentInfoType && commentInfoType === "comment"
            ? deleteComment
            : deleteReply
        }
        acceptClassName="p-button-danger"
        reject={() => dispatch(closeConfirmDialog())}
      />

      <Toast ref={toastRef} />

      {AllComments.length ? (
        <SpeedDial
          setDisplayAddModal={setDisplayAddModal}
          displayAddModal={displayAddModal}
        ></SpeedDial>
      ) : null}
    </section>
  );
};

export default CommentWrapper;
