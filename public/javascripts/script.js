let comments = document.querySelectorAll('.comment');
let article = document.getElementById('article-content');

const linebreaks = /(\r\n|\n|\r)/gm;

onLoad();

function onLoad() {
    if (article) {
        article.innerHTML = article.textContent.replace(/(\t)/gm, "&nbsp;&nbsp;&nbsp;&nbsp;");
        article.innerHTML = article.textContent.replace(" ", "&nbsp;");
        article.innerHTML = article.textContent.replace(linebreaks, "<br />");
    }

    if (comments) {
        comments.forEach(c => {
            c.innerHTML = c.textContent.replace(" ", "&nbsp;");
            c.innerHTML = c.textContent.replace(linebreaks, "<br />");
        })
    }
}

// Heart Like button animations

$(function() {
    $(".heart").on("click", function() {
      $(this).toggleClass("is-active");
    });
  });

let updatePostStats = {
    Like: function (postId) {
        document.querySelector('#likes-count-' + postId).textContent++;
    },
    Unlike: function(postId) {
        document.querySelector('#likes-count-' + postId).textContent--;
    }
};

let toggleButtonText = {
    Like: function(span) {
        span.textContent = "Unlike";
    },
    Unlike: function(span) {
        span.textContent = "Like";
    }
};

function actOnPost(event) {
    let spanEl = event.target.querySelector('span');
    let postId = event.target.dataset.postId;
    let action = spanEl.textContent.trim();
    toggleButtonText[action](spanEl);
    updatePostStats[action](postId);
    axios.post('/articles/' + postId + '/likes', { action: action });
};

// Materialize Components

$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.tooltipped').tooltip();
    $('textarea#enter-comment, input#new-title, textarea#new-content, input#edit-title,textarea#edit-content').characterCounter();
})