import CommentWrapper from "../Components/Comment-wrapper";
import NavigationBar from "../Components/NavigationBar";
import { useEffect, useRef } from "react";
import { CommentService } from "../services/comment.service";
import { FirebaseError } from "firebase/app";
import { onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useAppDispatch } from "./../hooks/hooks";
import { saveAllComments } from "../hooks/commentSlice";
import { CommentType } from "../hooks/states";
import { Toast } from "primereact/toast";
import { commentRef } from "../utils/db.references";

const Home = () => {
  const commentservice = new CommentService();
  const dispatch = useAppDispatch();
  const toastRef = useRef<any>(null);

  useEffect(() => {
    commentservice
      .getAllComments()
      .then((querySnapshot: QuerySnapshot) => {
        const allComments: CommentType[] = [];
        querySnapshot.forEach((doc) => {
          const comment = {
            id: doc.id,
            content: doc.data().content,
            createdAt: doc.data().createdAt,
            score: doc.data().score,
            user: doc.data().user,
            replies: doc.data().replies,
          };

          allComments.push(comment);
        });

        dispatch(saveAllComments(allComments));
      })
      .catch((error: FirebaseError) => {
        toastRef.current?.show({
          severity: "error",
          summary: error.name,
          detail: "User Not Found",
          life: 3000,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      commentRef,
      (querySnapshot: QuerySnapshot) => {
        const allComments: CommentType[] = [];
        querySnapshot.forEach((doc) => {
          const comment = {
            id: doc.id,
            content: doc.data().content,
            createdAt: doc.data().createdAt,
            score: doc.data().score,
            user: doc.data().user,
            replies: doc.data().replies,
          };

          allComments.push(comment);
        });

        dispatch(saveAllComments(allComments));
      }
    );

    // Later ...

    // Stop listening to changes
    return () => unsubscribe();
  });

  return (
    <main id="home-section">
      <Toast ref={toastRef} />
      <NavigationBar />
      <CommentWrapper />
    </main>
  );
};

export default Home;
