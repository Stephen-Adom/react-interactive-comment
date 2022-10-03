import {
  createUserWithEmailAndPassword,
  Auth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export class AuthService {
  createAccount = async (auth: Auth, email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  sigInUser = async (auth: Auth, email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  signOutUser = async (auth: Auth) => {
    return await signOut(auth);
  };
}
