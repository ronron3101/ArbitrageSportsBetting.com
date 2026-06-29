
function implied(o){return 1/Number(o)}
function calc(){
 const total=Number(document.getElementById('stake').value||0);
 const odds=[Number(document.getElementById('oddsA').value||0),Number(document.getElementById('oddsB').value||0),Number(document.getElementById('oddsC').value||0)].filter(x=>x>1);
 const out=document.getElementById('calcResult');
 if(total<=0||odds.length<2){out.innerHTML='Enter total stake and at least two decimal odds above 1.00.';return}
 const inv=odds.map(implied); const sum=inv.reduce((a,b)=>a+b,0); const arb=(1-sum)*100;
 const stakes=odds.map(o=>total*(1/o)/sum); const returns=stakes.map((s,i)=>s*odds[i]); const profit=returns[0]-total;
 let html=`<strong>${arb>0?'Arbitrage found':'No arbitrage'}</strong><br>Book percentage: ${(sum*100).toFixed(2)}%<br>Expected profit: ${profit>=0?'+':''}$${profit.toFixed(2)} (${(profit/total*100).toFixed(2)}%)<br><br>`;
 html+=stakes.map((s,i)=>`Outcome ${i+1}: stake $${s.toFixed(2)} at ${odds[i].toFixed(2)}`).join('<br>');
 out.innerHTML=html;
}
document.addEventListener('input',e=>{if(e.target.closest('.calc'))calc()});document.addEventListener('DOMContentLoaded',calc);
