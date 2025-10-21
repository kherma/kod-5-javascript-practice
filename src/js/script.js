'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-author-cloud-link').innerHTML
  ),
};

const removeActiveClass = (query) => {
  const activeLinks = document.querySelectorAll(query);
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
};

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    title: '.post-title',
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;

  /* remove class 'active' from all article links  */
  removeActiveClass('.titles a.active');

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  removeActiveClass('.posts article.active');

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};

function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(select.listOf.titles);

  /* remove contents of titleList */
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(
    select.all.articles + customSelector
  );
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;

    /* create HTML of the link */
    const linkHTMLData = {
      id: articleId,
      title: articleTitle,
      ...(article.classList.contains('active') && { className: 'active' }),
    };
    const linkHTML = templates.articleLink(linkHTMLData);
    html += linkHTML;
  }

  titleList.insertAdjacentHTML('beforeend', html);

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const generatePercentageMap = () => {
  const max = 100;
  const step = max / opts.tagSizes.count;
  const percentageMap = [];
  Array.from(Array(opts.tagSizes.count).keys()).forEach((num) => {
    percentageMap.push({
      min: Math.round(num * step + 1),
      max: Math.round((num + 1) * step),
    });
  });
  return percentageMap;
};

const calculateTagsParams = (tags) => {
  const tagsCounter = [];
  const params = {};
  for (let tag in tags) {
    tagsCounter.push(tags[tag]);
  }
  params.min = Math.min(...tagsCounter);
  params.max = Math.max(...tagsCounter);
  return params;
};

const calculateTagClass = (tagCount, tagsParams) => {
  const percentageMap = generatePercentageMap();

  const tagCountToPercentage = Math.round((tagCount * 100) / tagsParams.max);
  const tagPercentageToClassValue =
    percentageMap.findIndex(
      (element) =>
        element.min <= tagCountToPercentage &&
        element.max >= tagCountToPercentage
    ) + 1;
  return tagPercentageToClassValue;
};

function generateTags() {
  const allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  const tagsList = document.querySelector(select.listOf.tags);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const articleTagsWrapper = article.querySelector(select.article.tags);

    /* get tags from data-tags attribute */
    const articleTags = article.dataset.tags.split(' ');

    let html = '';
    /* START LOOP: for each tag */
    articleTags.forEach((tag) => {
      /* generate HTML of the link */
      const tagHTMLData = {
        id: `tag-${tag}`,
        title: tag,
      };
      const tagHTML = templates.tagLink(tagHTMLData);
      html += tagHTML;

      !allTags[tag] ? (allTags[tag] = 1) : allTags[tag]++;
      /* END LOOP: for each tag */
    });
    articleTagsWrapper.insertAdjacentHTML('beforeend', html);
    /* END LOOP: for every article: */
  }

  const allTagsData = { tags: [] };

  const tagsParams = calculateTagsParams(allTags);
  Object.entries(allTags).forEach((keyValue) => {
    allTagsData.tags.push({
      tag: keyValue[0],
      className: calculateTagClass(keyValue[1], tagsParams),
    });
  });
  tagsList.insertAdjacentHTML('beforeend', templates.tagCloudLink(allTagsData));
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const allActiveTagLinks = document.querySelectorAll(
    'a.active[href^="#tag-"]'
  );
  /* START LOOP: for each active tag link */
  for (let activeTagLink of allActiveTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const allTagsLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLink of allTagsLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let tagLink of allTagsLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  const allAuthors = {};
  const AuthorsList = document.querySelector(select.listOf.authors);

  const articles = document.querySelectorAll(select.all.articles);

  for (let article of articles) {
    const postAuthorWrapper = article.querySelector(select.article.author);
    const postAuthor = article.dataset.author;
    !allAuthors[postAuthor]
      ? (allAuthors[postAuthor] = 1)
      : allAuthors[postAuthor]++;

    const authorHTMLData = {
      id: postAuthor.toLowerCase().replace(' ', '-'),
      title: postAuthor,
    };
    const authorHTML = templates.authorLink(authorHTMLData);
    postAuthorWrapper.insertAdjacentHTML('beforeend', authorHTML);
  }
  const allAuthorsData = { authors: [] };
  Object.entries(allAuthors).forEach((keyValue) => {
    allAuthorsData.authors.push({
      id: keyValue[0].toLowerCase().replace(' ', '-'),
      author: keyValue[0],
      counter: keyValue[1],
    });
  });
  AuthorsList.insertAdjacentHTML(
    'beforeend',
    templates.authorCloudLink(allAuthorsData)
  );
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');

  const allActiveAuthorLinks = document.querySelectorAll(
    'a.active[href^="#author-"'
  );

  for (let activeAuthorLink of allActiveAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }

  const allAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let authorLink of allAuthorLinks) {
    authorLink.classList.add('active');
  }

  const authorDataSet = author
    .split('-')
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(' ');

  generateTitleLinks('[data-author="' + authorDataSet + '"]');
}

function addClickListenerToAuthors() {
  const allAuthorsLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of allAuthorsLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenerToAuthors();
