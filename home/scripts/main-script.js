function validateURL() {
  var url = document.getElementById("url-input").value;
  var baixar = document.getElementById("baixar");
  if (url.trim() !== "") {
    baixar.disabled = false;
  } else {
    baixar.disabled = true;
  }
}

function sendURL() {
  var url = document.getElementById("url-input").value;
  document.getElementById("url-input").value = "";
  window.location.href = `http://${window.location.hostname}:${window.location.port}/download?URL=${encodeURIComponent(url)}`;
}