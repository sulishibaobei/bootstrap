/**
 * Created by uidp4983 on 2016/12/22.
 */
/**
 *
 */
var index=0;
var mytime;
function show(num){
   if(Number(num)){
      index=num;
      clearInterval(mytime);
   }else{
      index=index%5+1;
   }
   $("#showPic").attr("src","images/"+index+".jpg");
}

function start(){
   mytime=window.setInterval("show()",1000);
}
mytime=setInterval("show()",1000);

/**
 * 画布
 */
$(function(){
   var AudioContext=window.AudioContext||window.webkitAudioContext;
   var context=new AudioContext;
//从元素创建媒体节点
   var source=context.createMediaElementSource(audio);
//创建脚本处理节点
   var analyser=context.createAnalyser();
//Canvas初始化
   var canvas=document.getElementById("canvas");
   var width=canvas.width,height=canvas.height;
   var g=canvas.getContext("2d");

   g.translate(0.5,height/2+0.5);
//连接：source → analyser → destination
   source.connect(analyser);
   analyser.connect(context.destination);
//以fftSize为长度创建一个字节数组作为数据缓冲区
   var output=new Uint8Array(analyser.fftSize);
//播放帧
   (function callee(e){
      analyser.getByteTimeDomainData(output);
      //将缓冲区的数据绘制到Canvas上
      g.clearRect(-0.5,-height/2-0.5,width,height);
      g.beginPath();
      for(var i=0;i<width;i++)
         g.lineTo(i,height/2*(output[output.length*i/width|0]/256-0.5));
      g.stroke();
      g.strokeStyle = "#CCCCCC";
    g.lineWidth = 10;
      //请求下一帧
      requestAnimationFrame(callee);
   })()
});

/**
 * 计算签名的  1.计算公共参数  注意按首字母大小写的顺序  暂时省略
 */
/**
 * 计算token-access
 */
function getAccessToken() {
   $.ajax({
      dataType: 'JSONP',
      url: 'http://localhost:1053',
      method: 'POST',
      data: {},
      success: function (data) {
         var data = JSON.parse(data);
         var str = data["access_token"];
         if (str == undefined) {
         } else {
            localStorage.setItem('access', str);
         }
      },
      error: function (error) {
      }
   });
}
getAccessToken();
/**
 * 获取喜马拉雅内容计算签名参数
 */
function getSecondSig() {
   var access = localStorage.getItem('access');
   var str = "access_token=" + access + "&app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb";
   var words = CryptoJS.enc.Utf8.parse(str);
   var base64 = CryptoJS.enc.Base64.stringify(words);
   var key = "a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1 = CryptoJS.HmacSHA1(base64, key);
   var md5 = CryptoJS.MD5(hmacsha1);
   var md= md5.toString();
  localStorage.setItem('内容分类签名', md);
}
/**
 获取喜马拉雅内容分类
 */
getSecondSig();
loadXMLDoc();

function loadXMLDoc() {
   var md = localStorage.getItem("内容分类签名");
   var access = localStorage.getItem('access');
   var xmlhttp;
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var data = JSON.parse(xmlhttp.responseText);
         var dataLength = data.length;
         var temp = "";
         var ul = document.getElementById("fenul");
         var myul=document.createElement("li");
         myul.setAttribute("class","fenli");
         myul.setAttribute("id","fenli");
         myul.innerHTML= '热门'+"<span class='fenspan'>  > </span>";
         ul.appendChild(myul);
         for (var i = 0; i <dataLength; i++) {
            var obj = data[i];
            temp =obj.category_name + "<br/>";
            var li= document.createElement("li");
            li.setAttribute("class","fenli");
            li.setAttribute("id","fenli"+i);
            var c=ul.appendChild(li);
            ul.lastChild=c;
            c.innerHTML=temp + "<span class='fenspan'>  > </span>";
            document.getElementById("fenli").style.background="#FF6800";
            document.getElementById("fenli").style.color="white";
            document.getElementsByClassName("fenspan")[0].style.color="#FF6800";
         }

        var fenli0=ul.childNodes[2];
         fenli0.addEventListener("mouseover",function(){
            document.getElementById("tag").innerHTML=""
             test();
            document.getElementById("tag").style.display="block";
         },false);
         fenli0.addEventListener("mouseout",function(){
            document.getElementById("tag").innerHTML=""
            document.getElementById("tag").style.display="none";
         },false);
         var fenli1=ul.childNodes[3];
         fenli1.addEventListener("mouseover",function(){
            document.getElementById("tag").innerHTML="";
            test1();
            document.getElementById("tag").style.display="block";
         },false);
         fenli1.addEventListener("mouseout",function(){
            document.getElementById("tag").innerHTML=""
            document.getElementById("tag").style.display="none";
         },false);
      }
   }
   xmlhttp.open("GET", "http://api.ximalaya.com/categories/list?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+ access +"&sig=" + md, true);
   xmlhttp.send();
}




