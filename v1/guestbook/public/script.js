$(document).ready(function() {
    var headerTitleElement = $("#header h1");
    var entriesElement = $("#guestbook-entries");
    var formElement = $("#guestbook-form");
    var submitElement = $("#guestbook-submit");
    var entryContentElement = $("#guestbook-entry-content");
    var hostAddressElement = $("#guestbook-host-address");
    var messageContainer = $("#message-container");
  
    var appendGuestbookEntries = function(data) {
      entriesElement.empty();
      $.each(data, function(key, val) {
        entriesElement.append("<p>" + val + "</p>");
      });
    }
  
    var showMessageBubble = function(message) {
      messageContainer.empty();
      var messageBubble = $("<div>").addClass("message-bubble").text(message);
      messageContainer.append(messageBubble);
    }
  
    var showSavedMessageBox = function(message) {
      var savedMessageBox = $("<div>").addClass("saved-message-box").text(message);
      entriesElement.prepend(savedMessageBox);
    }
  
    var handleSubmission = function(e) {
      e.preventDefault();
      var entryValue = entryContentElement.val()
      if (entryValue.length > 0) {
        showSavedMessageBox(entryValue);
        entryContentElement.val("");
        $.getJSON("rpush/guestbook/" + entryValue, appendGuestbookEntries)
          .done(function() {
            showMessageBubble("Message submitted successfully!");
          })
          .fail(function() {
            showMessageBubble("Failed to submit message. Please try again.");
          });
      } else {
        showMessageBubble("Please enter a message before submitting.");
      }
      return false;
    }
  
    submitElement.click(handleSubmission);
    formElement.submit(handleSubmission);
    hostAddressElement.append(document.URL);
  
    // Poll every second.
    (function fetchGuestbook() {
      $.getJSON("lrange/guestbook").done(appendGuestbookEntries).always(
        function() {
          setTimeout(fetchGuestbook, 1000);
        });
    })();
  });
  