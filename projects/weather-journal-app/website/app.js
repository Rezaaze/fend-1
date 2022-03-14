/* Global Variables */
const api_key = "b076b3276229daa59919e693823fcecb";
const api  = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=";
const api_loc = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},DE&appid=${api_key}`
// created an empty object for holding variables for the backend
const data = {}
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// created 2 variables and saved the button element and the content in them
const button = document.getElementById('generate');

const content =document.getElementById('date');
console.log(content)

// added eventlistener to the button 
button.addEventListener("click", (e)=>{
    e.preventDefault();
    // saved the value from the textarea and input from zipcode in variables
    const feelings = document.getElementById('feelings');
    const zip = document.getElementById('zip');

    data.date =newDate;
    data.user_response = feelings.value;
    // first api request for getting the location from zipcode pls only use german zipcodes like 60437 for frankfurt 
    api_for_location(api_key,zip.value)
    .then(res=>{
        api_request_for_weather(api_key,res)
        .then(res=>{
            data.temperature = res.main.temp.toFixed(1);
            postData(data)
            getData()
            .then(res=>update_content(res))
            .catch(err=>("error in click event:", err))
        })
    })
    //clearing the form inputs for new request
    zip.value = null;
    
    feelings.value = null; 
    
    
    

    
        
    
})

const SERVER = "http://localhost:8000"

//function for post data to server
function postData(data){
   return fetch(`${SERVER}/post`,{
        method:'POST',
        mode: "cors",
        headers:{
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": SERVER,
        },
        body:JSON.stringify(data)
    })
    .then(()=>console.log("success"))
    .catch(err=>console.log("Error in postData", err))
}
//function to get data from server
function getData(){
   return fetch(`${SERVER}/get`,{
        method:'GET',
        mode: "cors",
        headers:{
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": SERVER,
        }
    })
    .then(res=>res.json())
    .catch(err=>console.log("Error in getData", err))
}
//api request for weather
function api_request_for_weather (api_key,city){
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${api_key}&units=metric`)
        .then(res=>res.json())
        .catch(err=>console.log("error in request weather:",err))
}
//api request for location
function api_for_location (api_key,zip){
    return fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip},DE&appid=${api_key}`)
            .then(res=>res.json())
            .catch(err=>console.log("error in api_loc:", err))

}
// function for updateing UI with data from server
function update_content(data){
    
    content.innerText="";
    const ente =  data.entrys.map((item) =>{
            const LI = document.createElement('LI');
            LI.innerText = `Date : ${item.date} // Comment : ${item.user_response} // Temperatur : ${item.temperature} Celsius`;
            return LI  

    })

    
    for(let i = ente.length-1; i>=0 ;i--){
        
        content.appendChild(ente[i]);
        
        
    }
}
// updating UI everytime site is refreshed
getData()
.then(res=>update_content(res))
.catch(err=>("error in click event:", err))
