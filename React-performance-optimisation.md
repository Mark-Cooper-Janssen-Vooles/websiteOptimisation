# React Performance Optimisation

NOTE: 
- do not fall into the trap of premature optimisation: we have seen a lot of projects not delivered because of over-engineering
- better to build and deliver an app, then when it works fine we optimise it

Contents:
- [Setup](#setup)
- [Wasted Renders](#wasted-renders)
- Bundle Size 
- Expensive Operations 

---

## Setup 

### React Profiler 
Need to install the chrome dev tools extension "react" 
- Can now open dev tools and choose the 'Profiler' and start a session then do some interaction, then stop the profiler 
  - this tells you how many re-renders occur etc. If everything is re-rendering then we can improve the performance!

---

## Wasted Renders
This is the source of most performance problems in React
- Every time there is a change in react, it asks every component to give the latest mark-up 

### Preventing Wasted Renders in a simple component 
- use the profiler, start session, move a star
  - can see number of renders 
  - can click through different components changed based on the render 
  - we cab see new button / info section etc are being re-rendered, even though they shouldn't be - theres no need 