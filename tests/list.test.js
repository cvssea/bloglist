const listHelper = require('../utils/list_helper');
const { listWithOneBlog, blogs } = require('../utils/list_helper');

test('dummy returns one', () => {
  const result = listHelper.dummy();
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('of a list of blogs is found correctly', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    };
    const result = listHelper.favoriteBlog(blogs);

    expect(result).toEqual(expected);
  });
});

describe('most blogs', () => {
  test('of an author from a list of blogs', () => {
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3,
    };
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual(expected);
  });
});

describe('most likes', () => {
  test('for an author in a list of blogs', () => {
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual(expected);
  });
});
