document.addEventListener("DOMContentLoaded", function () {
    var popup = document.getElementById("myPopup");
    var btn = document.getElementById("openPopup");
    var span = document.getElementsByClassName("close")[0];
  
    // Quando clicchi sul pulsante, mostra la popup
    btn.onclick = function () {
      popup.style.display = "block";
    };
  
    // Quando clicchi sulla X, chiudi la popup
    span.onclick = function () {
      popup.style.display = "none";
    };
  
    // Quando clicchi fuori dalla popup, chiudila
    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };
  });
  