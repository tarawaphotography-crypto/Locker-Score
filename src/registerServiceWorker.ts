// Register service worker (if available)
export default function registerServiceWorker(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js').catch(()=>{})
  }
}
