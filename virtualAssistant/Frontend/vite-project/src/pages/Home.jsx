import React, {     useContext, useEffect, useRef, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
 function Home(){
   const {userData,serverUrl,setUserData,getGroqResponse}=useContext(userDataContext)
   const navigate=useNavigate()
   const[listening,setListening]=useState(false) //* speak kae time par recognition ruk jaaye uske liye state banayenge
   const [userText,setUserText]=useState("")//* user input text
   const [aiText,setAiText]=useState("")//*and response text
   const isSpeakingRef=useRef(false)//* it will check speaking ho rahi h ya nhi
   const recognitionRef=useRef(null)//* recognition class kae hisab sae
   const [ham,setHam]=useState(false)//* using toggle to cross 
   const isRecognizingRef=useRef(false)
   const synth= window.speechSynthesis

    const handleLogOut=async ()=>{
        try{
          const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})//* yaha backend ko logout request bej rahe h
          setUserData(null)
          navigate("/signin")
        }
        catch(error){
            setUserData(null)
            console.log(error)
        }
    }

    const startRecognition=()=>{
        if(!isSpeakingRef.current&&!isRecognizingRef.current){
        try{
           recognitionRef.current?.start();
           //setListening(true);
        }catch(error){
              if(!error.message.includes("start")){
                console.error("Recognition error:", error);
              }
        }
    }
    }
    
    const speak=(text)=>{//* here we convert text to speech like ai answered in text we convert the text in speech okk.
      const utterence=new SpeechSynthesisUtterance(text)//* utterence convert the text to speech in a best manner for speak.
       utterence.lang = 'hi-IN';//* this is for voice in hindi.
      const voices =window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }
      isSpeakingRef.current=true;
      utterence.onend=()=>{
        setAiText("")
        isSpeakingRef.current=false;
        setTimeout(() => {
            startRecognition();//* delay sae race condition avoid hoti h 
        }, 800);
        //startRecognition();
        //recognitionRef.current?.start();
      }
      synth.cancel();//* pahle sae koi speech ho to band karo 
        synth.speak(utterence)
    }

    const handleCommand=(data)=>{
     const {type,userInput,response}=data;
     speak(response);
     if (type === 'google-search') {
      const query = encodeURIComponent(userInput);//* userinput ko formatted way mae convert karke query mae dal dega.
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
       //window.location.href =`https://www.google.com/search?q=${query}`;
    }
     if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
      //window.location.href =`https://www.google.com/search?q=calculator`;
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
      //window.location.href =`https://www.instagram.com/`;
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
     //window.location.href =`https://www.facebook.com/`;
    }
     if (type ==="weather-show") {
     window.open(`https://www.google.com/search?q=weather`, '_blank');
      // window.location.href =`https://www.google.com/search?q=weather`;
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    // const query = encodeURIComponent(userInput);
    // window.location.href =`https://www.youtube.com/results?search_query=${query}`;
    }
    }

    useEffect(()=>{
     
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
      
        const recognition=new SpeechRecognition();
        recognition.continuous=true;
        recognition.lang='en-US'
        recognition.interimResults=false;
        recognitionRef.current=recognition;

        //const isRecognizingRef={current:false}
        let isMounted=true;//* falg to avoid setState on unmounted component 

        //* Start recognition after 1 second delay only if Component still mounted

        const startTimeout = setTimeout(() => {
            if(isMounted&&!isSpeakingRef.current&&!isRecognizingRef.current){
                try{
                       recognition.start();
                       console.log("Recognition requested to start");
                }catch(e){
                    if(e.name!=="InvalidStateError"){
                        console.error(e);
                    }
                }
            }
        },1000);
//         const safeRecognition=()=>{
//             if(!isSpeakingRef.current&&!isRecognizingRef.current){
//                 try{
//                      recognition.start();
//                      console.log("Recognition requested to start")
//                 }
//         catch(err){
//             if(err.name!=="InvalidStateError"){
//                 console.error("Start error:",error)
//             }
//         }
//     }
// }


recognition.onstart = () => { //* jaise hi recognition start hoga tabhi run hoga yae okk.
   // console.log("Recognition started")
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    //console.log("Recognition ended")
    isRecognizingRef.current = false;
    setListening(false);
    if(isMounted&&!isRecognizingRef.current){
        setTimeout(() => {
            if(isMounted){
                try{
                  recognition.start();
                }catch(e){
                   if(e.name!=="InvalidStateError") console.error(e);
                }
            }
        },1000);
    }
}

recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if(event.error!=="aborted"&&isMounted&&!isSpeakingRef.current){
      setTimeout(() => {
       if(isMounted){
        try{
                recognition.start();
                console.log("recognition restarted after the error");
        }catch(e){
              if(e.name!=="InvalidStateError") console.error(e);
        }
       }
      }, 1000);
    }
  };

        recognition.onresult=async (e)=>{
            const transcript=e.results[e.results.length-1][0].transcript?.trim();
            if (!transcript) return;
        console.log("heard : " + transcript)

        if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
            setAiText("");
            setUserText(transcript);//* jo bhi input lae rhe ho woo yaha par daldo okk.
            recognition.stop();//* jab response bej rahe h us time par recognition naa kaare.
            isRecognizingRef.current=false;
            setListening(false);
            const data=await getGroqResponse(transcript);
            console.log(data.data);
            //speak(data.data.response);
            handleCommand(data.data)
            setAiText(data.data.response)
            setUserText("")
        }
    } 
    // const fallback=setInterval(()=>{
    //     if(!isSpeakingRef.current&&!isRecognizingRef.current){
    //         safeRecognition();
    //     }
    // },10000)
    //safeRecognition();
       // recognition.start();

       
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
   
    window.speechSynthesis.speak(greeting);
       return ()=>{
        isMounted=false;
        clearTimeout(startTimeout);
          recognition.stop();
          setListening(false)
          isRecognizingRef.current=false;
          //clearInterval(fallback)
       }
    },[])

    return(
        <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] oveflow-hidden'>
          <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={()=>setHam(true)}/>
          
          <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham?"translate-x-0":"translate-x-full"} transition-transform`}>
            <RxCross1 className='text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'  onClick={()=>setHam(false)}/>
            <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer'
        onClick={handleLogOut}>
            Log Out
        </button>
        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer'
        onClick={()=>navigate("/customize")}>
            Customize Your Assistant
        </button>

        <div className='w-full h-[2px] bg-gray-400'></div>
            <h1 className='text-white font-semibold text-[19px]'>History</h1>

            <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
                {userData.history?.map((his)=>(
                    <span className='text-gray-200 text-[18px]'>{his}</span>
                ))}
            </div>
            </div>

        <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold hidden lg:block bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] cursor-pointer'
        onClick={handleLogOut}>
            Log Out
        </button>
        <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer hidden lg:block'
        onClick={()=>navigate("/customize")}>
            Customize Your Assistant
        </button>

        <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
            <img src={userData?.assistantImage} alt="" className='h-full object-cover '/>
        </div>
        <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
        {!aiText &&  <img src={userImg} alt="" className='w-[200px]'/>}
         {aiText &&  <img src={aiImg} alt="" className='w-[200px]'/>}
         <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText?userText:aiText?aiText:null}</h1>
        </div>
    )
 }
 export default Home;