import { collection } from "firebase/firestore";
import { db } from "./firebase.config";

export const commentRef = collection(db, "comments");
