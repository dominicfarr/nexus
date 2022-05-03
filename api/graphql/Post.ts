import { intArg, objectType } from 'nexus';
import { extendType } from 'nexus';
import { stringArg, nonNull } from 'nexus';

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id');
    t.string('title');
    t.string('body');
    t.boolean('published');
  },
});

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('publish', {
      type: 'Post',
      args: { draftId: nonNull(intArg()) },
      resolve(_parent, args, context) {
        const draftToBePublished = context.db.posts.find(
          (post) => post.id === args.draftId
        );
        if (draftToBePublished) {
          draftToBePublished.published = true;
          return draftToBePublished;
        }
        throw new Error('Could not find draft ' + args.draftId);
      },
    });
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_parent, args, context) {
        const draft = {
          id: context.db.posts.length + 1,
          title: args.title,
          body: args.body,
          published: false,
        };
        context.db.posts.push(draft);
        return draft;
      },
    });
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('drafts', {
      type: 'Post',
      resolve(_parent, _args, context) {
        return context.db.posts.filter((post) => post.published === false);
      },
    });
    t.list.field('posts', {
      type: 'Post',
      resolve(_parent, _args, context) {
        return context.db.posts.filter((post) => post.published === true);
      },
    });
  },
});
