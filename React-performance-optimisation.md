# React Performance Optimisation

NOTE: 
- do not fall into the trap of premature optimisation: we have seen a lot of projects not delivered because of over-engineering
- better to build and deliver an app, then when it works fine we optimise it

Contents:
- [Info](#info)
- [Wasted Renders](#wasted-renders)
  - Class components
  - function components
- Bundle Size 
- Expensive Operations 

---

## Info 

### React Profiler 
Need to install the chrome dev tools extension "react" 
- Can now open dev tools and choose the 'Profiler' and start a session then do some interaction, then stop the profiler 
  - this tells you how many re-renders occur etc. If everything is re-rendering then we can improve the performance!

### Class Components and Rerenders: Component vs PureComponent
- i.e. `export class NewBtn extends React.Component {` => `export class NewBtn extends React.PureComponent {`
- PureComponent is similar to Component but it skips re-renders for same props and state.
- FYI class components are still supported by React, but it is not recommended to use them.

### Functional Components and Rerenders
- React.memo needs to be used. `React.memo` is a higher-order component in React that's used to optimize the performance of functional components by preventing unnecessary re-renders.  
- i.e. instead of exporting your functional component `export default NewBtn`, you export it wrapped `export default React.memo(NewBtn)`

### useCallback and useMemo hooks
- The React useCallback Hook returns a memoized callback function.
- Think of memoization as caching a value so that it does not need to be recalculated. This allows us to isolate resource intensive functions so that they will not automatically run on every render.
- The useCallback Hook only runs when one of its dependencies update. This can improve performance.
- The useCallback and useMemo Hooks are similar. The main difference is that useMemo returns a memoized value and useCallback returns a memoized function.


---

## Wasted Renders
This is the source of most performance problems in React
- Every time there is a change in react, it asks every component to give the latest mark-up 

### Preventing Wasted Renders in a simple (class) component 
- use the profiler, start session, move a star
  - can see number of renders 
  - can click through different components changed based on the render 
  - we cab see new button / info section etc are being re-rendered, even though they shouldn't be - theres no need 
- to guard against unnecessary re-renders of "new button" we can turn it into a pure component (it is just a normal component now)
  - a pure component checks the props if there is a change, and re-renders only if there is a change. based on the reference on the props. 
  - we have only one prop, the "onClick"
  - i.e. `export class NewBtn extends React.Component {` => `export class NewBtn extends React.PureComponent {`
  - it still re-renders when we move a star. We have passed the `<NewBtn onClick={() => setIsAddOpen(true)} />` a prop of an arrow component in App.js - every time App.js re-renders there is a new instance of a new function created there as a reference, as we are creating this arrow function from scratch. 
    - our App is a functional component. to address the above issue we can use useCallback - similar to useEffect with an array of dependencies. 
    - this essentially makes this function only update based on the array, which we will set to empty: 
      - `const showDialog = useCallback(() => setIsAddOpen(true), []);` and `<NewBtn onClick={showDialog} />`
    - we can then check the profiler - it works! 

### Preventing Wasted Renders in Functional Components 
- lets say we use a functional component with a wasted render:
  - we cannot use a pureComponent technique in a functional component
- convert class component to functional component: 
````js
export const newBtn = (props) => {
  const { onClick } = props;
  return (
    <button className="new-star" onClick={onClick}>
      ⭐
    </button>
  );
}
````
- if we re-check the profiler, we notice we have the re-render problem again
  - we want it so that when the reference of the props don't change we want the component to not re-render 
  - we can use memo for this:
````js
const NewBtn = ({ onClick }) => {
  return (
    <button className="new-star" onClick={onClick}>
      ⭐
    </button>
  );
}

export default React.memo(NewBtn)
````

### Preventing wasted renders when dealing with complex props 