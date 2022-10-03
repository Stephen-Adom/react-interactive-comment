import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { commentRef } from "../utils/db.references";
import { db } from "../utils/firebase.config";

export class CommentService {
  getAllComments = async () => {
    const commentQuery = query(commentRef, orderBy("name", "desc"));
    return await getDocs(commentQuery);
  };

  addComment = async (comment: any) => {
    return await addDoc(commentRef, comment);
  };

  updateComment = async (docId: any, comment: any) => {
    const docRef = doc(db, "comments", docId);
    return await updateDoc(docRef, {
      score: comment.score,
    });
  };

  updateCommentReplies = async (docId: any, comment: any) => {
    const docRef = doc(db, "comments", docId);
    return await updateDoc(docRef, {
      replies: comment.replies,
    });
  };

  updateCommentContent = async (docId: any, comment: any) => {
    const docRef = doc(db, "comments", docId);
    return await updateDoc(docRef, {
      content: comment.content,
    });
  };

  deleteComment = async (docId: any) => {
    const docRef = doc(db, "comments", docId);
    return await deleteDoc(docRef);
  };
}