/**
 * 热门电台计算签名
 */
getRemneSig();
function   getRemneSig() {
   var access = localStorage.getItem('access');
   var str = "access_token=" + access + "&app_key=8a6ac9fa6af234963329f674d3513f95&calc_dimension=1&category_id=0&client_os_type=3&device_id=myweb";
   var words = CryptoJS.enc.Utf8.parse(str);
   var base64 = CryptoJS.enc.Base64.stringify(words);
   var key = "a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1 = CryptoJS.HmacSHA1(base64, key);
   var md5 = CryptoJS.MD5(hmacsha1);
   var md = md5.toString();
   localStorage.setItem("xr",md);
}
/**
 *获取热门电台
 */
loadXMLDocRenmen();
function  loadXMLDocRenmen() {
   var xr=localStorage.getItem("xr");
   var access = localStorage.getItem('access');
   var xmlhttp;
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var data=JSON.parse(xmlhttp.responseText);
         var albums=data["albums"];
         var length=albums.length;
         var temp="";
         var div=document.createElement("div");
         var rmdt=document.getElementById("rmdt");
         var my=rmdt.appendChild(div);
         div.setAttribute("id","remenLi");
         var myDiv=document.getElementById("remenLi");
         for(var i = 0; i < length; i++){
            var obj = albums[i];
            localStorage.setItem("albumsid"+i,obj.id);
            var img=document.createElement("img");
            myDiv.appendChild(img);
            img.setAttribute("class","yuan");
            var temp=obj.announcer;
            img.setAttribute("src",temp["avatar_url"]);
            var name=document.createElement("a");
            myDiv.appendChild(name);
            name.setAttribute("class","zhubo");
            myDiv.getElementsByTagName("a")[i].innerHTML=temp["nickname"];
            var span=document.createElement("span");
            myDiv.appendChild(span);
            span.setAttribute("class","span");
            var favo=document.createElement("p");
            myDiv.appendChild(favo);
            favo.setAttribute("class","fensi");
            myDiv.getElementsByTagName("p")[i].innerHTML=obj.play_count+"<br/>";
            }
            for(var i=0;i<3;i++){
               var tuijianbox=document.createElement("div");
               var third=document.getElementById("third");
               tuijianbox.setAttribute("class","tuijianbox");
               var box=third.appendChild(tuijianbox);
               var obj = albums[i];
               var img=document.createElement("img");
               box.appendChild(img);
               img.setAttribute("class","tuijianimg");
               img.setAttribute("src",obj.cover_url_large);
               var tuijiantitle=document.createElement("span");
               tuijiantitle.setAttribute("class","tuijiantitle");
               tuijiantitle.setAttribute("id","tuijiantitle"+i);
               box.appendChild(tuijiantitle);
               var b=obj.album_title;
               document.getElementById("tuijiantitle"+i).innerHTML=b;
               var tracktitle=document.createElement("a");
               tracktitle.setAttribute("class","tracktitle");
                tracktitle.setAttribute("id","tracktitle"+i);
               box.appendChild(tracktitle);
               var lastuptrack=obj.last_uptrack;
               document.getElementById("tracktitle"+i).innerHTML=lastuptrack["track_title"];
               var nickname=document.createElement("a");
               nickname.setAttribute("class","nickname");
               nickname.setAttribute("id","nickname"+i);
               box.appendChild(nickname);
               var announcer=obj.announcer;
               document.getElementById("nickname"+i).innerHTML="by:"+announcer["nickname"];
               var information=document.createElement("li");
               information.setAttribute("class","information");
               box.appendChild(information);
               var f1=document.createElement("span");
               f1.setAttribute("class","f1");
               f1.setAttribute("id","f1"+i);
               information.appendChild(f1);
               document.getElementById("f1"+i).innerHTML=obj.play_count;
               var f2=document.createElement("span");
               f2.setAttribute("class","f2");
               f2.setAttribute("id","f2"+i);
               information.appendChild(f2);
               document.getElementById("f2"+i).innerHTML=obj.favorite_count;
               var f3=document.createElement("span");
               f3.setAttribute("class","f3");
               f3.setAttribute("id","f3"+i);
               information.appendChild(f3);
               document.getElementById("f3"+i).innerHTML="12";
               var bofan=document.createElement("span");
               bofan.setAttribute("class","bofan");
               box.appendChild(bofan);
            }
           var fendiv=document.getElementById("fendiv");

          for(var i = 0; i < 12; i++) {
             var obj = albums[i];
            var diantaibox=document.createElement("div");
             diantaibox.setAttribute("class","diantaibox");
             diantaibox.setAttribute("id","diantaibox"+i);
             fendiv.appendChild(diantaibox);
             var diantai=document.getElementById("diantaibox"+i);
             var img=document.createElement("img");
             diantai.appendChild(img);
             img.setAttribute("class","tuijianimg");
             img.setAttribute("id","diantaiimg"+i);
             img.setAttribute("src",obj.cover_url_large);
             var diantaicomment=document.createElement("span");
             diantaicomment.setAttribute("class","diantaicomment");
             diantaicomment.setAttribute("id","diantaicomment"+i);
             diantai.appendChild(diantaicomment);
             document.getElementById("diantaicomment"+i).innerHTML=obj.play_count;
             var diantaititle=document.createElement("a");
             diantaititle.setAttribute("class","tracktitle");
             diantaititle.setAttribute("id","diantaititle"+i);
             diantai.appendChild(diantaititle);
             document.getElementById("diantaititle"+i).innerHTML=obj.album_title;
             var diantaif1=document.createElement("a");
             diantaif1.setAttribute("class","nickname");
             diantaif1.setAttribute("id","diantaif1"+i);
             diantai.appendChild(diantaif1);
             var lastuptrack=obj.last_uptrack;
             document.getElementById("diantaif1"+i).innerHTML="<img class='boximg' src='images/bofan.jpg'>"+lastuptrack["track_title"];

          }
      }
   }
   xmlhttp.open("get", "http://api.ximalaya.com/albums/list?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+access+"&category_id=0&calc_dimension=1&sig="+xr, true);
   xmlhttp.send();
}



