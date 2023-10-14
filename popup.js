
//var userInput = prompt ("...");
/*
var countDownDate = new Date(userInput).getTime();

chrome.storage.sync.set({'nameInTheStorage' : jsVariables}, function(){
  if(chrome.runtime.error){
      console.log("Error.");
  }
});*/
let past_user_inputs = []
function returnText(){
  let input = document.getElementById("userInput").value

  past_user_inputs.push(input)
}
