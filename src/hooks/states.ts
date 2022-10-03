export type AuthUserType = {
  email: string | null;
  uid: string;
  image: string;
};

export type CommentType = {
  id?: string;
  content: string;
  createdAt: string;
  score: ScoreType[];
  user: AuthUserType;
  replies?: CommentType[];
  replyingTo?: string;
};

export type ScoreType = {
  vote: boolean;
  user: string;
};
