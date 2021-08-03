// // Create a request variable and assign a new XMLHttpRequest object to it.
// var request = new XMLHttpRequest()

// // Open a new connection, using the GET request on the URL endpoint
// request.open('GET', 'http://api.pixlpark.com/oauth/requesttoken', true);

// request.onload = function () {
//   // Begin accessing JSON data here
  
//   request2.open('GET', 'http://api.pixlpark.com/oauth/accesstoken?oauth_token=' + this.response['RequestToken'] + '&grant_type=api&username=38cd79b5f2b2486d86f562e3c43034f8&password=8e49ff607b1f46e1a5e8f6ad5d312a80', true);

//   request2.onload = function () {
//     request3.onload = function () {
//         console.log(this.response);
//     }

//       request3.open('GET', 'http://api.pixlpark.com/orders?oauth_token=' + this.response['AccessToken'], true);
//   }
// }

// // Send request
// request.send()
async function get() {
    let response = await fetch('http://api.pixlpark.com/oauth/requesttoken', {mode: 'no-cors'});
    console.log(response);
    let commits = await response.json();
    console.log(commits)
}
get();