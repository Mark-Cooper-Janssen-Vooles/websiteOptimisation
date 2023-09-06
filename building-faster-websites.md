# Building Faster Websites: Web Performance 

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