/**
 * 图片上下滚
 */

//
var speed=50;
var colee2=document.getElementById("demo2");
var colee1=document.getElementById("rmdt");
var colee=document.getElementById("remen");
colee2.innerHTML=colee1.innerHTML; //克隆colee1为colee2
function Marquee1(){
   if(colee.scrollTop>=colee1.offsetHeight){
      colee.scrollTop=0;
   } else {
      colee.scrollTop++;
   }
}
 var MyMar1=setInterval(Marquee1,speed)//设置定时器
// //鼠标移上时清除定时器达到滚动停止的目的
 colee.onmouseover=function() {clearInterval(MyMar1)}
// //鼠标移开时重设定时器
 colee.onmouseout=function(){MyMar1=setInterval(Marquee1,speed)}
/**
 * 控制面板切换
 */
// function changeFace1(){
//    var big=document.getElementById("big");
//    var Onebig=document.getElementById("bigOne");
//    if(Onebig.style.display=="block"){
//       big.style.display="block";
//       Onebig.style.display="none";
//    }

// }
//
// function changeFace2(){
//    var big=document.getElementById("big");
//    var Onebig=document.getElementById("bigOne");
//    if(big.style.display=="block"){
//       big.style.display="none";
//       Onebig.style.display="block";
//    }
// }
function changeFace(id) {
   var big=document.getElementById(id);
   if(id=="big"){
      big.style.display="block";
     document.getElementById("bigOne").style.display="none";
   }else if(id=="bigOne"){
      big.style.display="block";
      document.getElementById("big").style.display="none";
   }
}
/**
 *计算browse签名
 */
getbrowseSig();
function getbrowseSig() {
   var access = localStorage.getItem('access');
   var albumsid0=3519155;
   var str = "access_token=" + access + "&album_id="+albumsid0+"&app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb";
   var words = CryptoJS.enc.Utf8.parse(str);
   var base64 = CryptoJS.enc.Base64.stringify(words);
   var key = "a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1 = CryptoJS.HmacSHA1(base64, key);
   var md5 = CryptoJS.MD5(hmacsha1);
   var md = md5.toString();
   localStorage.setItem("browse",md);
}
/**

 根据专辑
 ID
 获取专辑下的声音列表，即专辑浏览
 */
loadXMLDocbrowse();
function loadXMLDocbrowse() {
   var browse = localStorage.getItem("browse");
   var albumsid0=3519155;
   var access = localStorage.getItem('access');
   var xmlhttp;
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var data = JSON.parse(xmlhttp.responseText);
         var tracks=data["tracks"];
         for (var i = 0; i <tracks.length; i++) {
            var obj=tracks[i];
         }
      }
   }
   xmlhttp.open("GET", "http://api.ximalaya.com/albums/browse?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+ access +"&album_id="+albumsid0+"&sig=" + browse , true);
   xmlhttp.send();
}

