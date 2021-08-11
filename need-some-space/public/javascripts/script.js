// Heart Like button animations

$(function() {
    $(".heart").on("click", function() {
      $(this).toggleClass("is-active");
    });
  });


// Pusher Like button
var updatePostStats = {
    Like: function (postId) {
        document.querySelector('#likes-count-' + postId).textContent++;
    },
    Unlike: function(postId) {
        document.querySelector('#likes-count-' + postId).textContent--;
    }
};

var toggleButtonText = {
    Like: function(span) {
        span.textContent = "Unlike";
    },
    Unlike: function(span) {
        span.textContent = "Like";
    }
};

var actOnPost = function (event) {
    let spanEl = event.target.querySelector('span');
    var postId = event.target.dataset.postId;
    var action = spanEl.textContent.trim();
    toggleButtonText[action](spanEl);
    updatePostStats[action](postId);
    axios.post('/articles/' + postId + '/likes', { action: action });
};
