# Building Faster Websites: Web Performance 

- [How browsers load websites](#how-browsers-load-websites)
- [Measuring web performance](#about-measuring-web-performance)
- 

## What is web performance? 

Web Perfomance optimisation
1. Lots of measuring
  - we need to measure the existing performance 
2. Improving load times
  - get the website into the users hands faster
3. Improving perceived performance 
  - the user feels better about the wait, or feels it loads faster 
  - if a user takes 30 seconds to fully load, but the psychological load time is only 5 seconds - thats what matters
    - if the user has 'active' weight time, they will be engaged in the website and won't perceieve it was waiting 
    - 'early completion' refers to the active phase of the weight time - what they see has loaded, so it feels like its loaded faster than it has 

Web performance also includes things like 
- analytics 
- accessibility 
- improving conversions
- search engine optimisation
  - loading speed of a website is considered a ranking factor


## Measuring web performance

### How browsers load websites 
- **HTTP Request:** going to a website i.e. http://google.com sends a http request to the webserver
  - it finds the address of the webserver using DNS lookup (and is cached to speed up subsequent requests)
    - JS and CSS will require their own DNS lookup as well
  - now the users browser knows the address of the server, it does a TCP handshake
  - a TLS handshake is required to establish a secure connection - then its connected
  - once connected, the server sends a http response with the html. called a "round trip"

- **Critical Rendering Path:** refers to steps the browser must complete to convert html / css / js to on-screen pixels
  - Path is: DOM => CSSOM => Render Tree => Layout => Paint
  - optimising this path is one of the main ways to speed up rendering times 
  - steps: 
    - DOM (document object model - html, uses html parser)
      - may contain links to CSS, in which case it fires off a request to retrieve it and moves on
      - if it contains a script element, unless it contains a `defer` or `async` attribute, it pauses until this request is completed 
        - once script is downloaded, it executes, then DOM html parser resumes
      - once html parser is complete, it fires `DOMContentLoaded` event 
    - CSSOM (css object model - css, uses css parser)
      - CSS is a cascade, so any rule can be overwritten
      - the browser won't continue until it has completed construction of the CSSOM
    - Render Tree (DOM + CSSOM are fully built, they combine to form the render tree)
      - browser uses this to render content to the screen
    - Layout (browser calculates how and where to print each element to the page)
      - impacted by the size of the DOM (node number etc)
      - whenever DOM is modified, positions need to be updated (called a 'reflow'), and will need to 'reflow' on all children
    - Paint (paints pixels to the screen)
      - on first load, entire page is painted 
      - then, any element subject to layout change will be re-painted (and that element / its children only... it is an optimisation)
    - If Javascript was deferred or is programmed to listen to the `window.addEventListener('load')` event, that will execute now.

### About Measuring web performance
When you look at web performance, its possible to break it down into two main categories: loading performance, and rendering performance. 
- Loading focuses on optimising performance on delivery of assets from the server to the browser:
  - file sizes
  - asset load order
  - no unused assets / code 
  - no blocking scripts 
- Rendering performance focuses on:
  - optimising how complex css style calculations are
  - is JS causing unnecessary reflows
  - bad event listeners (how well does it run)

When measuirng performance, draw on:
- Lab Data 
  - captured using synthetic testing
  - in a controlled, simulated environment
  - full control over device type, network condtions etc
  - google lighthouse / webpagetest are examples
  - advantages:
    - captures lots of data
    - measures while website is still in development
    - can measure competitors
    - benchmark against previous versions to avoid regression
  - disadvantages
    - doesn't capture complete picture, only snapshots
    - unable to directly compare against other data points
- field data 
  - data collected from real users
  - real-user monitoring (RUM)
  - e.g. google analytics 
  - captures real world user experience quirks and all
  - advantages: 
    - monitoring performance during high traffic events
    - collects user data
    - directly cross-reference web performance against other data points 
  - disadvantages:
    - not suited for debugging performance issues
    - can't benchmark against competitors 
    - can't effectively measure websites in development 

- Factors which impact page load:
  - users location relative to server
  - network traffic
  - network speed 
  - device power (how quickly they can be processed / rendered)

### Loading Performance Metrics 
- there are metrics which we can track:
  - time to first byte
  - first paint / first contentful paint 
  - speed index / largest contentful paint 
  - time to interactive / time to first CPU idle 
  - total blocking time
  - first input delay 
  - load time 
  - cumulative layout shift
- there are metrics which we can track, these call fall in either:
  - quantity based metrics (anything you can count) 
  - milestone metrics (how long it takes browser to reach specific phase of a loading process)
    - time to first byte
      - TTFB: measures reponsiveness of webserver. how long it takes server to respond to first request, i.e. return the html. 
      - geographical location matters here
    - first paint / first contentful paint: 
      - once the 'paint' has started in the critical rendering path: a measurement of how long it takes when the user types in the address in the browser, hits enter, then starts seeing pixels on the screen 
      - first contentful paint differs in that its when the first pixels are useful to the user: i.e. text, images, svg, non-white canvas elements. if they aren't optimised, the user will perceive poor performance 
    - speed index / largest contentful paint
      - speed index is when dom fires events such as `dom content loaded` or `load` - but not considered a good indicator anymore
        - focuses on viewport loading 
      - largest contentful paint looks at when the largest image or text block is visible in the view port 
    - time to interactive
      - measures the point in the loading process where the page is FULLY interactive 
        - must be complete enough to facilitate interaction (i.e. buttons etc, event handlers)
    - time to first CPU idle 
      - when the page is first interactive 
    - total blocking time:
      - measures amount of time between first contentful paint and time to interactive
        - can help developers understand jsut how non-interactive a page is 
    - first input delay:
      - time from the user is first able to interact with the page, to the time the browser is able to respond to this interaction
        - this is due to it being single-threaded
        - if browser is still executing JS, it wont be able to respond (call stack is busy)
    - load time:
      - can represent a few things. `onLoad` event is fired and static content is loaded, or `onLoad` + no more network activity
      - not that important in terms of the users perspective of loading. if its interactive at 5 seconds, this is when its perceieved to have loaded, even if last network call is made 10 seconds later 
    - Cumulative layout shift
      - when a webiste is loading, often times layout could shift as new elements are introduced.
        - triggers unnecessary reflows (everything affected by the layout shift needs to be repainted)
        - the lower the score the better! 

    
      