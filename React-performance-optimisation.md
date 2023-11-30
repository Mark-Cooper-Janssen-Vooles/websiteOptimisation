# React Performance Optimisation

NOTE: 
- do not fall into the trap of premature optimisation: we have seen a lot of projects not delivered because of over-engineering
- better to build and deliver an app, then when it works fine we optimise it

Contents:
- [Fix slow renders first](#fix-slow-renders-first)
- [Info](#info)
- [Wasted Renders](#wasted-renders)
  - Class components (PureComponent)
  - function components (React.memo)
- [Fixing Large Bundles and Expensive Operations Issues](#fixing-large-bundles-and-expensive-operations-issues) 
  - Expensive Operations (useMemo hook)
  - Reducing Bundle Sizes (using production builds - webpack)
  - Lazy Loading Components
---

## Fix Slow Renders First

https://kentcdodds.com/blog/fix-the-slow-render-before-you-fix-the-re-render
-  JavaScript is really fast at handling re-renders, so why would your app freeze up when getting them?
  - your problem might be unnecessary re-renders, but it's more likely a problem with slow renders in general
- How to fix slow renders:
  - when you know what is slow - use the browsers profiling tools, start profiling, do the interaction, then stop profiling it 
  - check what is taking the longest, try again with the profiler. try with reacts profiler too.

---

## Info 

### React Profiler 
Need to install the chrome dev tools extension "react" 
- Can now open dev tools and choose the 'Profiler' and start a session then do some interaction, then stop the profiler 
  - this tells you how many re-renders occur etc. If everything is re-rendering then we can improve the performance!

### Class Components and Rerenders: 
- Function references (in props): Component vs PureComponent
  - i.e. `export class NewBtn extends React.Component {` => `export class NewBtn extends React.PureComponent {`
  - PureComponent is similar to Component but it skips re-renders for same props and state.
  - FYI class components are still supported by React, but it is not recommended to use them.
- Value references (in props): 
  - i.e. add usage of `shouldComponentUpdate` - this needs to compare the nextProps with the currentProps and return true if it should re-render, and false when it shouldn't 
  - make sure you use immutable values in your props

### Functional Components and Rerenders
- Function references (in props):
  - React.memo needs to be used. `React.memo` is a higher-order component in React that's used to optimize the performance of functional components by preventing unnecessary re-renders.  
  - i.e. instead of exporting your functional component `export default NewBtn`, you export it wrapped `export default React.memo(NewBtn)`
- Value references (in props):
  - use React.memo and pass it the component as the first argument and the comparison function as the second, it will rerender when the comparison is true 
  - make sure you use immutable values in your props


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
For Class Components:
- start recording the profiler session and move a star
  - the Info component was re-rendered all the time. Why was that when the number of stars, age of oldest star, and age of youngest star did not change?
- our info component is a class component, and jsut receieves the 'Stars' as the props and only populates it based on those. 
  - we want to tell the component to check the props coming to us. We want to tell the component that if the length / ages are the same, do not rerender! 
  - pureComponent only checks the references. Here we want to check the value of the props. We have a function for this - shouldComponentUpdate
  - shouldComponentUpdate takes 'nextProps' and we compare the currentProps to the nextProps - we return true if we want a re-render. 
````js
export class Info extends React.Component {
  shouldComponentUpdate(nextProps){
    const oldKeys = Object.keys(this.props.Stars);
    const newKeys = Object.keys(nextProps.Stars)

    // return true if newKeys length isn't the same as oldKeys length - only rerender in this case
    return oldKeys.length !== newKeys.length
  }
````
  - important to check it re-renders when it should too - certain mutation bugs etc could cause issues here:
    - it is being passed Stars after they've been deleted using handleDelete
    ````js
      function handleDelete(Star) {
        delete Stars[Star.id]; // here we mutate it in-place and pass it directly in
        setStars({ ...Stars }); 
      }

      // using immutable data:
      function handleDelete(Star) {
        const tempStars = { ...Stars }
        delete tempStars[Star.id]
        setStars({ ...tempStars }); 
      }
    ````
    - after the above change it correclt updates the `<Info />` component. 

For functional components: 
- similar to the function reference, we will use `React.memo(Info)` however we will pass it the second argument as that is the comparison for the values:
````js
const comparison = (p1, p2) => Object.keys(p1.Stars).length === Object.keys(p2.Stars).length // rerenders when true!

export default React.memo(Info, comparison)
````

### Prevent wasted renders in repeated components 
- if you move one of the `<Star />` components, all of the other Star components re-render also! 
- we want only the star that we move to be re-rendered
````js
const comparison = (prevProps, nextProps) => {
  return (
    prevProps.Star.id === nextProps.Star.id &&
    prevProps.Star.position.left === nextProps.Star.position.left &&
    prevProps.Star.position.top === nextProps.Star.position.top
  );
};

export default React.memo(StarComponent, comparison)
````
- note that here we also need to make sure in App.js we are not causing mutations to the stars location, but are creating a new Star object:
````js
let newStar = {};
newStar.id = Star.id;
newStar.age = Star.age;
newStar.offset = Star.offset;
newStar.position = {
  top: ev.pageY - dragOffset.y,
  left: ev.pageX - dragOffset.x,
};

Stars[newStar.id] = newStar;

setStars({ ...Stars });
````

---

## Fixing Large Bundles and Expensive Operations Issues

The most common part in react optimisation is dealing with wasted rerenders, but this is another issue. We can use catching and memoization.

### Catching Expensive Operations 

- catching expensive operation reusults after a heavy or intensive CPU operation
- an example is in the info.js file, when expanding the info box we're re-rendering the entire component and 'heavy' processes (or expensive operation) like the stars.forEach (nested loop with a setTimeout) are being re-calculated every time, even though they are not needed to.
- we're already using `React.memo` in this component - but we want to tell it in some cases not to re-calculate the expensive operation. 
  - for doing this, we need to use another built-in hook from react, 'useMemo'.
  - useMemo takes two arguments. the first one is a factory function that fires whenever something in the list of dependencies changes (similar to useEffect)
    - the factory function needs to return something, i.e. in this case `distancesCalc` - so we pass it the expensive operation function, but make sure to return 
    - the second argument is the list of dependencies, in this case we want it to be `Object.keys(Stars).length`

- Before:
````js
export const Info = React.memo(
  function Info(props) {
    const [exapnded, setExpanded] = useState(false);
    const Stars = Object.values(props.Stars);

    const distances = { max: 0, min: 1000 }; // recalculated every time it re-renders 
    Stars.forEach((currentStar) => {
      setTimeout(() => console.log('take awhile'), 2000)
      Stars.forEach((compareStar) => {
        if (compareStar === currentStar) {
          return;
        }

        distances.max = Math.max(
          distances.max,
          Math.max(Number(currentStar.age), Number(compareStar.age))
        );
        distances.min = Math.min(
          distances.min,
          Math.min(Number(currentStar.age), Number(compareStar.age))
        );
      });
    });

    const expandHandler = () => setExpanded(!exapnded);

    return (
      <div className={exapnded ? "bar" : "board"}>
        <div>You have {Object.keys(props.Stars).length} stars!</div>
        <div>Age of the oldest star: {distances.max}</div>
        <div>Age of the youngest star: {distances.min}</div>
        <span className="expand" onClick={expandHandler}>
          ◤ ◥
        </span>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      Object.keys(prevProps.Stars).length ===
      Object.keys(nextProps.Stars).length
    );
  }
);
````

- After: 
````js
export const Info = React.memo(
  function Info(props) {
    const [exapnded, setExpanded] = useState(false);
    const Stars = Object.values(props.Stars);

    const distances = useMemo(() => {
      const distancesCalc = { max: 0, min: 1000 };
      Stars.forEach((currentStar) => {
        setTimeout(() => console.log('take awhile'), 2000)
        Stars.forEach((compareStar) => {
          if (compareStar === currentStar) {
            return;
          }
  
          distancesCalc.max = Math.max(
            distancesCalc.max,
            Math.max(Number(currentStar.age), Number(compareStar.age))
          );
          distancesCalc.min = Math.min(
            distancesCalc.min,
            Math.min(Number(currentStar.age), Number(compareStar.age))
          );
        });
      });
      return distancesCalc
    }, [Object.keys(Stars).length])


    const expandHandler = () => setExpanded(!exapnded);

    return (
      <div className={exapnded ? "bar" : "board"}>
        <div>You have {Object.keys(props.Stars).length} stars!</div>
        <div>Age of the oldest star: {distances.max}</div>
        <div>Age of the youngest star: {distances.min}</div>
        <span className="expand" onClick={expandHandler}>
          ◤ ◥
        </span>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      Object.keys(prevProps.Stars).length ===
      Object.keys(nextProps.Stars).length
    );
  }
);
````

### Reducing Bundle Size

- clear network tab, click hard reload + clear empty cache 
- see in the network tab 'bundle.js' is 393kb - can we reduce this size?
  - to get smaller bundles, switch from development build to production mode. we've got the one using create-react-app (webpack)
  - we want the build script => it tells webpack we want the production build. 
  - `npm run build`
  - `npx serve -s build`
  - now check network tab again for this one, we've got main.js instead now but its 58.1kb (compared to dev build which is 393kb)
- just need to make sure webpack is set up correctly to use gzip etc and reducing this bundle size!

### Lazy Loading Components

- if there is a big file but our project is small OR when our project grows, we will have many files and dependencies in our project. Best practice means to lazy load - a quick and light screen to the client / user. 
  - In the background download the bundles or heavy / expensive downloads / calls - do them in the background. show something to the user quick. t

- Adding lazy loading:
  - we've got a star in the top left which opens a modal and enables us to add a star. we want to make it that we don't download the dependencies/code for this modal until after the user has clicked it. we don't want to download it on page load - the user might not even use it! 
  - if you want to lazy load, you need to use `default export`
  - we then need to go to the parent component where we are using this (app.js) and get two more imports from react - `lazy` and `Suspense`.
  - instead of importing like `import NewStarModal from '....'`, we now use `const NewStarModal = lazy(() => import('...'))`. 
  - then where the component is used, we wrap it in suspense:
  ````js
  {isAddOpen && (
    <Suspense>
      <NewStarModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(StarText) => {
          addStar(Stars, StarText);
          positionStars(Stars, width, height);
          setStars(Stars);
        }}
      />
    </Suspense>
  )}
  ````
  - you can check in the network tab, that when the add star button is clicked, there are resources downloaded 
  - the interval from download time to seeing the modal, in some cases, could be long (slow internet speeds etc).
    - we can use a fallback here. create something like this: 
    `const ModalLoader = () => <div className="Modal-loader">Loading...</div>`
    - in the Suspense area: `<Suspense fallback={<ModalLoader />}>`
    - you can see it by using slow 3g in the network tab.

---

NOTE: at end of this check out what dashboard.ui is doing - try to apply the principles, find a piece of code to demo as a tech sharing. 



In React, the React.memo function is a higher-order component (HOC) that memoizes a functional component, preventing unnecessary renders by memoizing the result based on the component's props. The second argument to React.memo is an optional comparison function that determines whether the props have changed and whether the component should re-render.

Here's the syntax for React.memo:

````js
const MemoizedComponent = React.memo(MyComponent, (prevProps, nextProps) => {
  // Return true if the props are equal (no re-render), or false if they are not equal (re-render).
});
````
The second argument is a function that takes two parameters: prevProps and nextProps. It should return true if the props are considered equal and false if they are not. If the comparison function is not provided, React.memo performs a shallow equality check on the props by default.

Here's an example without a custom comparison function:
````js
const MemoizedComponent = React.memo(MyComponent);
````

And an example with a custom comparison function:
````js
const MemoizedComponent = React.memo(MyComponent, (prevProps, nextProps) => {
  // Custom logic to compare props
  return prevProps.id === nextProps.id;
});
````

In the second example, the memoization will depend only on the id prop, and the component will re-render only if the id prop changes.