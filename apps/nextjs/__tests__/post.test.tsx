import { Suspense } from "react";

import type { RouterOutputs } from "@acme/api";
import { setupServer, trpcMsw } from "@acme/api/msw-trpc";
import { afterAll, beforeAll, expect, test, userEvent } from "@acme/vitest";

import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "~/app/_components/posts";
import { renderWithTRPC } from "./mocks/trpc";

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

const POSTS: readonly RouterOutputs["post"]["all"][number][] = [
  {
    id: "sample-id-1",
    title: "title first",
    content: "content",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample-id-2",
    title: "title 2",
    content: "content 2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

test("PostList should display 2 posts", async () => {
  server.use(trpcMsw.post.all.query(() => [...POSTS]));

  const utils = renderWithTRPC(
    <Suspense fallback={<div>Loading...</div>}>
      <PostList />
    </Suspense>,
  );
  // 最初のheadingを検証
  expect(
    await utils.findByRole("heading", { name: "title first" }),
  ).toBeInTheDocument();

  // 全てのheadingを検証
  const headings = await utils.findAllByRole("heading");
  expect(headings).toHaveLength(2);
  expect(headings[0]).toHaveTextContent("title");
  expect(headings[1]).toHaveTextContent("title 2");
});

test("PostList should display no posts", async () => {
  server.use(trpcMsw.post.all.query(() => []));

  const utils = renderWithTRPC(
    <Suspense fallback={<div>Loading...</div>}>
      <PostList />
    </Suspense>,
  );

  expect(await utils.findByText("No posts yet")).toBeInTheDocument();
});

test("CreatePostForm should submit and create a post", async () => {
  const posts = [...POSTS];
  server.use(
    trpcMsw.post.all.query(() => [...posts]),
    trpcMsw.post.create.mutation((req) => {
      const { title, content } = req.input;
      const now = new Date();
      const newPost = {
        id: "new-post-id",
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      posts.push(newPost);
    }),
  );

  const utils = renderWithTRPC(
    <>
      <CreatePostForm />
      <div className="w-full max-w-2xl overflow-y-scroll">
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          }
        >
          <PostList />
        </Suspense>
      </div>
    </>,
  );

  const user = userEvent.setup();
  // input some text
  await user.type(utils.getByPlaceholderText("Title"), "new title");
  await user.type(utils.getByPlaceholderText("Content"), "new content");
  await user.click(utils.getByRole("button", { name: /create/i }));

  // --- ポスト一覧に新しい heading が描画されるまで待つ ----------------------
  expect(
    await utils.findByRole("heading", { name: "new title" }),
  ).toBeInTheDocument();

  const headings = await utils.findAllByRole("heading");
  expect(headings).toHaveLength(3);

  // --- フォームがリセットされていることを確認 ------------------------
  expect((utils.getByPlaceholderText("Title") as HTMLInputElement).value).toBe(
    "",
  );
  expect(
    (utils.getByPlaceholderText("Content") as HTMLInputElement).value,
  ).toBe("");
});
