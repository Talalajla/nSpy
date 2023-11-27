function createToast(message) {
    var toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerText = message;
    document.querySelector('.wrapper').appendChild(toast);
    setTimeout(function() {
      document.querySelector('.wrapper').removeChild(toast);
    }, 2000);
  }