import React, {useState} from 'react';

export default function Search({sendChannels}) {
    const [youtuber, setYoutuber] = useState();
    const [errorMessage, setError] = useState();
    const [loading, setLoading] = useState();

    async function sendInput(){
        setLoading("Loading...");
        setError();
        const response = await fetch("/",
        {        
            method: "POST",
            headers: {
            "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                youtuber: youtuber
            })
        }).then((response) => response.json());
        if(typeof response.message !== 'undefined')
        setError(response.message);
        else
        sendChannels(response);
        setLoading("");
    }

    return (
      <div className='search'>
      <input className='searchBar' type="text" placeholder="Enter a channel" onChange={(e) => setYoutuber(e.target.value)}></input>
      <input className='searchInput' type="submit" value="Submit" onClick={() => sendInput()}></input>
      <h1>{loading}</h1>
      <h2 style={{color: "red"}}>{errorMessage}</h2>
      </div>
    );
  }