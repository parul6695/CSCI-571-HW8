//import axios from 'axios';
const axios = require('axios');
const express = require('express');
var cors = require('cors')
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

const users = [];
const url_fix="https://image.tmdb.org/t/p/w500";
const v_key="https://www.youtube.com/watch?v=";

///
// line 10 will be used on build at the end
app.use(express.static(process.cwd()+"/Movie-Search/dist/Movie-Search/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
  
});
 
app.get('/', (req,res) => {
  
  res.sendFile(process.cwd()+"/Movie_Search/dist/Movie-Search/index.html")
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/user', (req, res) => {
  const user = req.body.user;
  users.push(user);
  res.json("user addedd");
});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
//Multi search result route: 4.1.1
app.get('/api/search/:type',function(req,res){
  console.log(req.params.type)
  axios.get(`https://api.themoviedb.org/3/search/multi?api_key=f84c4909010406c228879baf16458a2d&language=en-US&query=${req.params.type}`)
  .then(response => {
    top_7={};
    all_s=response.data.results;
    curr_search= new Array();
    c=0;

    for(i=0;i<all_s.length;i++){
        sing={};
        if(all_s[i]["media_type"]==='people')
        { 
          continue;
        }
        sing["id"]=all_s[i]["id"];
        if (all_s[i]["media_type"]==='tv'){
          sing["name"]=all_s[i]["name"];
        }
        else {
          sing["name"]=all_s[i]["title"];
        }
        sing["backdrop_path"]=url_fix+all_s[i]["backdrop_path"];
        sing["media_type"]=all_s[i]["media_type"];
        curr_search.push(sing);
        console.log(sing);
        c++
        if(c==7){
          break;
        }
    };
    top_7["search_res"]=curr_search
    console.log("parul search");
    console.log(top_7["search_res"]);
    res.send(top_7);
    })
  .catch(err=>{
      res.send(err)
  });
});


//Trending Movies Route: 4.1.2
app.get('/api/trendingMovie',function(req,res){
  axios.get("https://api.themoviedb.org/3/trending/movie/day?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    top_tm20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_tm20["tm20"]=curr_top
  console.log("parul toptm20");
  console.log(top_tm20["tm20"]);
  res.send(top_tm20);})
  .catch(err=>{
      res.send(err)
  });
});


//Top-Rated Movies Endpoint: 4.1.3
app.get('/api/topRated',function(req,res){
  axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    top_r20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_r20["tr20"]=curr_top
  console.log("parul topr20");
  console.log(top_r20["tr20"]);
  res.send(top_r20);  
  })
  .catch(err=>{
      res.send(err)
  });
});


//Currently playing Movies Endpoint: 4.1.4
app.get('/api/currentPMovie',function(req,res){
  axios.get("https://api.themoviedb.org/3/movie/now_playing?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    all={};
    now_playing_array= new Array();
    console.log("parul");
    //console.log("hiiiiiiiiiii",rense);
    f_d=response.data.results;
    var furl ="https://image.tmdb.org/t/p/original";
    for(var t=0;t<5;t++) {
      element_data={};
      console.log(f_d[t]["backdrop_path"]);
      f_d[t]["backdrop_path"]=furl+f_d[t]["backdrop_path"];
      console.log("modify fd",f_d[t]["backdrop_path"]);
      element_data["backdrop_path"]=f_d[t]["backdrop_path"];
      element_data["id"]=f_d[t]["id"];
      element_data["title"]=f_d[t]["title"];
      now_playing_array.push(element_data);
      console.log(now_playing_array);
    }
    all["now_playing"]=now_playing_array;
    console.log(all["now_playing"]);
    res.send(all);
    //res.json(response.data);
  })
  .catch(err=>{
      res.send(err)
  });
});
//4.1.5 Popular Movies Endpoint
app.get('/api/PopMovies',function(req,res){
  axios.get("https://api.themoviedb.org/3/movie/popular?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    top_popm20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_popm20["popm20"]=curr_top
  //console.log(top_popm20["popm20"]);
  //console.log("parul popm20");
  res.send(top_popm20); })
  .catch(err=>{
      res.send(err)
  });
});

//4.1.6 Recommended Movies Endpoint: "Need parameter"
app.get('/api/RecMovies/:mid',function(req,res){
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid}/recommendations?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    top_recm20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_recm20["recm20"]=curr_top
  console.log(top_recm20["recm20"]);
  console.log("parul recm20");
  res.send(top_recm20);})
  .catch(err=>{
      res.send(err)
  });
});

//4.1.7 Similar Movies Endpoint
app.get('/api/similarMovies/:mid1',function(req,res){
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid1}/similar?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    top_sim20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_sim20["sim20"]=curr_top
  console.log(top_sim20["sim20"]);
  console.log("parul sim20");
  res.send(top_sim20);})
  .catch(err=>{
      res.send(err)
  });
});

//4.1.8 Movies Video Endpoint
app.get('/api/movieVideos/:mid2',function(req,res){
  //https://api.themoviedb.org/3/movie/464052/videos?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US&page=1
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid2}/videos?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    movie_vs={};
    all_s=response.data.results;
    curr_top= new Array();
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["title"]=all_s[i]["title"];
      sing["name"]=all_s[i]["name"];
      sing["type"]=all_s[i]["type"];
      sing["key"]=v_key+all_s[i]["key"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
   };
   movie_vs["vs"]=curr_top
  res.send(movie_vs);})
  .catch(err=>{
      res.send(err)
  });
});


