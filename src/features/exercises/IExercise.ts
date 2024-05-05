interface IExercise {
  id: string;
  author: string;
  authorId: string;
  title: string;
  link: string;
  tags: string[];
  removed: boolean;
}

export default IExercise;
