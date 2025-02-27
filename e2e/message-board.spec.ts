import test, { expect, Page } from '@playwright/test';
import {
  createComment,
  createPost,
  login,
  setupE2eTest,
  signUp,
} from './utils';

const testUserEmail = 'test@test.io';
const testUserPassword = 'testing';
const testUserName = 'testUsername';

test.describe('Message Board', () => {
  test.beforeEach(setupE2eTest);

  test.beforeEach(async ({ page }) => {
    page.goto('http://localhost:5173');
  });

  test.describe('not logged in', () => {
    test('can see message board, but cannot interact', async ({ page }) => {
      const messageBoardLink = page.locator('a', { hasText: 'Message Board' });
      await messageBoardLink.click();
      const messageBoardSignIn = page.locator(
        `[data-e2e="message-board-login"]`
      );
      const createPostForm = page.locator(`[data-e2e="create-post-form"]`);
      await expect(messageBoardSignIn).toHaveCount(1);
      await expect(createPostForm).toHaveCount(0);
    });

    test('can see posts on the message board, but cannot interact', async ({
      page,
    }) => {
      const messageBoardLink = page.locator('a', { hasText: 'Message Board'});
      await messageBoardLink.click();
    });

    test('signing up from the message board sends you back to the message board', async ({
      page,
    }) => {
      const messageBoardLink = page.locator('a', { hasText: 'Message Board' });
      await messageBoardLink.click();
      await signUp(page, testUserEmail, testUserPassword, testUserName);
      const messageBoardTitle = page.locator('h2', {
        hasText: 'Message Board',
      });
      await expect(messageBoardTitle).toHaveCount(1);
      const createPostForm = page.locator(`[data-e2e="create-post-form"]`);
      await expect(createPostForm).toHaveCount(1);
    });

    test('logging in from a post message board sends you back to that post', async ({
      page,
    }) => {
      await signUp(page, testUserEmail, testUserPassword, testUserName);
      const post = await createPost(page, 'test post', 'test contents');
      const logoutButton = page
        .locator('button', { hasText: 'Logout' })
        .first();
      await logoutButton.click();
      await post.click();
      const postContent = page.locator(`[data-e2e="post-content"]`, {
        hasText: 'test contents',
      });
      await expect(postContent).toHaveCount(1);
      const postUrl = page.url();
      await login(
        page,
        testUserEmail,
        testUserPassword,
        testUserName,
        `[data-e2e="message-board-login"] button`
      );
      expect(page.url()).toBe(postUrl);
      await expect(postContent).toHaveCount(1);
    });
  });

  test.describe('signed in user', () => {
    test.beforeEach(async ({ page }) => {
      await signUp(page, testUserEmail, testUserPassword, testUserName);
    });

    test('can get to message board', async ({ page }) => {
      const messageBoardLink = page.locator('a', { hasText: 'message board' });
      await messageBoardLink.click();
      const messageBoardHeader = page.locator('h2', {
        hasText: 'Message Board',
      });
      await expect(messageBoardHeader).toHaveCount(1);
    });

    test('can create a new post', async ({ page }) => {
      await createPost(page, 'Test Post', 'This is a test post');
      const postedByMessage = page.locator('p', {
        hasText: `Posted by ${testUserName}`,
      });
      await expect(postedByMessage).toHaveCount(1);
    });

    test('can create a new top level comment', async ({ page }) => {
      const post = await createPost(page, 'Test Post', 'This is a test post');
      await post.click();
      await createComment(page, 'This is a test comment');
      const textArea = page.locator(`textarea`);
      await expect(textArea).toHaveValue('');
    });

    test('nested comment form closes after comment is posted', async ({
      page,
    }) => {
      const post = await createPost(page, 'Test Post', 'This is a test post');
      await post.click();
      await createComment(page, 'This is a test comment');
      const replyButton = page.locator(`button`, { hasText: 'Reply' });
      await replyButton.click();
      const commentForms = page.locator(`[data-e2e="create-comment-form"]`);
      await expect(commentForms).toHaveCount(2);
      const nestedCommentForm = commentForms.nth(1);
      await nestedCommentForm
        .locator('textarea')
        .fill('This is a nested comment');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      const postedComment = page.locator(`[data-e2e="comment-content"]`, {
        hasText: 'This is a nested comment',
      });
      await expect(postedComment).toHaveCount(1);
      await expect(commentForms).toHaveCount(1);
    });
  });
});
