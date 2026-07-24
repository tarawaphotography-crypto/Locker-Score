const STORAGE_KEY = 'locker-scores-state'

export function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return null
    return JSON.parse(raw)
  }catch(e){return null}
}
export function saveState(state:any){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }catch(e){}
}
export function clearState(){ localStorage.removeItem(STORAGE_KEY) }
