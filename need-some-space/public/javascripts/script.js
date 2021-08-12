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

// Nav Bar 

$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $('.tooltipped').tooltip();
})