var urlMapping = {
    fake: "./nextpage.html",
    true: "./truepage.html",
  };
  
  var a = 0;
  function count() {
    a++;
    var value = document.getElementById("value").value;
    console.log(value);
    if (value == "fake") {
      window.location = urlMapping["true"];
    } else {
      window.location = urlMapping["fake"];
    }
  }
  document.getElementById("submit-form").onclick = count;
  