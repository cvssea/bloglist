const dummy = () => 1;

const totalLikes = (posts) => {
  const reducer = (sum, post) => sum + post.likes;
  return posts.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  let favorite = { likes: 0 };
  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) {
      favorite = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      };
    }
  });
  return favorite;
};

const mostBlogs = (blogs) => {
  const totalByAuthor = [];
  blogs.forEach((blog) => {
    const index = totalByAuthor.findIndex(a => a.author === blog.author);
    if (index !== -1) {
      totalByAuthor[index].blogs += 1;
    } else {
      totalByAuthor.push({
        author: blog.author,
        blogs: 1,
      });
    }
  });
  let bestBlogger = { blogs: 0 };
  totalByAuthor.forEach((author) => {
    if (author.blogs > bestBlogger.blogs) {
      bestBlogger = { ...author };
    }
  });
  return bestBlogger;
};

const mostLikes = (blogs) => {
  const combinedLikes = [];
  blogs.forEach((blog) => {
    const index = combinedLikes.findIndex(a => a.author === blog.author);
    if (index !== -1) {
      combinedLikes[index].likes += blog.likes;
    } else {
      combinedLikes.push({
        author: blog.author,
        likes: blog.likes,
      });
    }
  });

  const mostLiked = favoriteBlog(combinedLikes);
  const { author, likes } = mostLiked;
  return { author, likes };
};

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogs,
  listWithOneBlog,
};
