import { initContract, login, logout, getInfo} from './near/utils';
import "regenerator-runtime/runtime";


//tim
// document.querySelector('.sign-in').style.display = 'block';

document.querySelector('.sign-in .btn').onclick = login;
document.querySelector('.sign-out .btn').onclick = logout;

window.nearInitPromise = initContract()
                    .then(flow)
                    .catch(console.error)


function flow(){
    if (window.walletConnection.isSignedIn()){
        signedInFlow()
    }else{
        signedOutFlow()
    }
    // updateUI()
}


// Display the signed-out-flow container
function signedOutFlow() {
    document.querySelector('.sign-in').style.display = 'block';
    document.querySelectorAll('.interact').forEach(button => button.disabled = true)
  }
  
  // Displaying the signed in flow container and display counter
async function signedInFlow() {
document.querySelector('.sign-out').style.display = 'block';
document.querySelectorAll('.interact').forEach(button => button.disabled = false)
}
  