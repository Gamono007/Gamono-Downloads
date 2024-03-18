function validateURL() {
  var url = document.getElementById("urlInput").value;
  var submitButton = document.getElementById("submitButton");
  if (url.trim() !== "") {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function sendURL() {
  var url = document.getElementById("urlInput").value;
  document.getElementById("urlInput").value = "";
  window.location.href = `http://${window.location.hostname}:${window.location.port}/download?URL=${encodeURIComponent(url)}`;
}