//4.1.9 Movie Details Endpoint
app.get('/api/movieDetails/:mid',function(req,res){
  //https://api.themoviedb.org/3/movie/464052/videos?api_key=97588ddc4a26e3091152aa0c9a40de22&language=en-US&page=1
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid}?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    //movie_det={};
    all_s=response.data;
    curr_gen= new Array();
    spoken_lang= new Array();
      //for(i=0;i<all_s.length;i++){
      sing={};
      sing["title"]=all_s["title"];
      for(i=0;i<all_s["genres"].length;i++){
      curr_gen.push(all_s["genres"][i]["name"]);
      }
      sing["genres"]=curr_gen;
      for(i=0;i<all_s["spoken_languages"].length;i++){
        spoken_lang.push(all_s["spoken_languages"][i]["english_name"]);
        }
        sing["spoken_languages"]=spoken_lang;
      sing["release_date"]=all_s["release_date"];
      sing["runtime"]=all_s["runtime"];
      sing["overview"]=all_s["overview"];
      sing["vote_average"]=all_s["vote_average"];
      sing["tagline"]=all_s["tagline"];
      //sing["overview"]=all_s["overview"];
      //sing["media_type"]=all_s[i]["media_type"];
      //curr_top.push(sing);
   //movie_det["md"]=sing;
  res.send(sing);})
  .catch(err=>{
      res.send(err)
  });
});

//4.1.10 Movie Reviews Endpoint
app.get('/api/movieReviews/:mid3',function(req,res){
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid3}/reviews?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    mr={};
    //console.log(response.data.results);
    all_s=response.data.results;
    //console.log("daaaa",all_s[0]);
    curr_top= new Array();
    for(i=0;i<all_s.length;i++){
      sing={};
      sing["author"]=all_s[i]["author"];
      sing["content"]=all_s[i]["content"];
      if( !('avatar_path' in all_s[i]['author_details']) || all_s[i]['author_details']['avatar_path']==null || all_s[i]['author_details']["avatar_path"]==="" || all_s[i]['author_details']["avatar_path"]==="null" || all_s[i]['author_details']["avatar_path"]===undefined || all_s[i]['author_details']["avatar_path"]===" ")
      {
        sing["avatar_path"]="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU";
      }
      else{
        sing["avatar_path"]="https://image.tmdb.org/t/p/original"+all_s[i]["author_details"]["avatar_path"];
      }
      console.log(i,sing["avatar_path"]);
      sing["created_at"]=all_s[i]["created_at"];
      sing["url"]=all_s[i]["url"];
      sing["rating"]=all_s[i]["author_details"]["rating"];
      curr_top.push(sing);
      console.log("currrr",curr_top);
    }
  mr["mrs"]=curr_top
  console.log(mr["mrs"]);
  console.log("parulmr");
  res.send(mr);})
  .catch(err=>{
      res.send(err)
  });
});

//4.1.11 Movie Cast Endpoint
app.get('/api/movieCast/:mid4',function(req,res){
  axios.get(`https://api.themoviedb.org/3/movie/${req.params.mid4}/credits?api_key=f84c4909010406c228879baf16458a2d&language=en-US&page=1`)
  .then(response => {
    mc={};
    //console.log(response.data.cast);
    all_s=response.data.cast;
    //console.log("daaaa",all_s[0]);
    curr_top= new Array();
    for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["name"]=all_s[i]["name"];
      console.log(i,sing);
      if( !('profile_path' in all_s[i]) || all_s[i]['profile_path']==null || all_s[i]["profile_path"]==="" || all_s[i]["profile_path"]==="null" || all_s[i]["profile_path"]===undefined || all_s[i]["profile_path"]===" ")
      {console.log(i,sing["profile_path"]);
        continue;
        //sing["avatar_path"]="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHnPmUvFLjjmoYWAbLTEmLLIRCPpV_OgxCVA&usqp=CAU";
      }
      else{
        sing["profile_path"]="https://image.tmdb.org/t/p/w500"+all_s[i]["profile_path"];
      }
      console.log(i,sing["profile_path"]);
      sing["character"]=all_s[i]["character"];
      curr_top.push(sing);
      console.log("currrr",curr_top);
    }
  mc["mcs"]=curr_top
  console.log(mc["mcs"]);
  console.log("parulmc");
  res.send(mc);})
  .catch(err=>{
      res.send(err)
  });
});

////////////////////// TV ENDPOINTS //////////////////////////////////

//4.1.12 Trending TV Shows Endpoint
app.get('/api/trendingTV',function(req,res){
  axios.get("https://api.themoviedb.org/3/trending/tv/day?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    top_tv20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_tv20["tm20"]=curr_top
  console.log("parul toptm20");
  console.log(top_tm20["tm20"]);
  res.send(top_tm20);})
  .catch(err=>{
      res.send(err)
  });
});


//Top-Rated Movies Endpoint: 4.1.3
app.get('/api/topRated',function(req,res){
  axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=f84c4909010406c228879baf16458a2d")
  .then(response => {
    top_r20={};
    all_s=response.data.results;
    curr_top= new Array();
    c=0;
    while(c<20) { 
      for(i=0;i<all_s.length;i++){
      sing={};
      sing["id"]=all_s[i]["id"];
      sing["title"]=all_s[i]["title"];
      sing["poster_path"]=url_fix+all_s[i]["poster_path"];
      //sing["media_type"]=all_s[i]["media_type"];
      curr_top.push(sing);
      c++;
   };
  };
  top_r20["tr20"]=curr_top
  console.log("parul topr20");
  console.log(top_r20["tr20"]);
  res.send(top_r20);  
  })
  .catch(err=>{
      res.send(err)
  });
});