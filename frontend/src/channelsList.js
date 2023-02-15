import React from 'react';

export default function ChannelList({youtubers, displayAmount}) {
    if(youtubers != false)
    {
        return (
            <>
            {
            youtubers.listChannels.slice(0, displayAmount).map((youtuber, i) => (
                <div className='channelBox' key={i}>
                  <img src={youtuber[2]}/>
                  <h2>{youtuber[0]}</h2>
                  <p>&nbsp; {youtuber[1]}</p>
                  <p className='overlap'>{parseInt(youtuber[3]/youtubers.channelsChecked*100)}%</p>
                </div>
              ))}
            </>
        );
    }
  }