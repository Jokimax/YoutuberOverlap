const express = require('express');
const bodyParser = require('body-parser');
const eventEmitter = require('events');

const event = new eventEmitter();
const app = express();
const apiKey="&key="+"[YOUTUBE_API_KEY]";
const baseUrl = "https://youtube.googleapis.com/youtube/v3";
app.use(bodyParser.json());

let channelsChecked = 0;
let x=0;
let n=0;
let subs = [];

app.post('/', async (req, res)=> {
    channelsChecked = 0;
    n=0;
    subs.length = 0;
    let response;
    if(!req.body)
    {
        return res.status(400).send(JSON.stringify({message:'Enter an username!'}));
    }
    try{
        response = await fetch(baseUrl+"/channels?part=snippet&forUsername="+req.body.youtuber+apiKey)
        .then((response) => response.json());
        response = await fetch(baseUrl+"/commentThreads?part=snippet&allThreadsRelatedToChannelId="+response.items[0].id+"&maxResults=100&order=orderUnspecified"+apiKey)
        .then((response) => response.json());
    }
    catch(error){return res.status(400).send(JSON.stringify({message: 'Enter a valid username!'}));}
    const size = response.pageInfo.totalResults;
    if(size===0){return res.status(400).send(JSON.stringify({message: 'User doesn\'t have any comments!'}));}
    x=size;
    for(let i = 0; i<size; i++){
        getSubs(response.items[i].snippet.topLevelComment.snippet.authorChannelId.value);
    }
    await new Promise(resolve => event.once('gotSubs', resolve));
    subs.sort((a, b) => b[3] - a[3]);
    res.status(200).send(JSON.stringify({listChannels: subs, channelsChecked: channelsChecked}));
});

async function getSubs(id){
    try{
        let userSubs = await fetch(baseUrl+"/subscriptions?part=snippet&channelId="+id+"&maxResults=50"+apiKey)
        .then((response) => response.json());
        if(typeof userSubs.items !== 'undefined')
        channelsChecked++;
        while(true){
            userSubs.items.forEach(item => {
                addChannel(item.snippet);
            });
            userSubs = await fetch(baseUrl+"/subscriptions?part=snippet&channelId="+id+"&maxResults=100&pageToken="+userSubs.nextPageToken+apiKey)
            .then((response) => response.json());
        }
    }
    catch(error){}
    x--;
    if(x==0)
    {
        event.emit('gotSubs');
    }
}

async function addChannel(content){
    const temp=subs.findIndex(function checkPos(values) {
        return values[0] == content.title;
    });
    if(temp==-1){
        subs[n]=[content.title, content.description, content.thumbnails.default.url, 1];
        n++;
    }
    else{
        subs[temp][3]++;
    }
}

app.listen(5000)