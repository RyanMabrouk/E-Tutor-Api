import { Comment } from '../domain/comments';

export class CommentsWithRplies extends Comment {
  replies: Comment[];
}
