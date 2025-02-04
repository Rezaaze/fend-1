/* Global Variables */
const api_key = "b076b3276229daa59919e693823fcecb";
const api  = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=";
const api_loc = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},us&appid=${api_key}`
// created an empty object for holding variables for the backend
const data = {}
// Create a new date instance dynamically with JS
const d = new Date();
const newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();


// created 2 variables and saved the button element and the content in them
const button = document.getElementById('generate');
const date = document.getElementById('date');
const content =document.getElementById('content');
const temp = document.getElementById('temp');


// added eventlistener to the button 
button.addEventListener("click", (e)=>{
    // saved the value from the textarea and input from zipcode in variables
    const feelings = document.getElementById('feelings');
    const zip = document.getElementById('zip');
    if(!validateZipCode(zip.value)){
        alert("Please Use real 5 digit zipcodes from us only ")
    }

    

    data.date =newDate;
    data.user_response = feelings.value;
    // first api request for getting the location from zipcode 
    
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
        .catch(err=>console.log("Error! :",err))
    })
    .catch(err=>console.log("Error! :" ,err))
       
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
async function api_request_for_weather (api_key,city){
    try{
        let respond = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${api_key}&units=metric`)
        if(respond.ok){
        respond = await respond.json()
        return respond
        }
        else{
            console.log("Error!",respond.status)
        }
    }
    catch(err){
        console.log("error in request weather:",err)
    }
}
//api request for location
function api_for_location (api_key,zip){
    return fetch(`http://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${api_key}`)
            .then(res=>res.json())
            .catch((err)=>console.log("error in api_loc:", err))
    
}
// function for updateing UI with data from server
function update_content(data){
    
    data = data.entrys.pop();
    
    content.innerHTML = 'Felling : '+ data.user_response;
    temp.innerHTML = 'Temperature : '+ data.temperature + " Celsius";
    date.innerHTML = 'Date : ' + data.date;
    

}

function validateZipCode(elementValue){
    let zipCodePattern = /^\d{5}$|^\d{5}-\d{4}$/;
     return zipCodePattern.test(elementValue);
}
// updating UI everytime site is refreshed
getData()
.then(res=>update_content(res))
.catch(err=>("error in click event:", err))
