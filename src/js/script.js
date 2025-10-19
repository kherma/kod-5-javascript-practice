'use strict';
const removeActiveClass = (query) => {
  const activeLinks = document.querySelectorAll(query);
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags',
  optArticleAuthorSelector = '.post-author';

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
  const titleList = document.querySelector(optTitleListSelector);

  /* remove contents of titleList */
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  );
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element and get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const newLi = document.createElement('li');
    const newA = document.createElement('a');
    const newSpan = document.createElement('span');

    article.classList.contains('active') && newA.classList.add('active');
    newA.href = `#${articleId}`;
    newSpan.innerText = articleTitle;

    newA.appendChild(newSpan);
    newLi.appendChild(newA);

    /* insert link into titleList */
    titleList.appendChild(newLi);
  }

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const articleTagsWrapper = article.querySelector(
      `${optArticleTagsSelector} ul`
    );

    /* get tags from data-tags attribute */
    const articleTags = article.dataset.tags.split(' ');

    /* START LOOP: for each tag */
    articleTags.forEach((tag) => {
      /* generate HTML of the link */
      const newA = document.createElement('a');
      const newLi = document.createElement('li');
      newA.innerText = tag;
      newA.href = `#tag-${tag}`;
      newLi.appendChild(newA);
      articleTagsWrapper.appendChild(newLi);
      /* END LOOP: for each tag */
    });
    /* END LOOP: for every article: */
  }
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
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const postAuthorWrapper = article.querySelector(optArticleAuthorSelector);
    const postAuthor = article.dataset.author;
    const newA = document.createElement('a');
    newA.innerText = postAuthor;
    newA.href = `#author-${postAuthor.toLowerCase().replace(' ', '-')}`;
    postAuthorWrapper.appendChild(newA);
  }
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