function test(){
   var access=localStorage.getItem('access');
   var str="access_token="+access+"&app_key=8a6ac9fa6af234963329f674d3513f95&category_id=3&client_os_type=3&device_id=myweb&type=0";
   var words=CryptoJS.enc.Utf8.parse(str);
   var base64 =CryptoJS.enc.Base64.stringify(words);
   var key="a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1=CryptoJS.HmacSHA1(base64,key);
   var md5=CryptoJS.MD5(hmacsha1);
   var md=md5.toString();
   localStorage.setItem('tagSig',md);
   var tagSig=localStorage.getItem('tagSig');
   var xmlhttp;
   if (window.XMLHttpRequest){
      xmlhttp=new XMLHttpRequest();
   } else{
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
         var data = JSON.parse(xmlhttp.responseText);
         var dataLength = data.length;
         var temp = "";
         var tag=document.getElementById("tag");
         for (var i = 0; i < dataLength; i++) {
            var obj = data[i];
            var taga=document.createElement("a");
            taga.setAttribute("class","taga");
            taga.setAttribute("id","taga"+i);
            tag.appendChild(taga);
            document.getElementById("taga"+i).innerHTML=obj.tag_name;
         }

      }
   }
   xmlhttp.open("GET","http://api.ximalaya.com/tags/list?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+access+"&category_id=3&type=0&sig="+tagSig,true);
   xmlhttp.send();
}

/*
 专辑标签，专栏
 */

function test1(){
   var access=localStorage.getItem('access');
   var str="access_token="+access+"&app_key=8a6ac9fa6af234963329f674d3513f95&category_id=3&client_os_type=3&device_id=myweb&type=0";
   var words=CryptoJS.enc.Utf8.parse(str);
   var base64 =CryptoJS.enc.Base64.stringify(words);
   var key="a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1=CryptoJS.HmacSHA1(base64,key);
   var md5=CryptoJS.MD5(hmacsha1);
   var md=md5.toString();
   localStorage.setItem('tagSig',md);
   var tagSig=localStorage.getItem('tagSig');
   var xmlhttp;
   if (window.XMLHttpRequest){
      xmlhttp=new XMLHttpRequest();
   } else{
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }xmlhttp.onreadystatechange=function(){
      if (xmlhttp.readyState==4 && xmlhttp.status==200){
         var data = JSON.parse(xmlhttp.responseText);
          //console.log(xmlhttp.responseText);
         var dataLength = data.length;
         var temp = "";
         var tag=document.getElementById("tag");
         for (var i = 0; i < dataLength; i++) {
            var obj = data[i];
            var taga=document.createElement("a");
            taga.setAttribute("class","taga");
            taga.setAttribute("id","taga"+i);
            tag.appendChild(taga);
            document.getElementById("taga"+i).innerHTML=obj.tag_name;
         }

      }
   }
   xmlhttp.open("GET","http://api.ximalaya.com/tags/list?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+access+"&category_id=3&type=0&sig="+tagSig,true);
   xmlhttp.send();
}

/**
 * 资讯
 *
 */
loadXMLDocZiXun();
function  loadXMLDocZiXun() {
   var access = localStorage.getItem('access');
   var str = "access_token=" + access + "&app_key=8a6ac9fa6af234963329f674d3513f95&calc_dimension=1&category_id=2&client_os_type=3&device_id=myweb";
   var words = CryptoJS.enc.Utf8.parse(str);
   var base64 = CryptoJS.enc.Base64.stringify(words);
   var key = "a4b8f0e37f026e363578fe275f37f5bc";
   var hmacsha1 = CryptoJS.HmacSHA1(base64, key);
   var md5 = CryptoJS.MD5(hmacsha1);
   var md = md5.toString();
   localStorage.setItem("zx",md);
   var zx=localStorage.getItem("zx");
   var xmlhttp;
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         var data=JSON.parse(xmlhttp.responseText);

         var albums=data["albums"];
         for(var i = 0; i <  9; i++){
           var zixunbox=document.getElementById("zixunbox");
            var zixunli=document.createElement("li");
            zixunli.setAttribute('class',"zixunli");
            zixunbox.appendChild(zixunli);
            var zixunspan=document.createElement("span");
            zixunspan.setAttribute("class","num");
            zixunspan.setAttribute("id","num"+i);
            zixunli.appendChild(zixunspan);
            document.getElementById("num"+i).innerHTML=i+1;
            var zixuna=document.createElement("a");
            zixuna.setAttribute("class","zixun");
            zixuna.setAttribute("id","zixun"+i);
            zixunli.appendChild(zixuna);
             var lastuptrack=albums[i].last_uptrack;
            document.getElementById("zixun"+i).innerHTML=lastuptrack["track_title"];
         }
      }
   }
   xmlhttp.open("get", "http://api.ximalaya.com/albums/list?app_key=8a6ac9fa6af234963329f674d3513f95&client_os_type=3&device_id=myweb&access_token="+access+"&category_id=2&calc_dimension=1&sig="+zx, true);
   xmlhttp.send();

}










