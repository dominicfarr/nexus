export interface Post {
  id: number;
  title: string;
  body: string;
  published: boolean;
}

export interface Db {
  posts: Post[];
}

export const db: Db = {
  posts: [
    {
      id: 1,
      title: 'The title',
      body: 'Warm fuzzy words',
      published: false,
    },
    {
      id: 2,
      title: 'Clickbait',
      body: "Do you know what's in your soup?",
      published: true,
    },
  ],
};
