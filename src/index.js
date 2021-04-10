import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

const PLAY = "PLAY";
const STOP = "STOP";
const TOGGLE = "TOGGLE";
const RESET = "RESET";
const ZERO_EVENT = "ZERO_EVENT";
const TICK = "TICK";
const INCREMENT_BREAK = "INCREMENT_BREAK";
const DECREMENT_BREAK = "DECREMENT_BREAK";
const INCREMENT_SESSION = "INCREMENT_SESSION";
const DECREMENT_SESSION = "DECREMENT_SESSION";


const play = () => ({
  type: PLAY
});
const stop = () => ({
  type: STOP
});
const toggle = () => ({
  type: TOGGLE
})
const reset = () => ({
  type: RESET
})
const zero_event = () => ({
  type: ZERO_EVENT
})
const tick = () => ({
  type: TICK
})
const increment_break = () => ({
  type: INCREMENT_BREAK
});
const decrement_break = () => ({
  type: DECREMENT_BREAK
});
const increment_session = () => ({
  type: INCREMENT_SESSION
});
const decrement_session = () => ({
  type: DECREMENT_SESSION
});

const fillterOper = (state,result) => {
  if(state.play)
    return {...state};
  return {...result};
}
const inithialState = {
  std: true,
  play: false,
  timer: {mm:25,ss:0},
  label: "Session",
  break: 5,
  session: 25
}
const limits = (num) => {
  return num<=0?1:
          num>60?60:
          num;
}
const incrementDecrementBreakSession = (state, 
                                          val, 
                                          num, 
                                          refresh) => {
  const nVal = limits(state[val] + num);
  return {
    ...state,
    [val]: nVal,
    timer: refresh?{mm:nVal,ss:0}: state.timer
  }
}
const endOfTime = (timer) =>{
  return JSON.stringify(timer) ===
  JSON.stringify({mm:0,ss:0})
}
const reducerTimer = (state = inithialState, action) => {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        play: true
      }
    case STOP:
      return {
        ...state,
        play: false
      }
    case RESET:
      return {
        ...inithialState,

      }
    case TOGGLE:
      return state.play?reducerTimer(state,stop()):
              reducerTimer(state,play());
    case ZERO_EVENT:
      const std = !state.std; 
      const label = std?"Session":"Break";
      const timer = std?{mm:state.session,ss:0}:{mm:state.break,ss:0};
      return {
        ...state,
        std,
        label,
        timer,
        play:true
      }
    case TICK:
      if(
        endOfTime(state.timer)
        )
      return reducerTimer(state,zero_event())
      if(state.play)
        return {
          ...state,
          timer:timerDecress(state.timer)
        }
      return{
        ...state
      }
    case INCREMENT_BREAK:
      return fillterOper(state,(
        incrementDecrementBreakSession(
          state,
          'break',
          1,
          !state.std
        )
      ))
    case DECREMENT_BREAK:
      return fillterOper(state,(
        incrementDecrementBreakSession(
          state,
          'break',
          -1,
          !state.std
        )
      ))
    case INCREMENT_SESSION:
      return fillterOper(state,(
        incrementDecrementBreakSession(
          state,
          'session',
          1,
          state.std
        )
      ))
    case DECREMENT_SESSION:
      return fillterOper(state,(
        incrementDecrementBreakSession(
          state,
          'session',
          -1,
          state.std
        )
      ))
    default:
      return {
        ...state
      }
  }
}

const putZero = ( num ) => (
  `${num<=9?`0${num}`:num}`
);
/**
 * 
 * @param {{mm:number,ss:number}} timer 
 * @returns 
 */
const timerToString = ( timer ) => (
  `${putZero(timer.mm)}:${putZero(timer.ss)}`
)
/**
 * 
 * @param {{mm:number,ss:number}} timer 
 * @returns 
 */
 const timerDecress = ( timer ) => (
  {
    mm: (timer.ss-1)===-1?timer.mm-1:timer.mm,
    ss: (timer.ss-1)===-1?59:(timer.ss-1)
  }
)

const mapStateToProps = (state) => ({
  ...state,
  my_break:state.break
})
const mapDispatchToProps = (dispatch) => ({
  play: () => {dispatch(play())},
  stop: () => {dispatch(stop())},
  toggle: () => {dispatch(toggle())},
  reset: () => {dispatch(reset())},
  zero_event: () => {dispatch(zero_event())},
  tick: () => {dispatch(tick())},
  increment_break: () => {dispatch(increment_break())},
  decrement_break: () => {dispatch(decrement_break())},
  increment_session: () => {dispatch(increment_session())},
  decrement_session: () => {dispatch(decrement_session())}
})

const store = createStore(reducerTimer);

/**
 * 
 * @param {{label:string,inc:()=>void,decr:()=>void,num:number}} param0 
 * @returns 
 */
const Opers = ({label, inc, decr, num}) => {

  return (
    <div className="Opers">
      <p className="Oper__label" id={`${label}-label`}>
        {`${label[0].toUpperCase()}${label.substr(1)} Length`}
      </p>
      <div className="Oper__div">
        <button 
        id={`${label}-decrement`}
        onClick={decr}>
          down
        </button>
        <p className="Oper__num" id={`${label}-length`}>
          {num}
        </p>
        <button
        id={`${label}-increment`} 
        onClick={inc}>
          up
        </button>
        
      </div>
    </div>
  )
}

let Display = ({label, timer, toggle, reset}) => {

  const beep = document.querySelector("#beep");
  if(endOfTime(timer)){
    beep.play();
  }
  return (
    <div className="Display">
      <p id="timer-label">
        {label}
      </p>
      <p id="time-left">
        {timerToString(timer)}
      </p>
      <div className="Display__button">
        <button
          id="start_stop"
          onClick={toggle}
        >
          start/stop
        </button>
        <button
          id="reset"
          onClick={()=>{
            reset();
            if(beep){
              beep.pause();
              beep.currentTime = 0;

            }
          }}
        >
          reset
        </button>
      </div>
      <audio
          id="beep"
          preload="auto"
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>
  )
}

Display = connect(mapStateToProps, mapDispatchToProps)(Display);

let App = ({
            session,
            my_break,
            increment_break,
            decrement_break,
            increment_session,
            decrement_session,
          }) => {
  return (
    <section className="App">
      <div className="App__opers">
          <Opers 
          label="break" 
          num={my_break}
          decr={decrement_break}
          inc={increment_break}
          />
          <Opers 
          label="session" 
          num={session}
          decr={decrement_session}
          inc={increment_session}
          />
      </div>
      <Display/>
    </section>
  )
}

App = connect(mapStateToProps,mapDispatchToProps)(App);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

setInterval(() => {
  store.dispatch(tick());
}, 1000);

export {timerToString,timerDecress};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
