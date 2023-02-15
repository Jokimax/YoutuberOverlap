import React, {useState, useEffect} from 'react';
import Search from './search';
import ChannelList from './channelsList';
import './style.css';

export default function App() {
  const [youtubers, setYoutubers] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(10);

  const getChannels = (channels) => {
    setYoutubers(channels);
    setDisplayAmount(10);
  }

  useEffect(() => {
    const handleScroll = () => {
      const offsetHeight = document.documentElement.offsetHeight;
      const innerHeight = window.innerHeight;
      const scrollTop = document.documentElement.scrollTop;

      if(offsetHeight - (innerHeight + scrollTop) <= 10){
        setDisplayAmount(displayAmount + 10);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <>
    <Search sendChannels={getChannels}/>
    <ChannelList youtubers={youtubers} displayAmount={displayAmount}/>
    </>
  );
}