(this["webpackJsonpwheres-waldo"]=this["webpackJsonpwheres-waldo"]||[]).push([[0],{14:function(e,a,t){},19:function(e,a,t){"use strict";t.r(a);var n=t(2),l=t.n(n),o=t(8),r=t.n(o);t(14);var c=e=>{let{children:a,className:t,direction:n,align:o,justify:r,gap:c}=e;return l.a.createElement("div",{className:t,style:{display:"flex",flexDirection:n,alignItems:o,justifyContent:r,gap:c}},a)};var s=()=>l.a.createElement(c,{justify:"center"},l.a.createElement("input",{className:"install-button",type:"button",onClick:()=>window.location.href="oauth/install",value:"Install In HubSpot"}));var i=()=>l.a.createElement(c,{className:"header",align:"center",direction:"column"},l.a.createElement("img",{src:"/waldo.png",style:{width:"85px"},alt:"waldo"}),l.a.createElement("span",{className:"p-bottom-10"},"Where's Waldo HubSpot App"),l.a.createElement(s,null));var m=()=>l.a.createElement(c,{className:"info-section"},l.a.createElement("span",{className:"p-bottom-10"},"Installing this app in your HubSpot account will automatically hide Waldo on one of your contacts using a custom property. Look for the Where's Waldo CRM card that will appear on each of your contacts. Make sure to mark Waldo as found whenever you find him! Marking him as found will update your score and then randomly hide Waldo on another one of your contacts.")),d=t(21);var u=()=>{const[e,a]=Object(n.useState)([]);Object(n.useEffect)(()=>{t()},[]);const t=async()=>{try{const{data:e}=await d.a.get("/api/leaderboard");a(e.sort((e,a)=>a.score-e.score))}catch(e){console.log(e)}},o=(e,a)=>{const t=e.id.split(":")[0];return l.a.createElement(c,{key:a,className:"leaderboard-card",gap:"20px",align:"center"},l.a.createElement("div",{className:"leaderboard-rank"},l.a.createElement("h2",null,"#",a+1)),l.a.createElement(c,{direction:"column",gap:"5px"},l.a.createElement("h3",null,e.username||e.email),l.a.createElement("span",null,"found Waldo ",e.score," time",1===e.score?"":"s"," in (",t,")")))};return l.a.createElement(c,{className:"leaderboard",align:"center",direction:"column"},l.a.createElement("h1",null,"Top Waldo Finders"),l.a.createElement("span",{className:"p-bottom-10",style:{width:"70%"}},"Join the Waldo finding leaderboard by installing the app and using the dropdown action in the Where's Waldo CRM card!"),l.a.createElement(c,{className:"w-100",direction:"column",align:"center"},e.map(o)))};var p=()=>l.a.createElement(c,{className:"app",direction:"column"},l.a.createElement(i,null),l.a.createElement("div",{className:"content"},l.a.createElement(m,null),l.a.createElement(u,null)));r.a.render(l.a.createElement(p,null),document.getElementById("root"))},9:function(e,a,t){e.exports=t(19)}},[[9,1,2]]]);
//# sourceMappingURL=main.cae48ccb.chunk.js.map