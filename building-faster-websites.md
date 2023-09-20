# Building Faster Websites: Web Performance 

- Measuring Web Performance
  - [How browsers load websites](#how-browsers-load-websites)
  - [Measuring web performance](#about-measuring-web-performance)
  - [Loading Performance metrics](#loading-performance-metrics)
  - [Performance Budgets](#performance-budgets)
  - [Performance Goals](#perfomance-goals)
  - [Establishing Testing conditions](#establishing-testing-conditions)
- [Google Lighthouse](#google-lighthouse) 
  - [Running Lighthouse Audits](#running-lighthouse-audits)
- [WebPageTest](#webpagetest) (google lighthouse alternative)
- [Practical Segment](#practical-segment)
  - [HTTP Requests](#http-requests)
  - [3rd Party Static Assets](#3rd-party-static-assets)

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
  - a TLS handshake is then required to establish a secure connection - then its connected
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

### Performance Budgets 
- Everyone invested of the success of the website needs to be aware of these, this can be done by establishing a performance budget
- i.e. there is a list of metrics that the performance cannot fall below. this forces performance to be a stakeholder in conversations 
- What should the performance budget be? 
  - performance goals are vital, but performance budgets are more about achieving regression. i.e. whatever the live websites metrics are right now
  - i.e. metrics should never get worse, only better! you can make it whatever the worst was over the last 2 week period.

### Perfomance Goals 
- how fast do users expect websites to load? this is changed over time
  - google found 53% of visits are abandoned if a mobile site takes longer than 3 seconds to load.
- what does 'instant' load look like?
  - 100-200ms 
- google has set 100ms as the goal for an ideal wait time
  - but this is unrealistic for most websites, and load time isn't the best metric

- better metrics are speed index, first contentful paint and time to interactive
  - google recommends on slow 3g mid-range (slowish) mobile devices: 
    - complete paint in 2-3 seconds, and have it interactive under 5 seconds. 
- many of todays most popular websites don't reach this however: ebay, yahoo, apple, cnn for examples. 

### Establishing Testing Conditions
- We need to use relevant testing conditions to ensure the data is meaingful and relevant 
- Device type, network speed, test location, which browser
  - Its important to test under conditions represetative of your users!

- Device types:
  - 87% of all mobile devices are androids, you could check most commonly sold amazon phones 
  - 4G is the most commonly used mobile phone network speed, in some poorer countries it might be 3g or 2g.
- Network speeds:
  - Basic Guidelines:  
    - North America / Europe:
      - throttled 3g 
      - 300ms round trip delay 
      - 1.6mbps down
      - 0.8mbps up
    - Everywhere else:
      - 2g
      - 800ms round trip delay
      - 280kbps down 
      - 256 kbps up
- Test Location: Geographic location plays a role
  - CDNs reduce these times
  - if you are a website in america only targeting US users, host it in US!
  - if you have a website in america targeting global users, better use CDNs
  - you can find your users locations in google analytics etc
- Browsers: 
  - Google analytics can show what browser is mostly used (usually chrome)
  - Make sure analytics is similar across browsers, if they are similar you can just use one for testing metrics

---

## Google Lighthouse 
- allows you to audit website in key areas:
  - performance
  - accessibility
  - SEO
  - best practices
  - progressive web app implementation
- generates report on these areas
- theres also an 'oppourtunities' section on how to improve the performance 

### Running Lighthouse Audits 
- Generate an audit reports have many different ways: 
  - Chrome => Devtools => find the 'lighthouse' panel 
    - because tests are running on your machine, not on googles servers, conditions are not always the same or reliable. can be a ball-park though.
  - On the web using google's page speed insights: https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect
    - can use mobile or desktop here
    - mobile for https://markjanssen-webdev-learnings.netlify.app/ : 
      - Performance 65, accessibility 90, best practices 100, seo 91 
      - First contentful paint took 2.7s 
      - Largest contentful paint too 2.7s 
      - Total blocking time is 1,310ms 
      - Speed index is 4.4s 
      - Website needs logic to check page width with what to render, is unusable in mobile mode

### Lighthouse in nodejs 
- you can use a global library or import the nodejs module directly into your js programatically.
  - global library: 
    - there is a library that allows lighthouse to be run from the command line, output JSON / CSV, set up the testing environment and block specific requests 
    - `npm install lighthouse -g`, then in the command line: `lighthouse https://markjanssen-webdev-learnings.netlify.app --output json --output html --output csv`
    - you can also throttle or use slow 3g settings 
  - programatically:
    - `yarn add --dev lighthouse`
    - this benefits the workflow. build a tool to generate reports and compare them in the CICD pipeline
    - guide: https://css-tricks.com/build-a-node-js-tool-to-record-and-compare-google-lighthouse-reports/ 


---

## WebPageTest 
- a synthetic testing tool
- open source github project 
- most widely used at webpagetest.org
  - simply enter a url and hit test, for example: https://www.webpagetest.org/result/230920_AiDcXZ_3ZR/
- many different settings etc in here 

---

## Practical Segment 
- we'll need to establish testing conditions, the website in the `source-code` file is 'MLE power':
  - device type 
  - network speed
  - test location
  - web browsers
- lets say its a US based business, targeting US customers 
- we can test on: Moto G4, 3G, we can use webPageTest's west virginia (where their test server is located), and we can use google chrome 
- the first test we run on webPageTest becomes our initial performance report 
- We can set our initial vs our goal metrics like so:

| Metric  | Start Render | First Contentful Paint | Speed Index | Largest Contentful Paint | Cumulative Layout Shift | Time to interactive | Total Blocking time | Bytes Downloaded | Fully Loaded | Lighthouse Score |
|---------|--------------|------------------------|-------------|--------------------------|-------------------------|---------------------|---------------------|------------------|--------------|------------------|
| Initial | 5.3s         | 5.3s                   | 8.2s        | 18.9s                    | 0.231                   | 35.7s               | 0.6s                | 4264kb           | 33.0s        | 12               |
| Goals   | 3.0s         | 3.0s                   | 3.0s        | 3.0s                     | 0.1                     | 5.0s                | 0.3s                | Max 4264kb       | Max 33.0s    | 90+              |



### Http Requests
- want to make sure website is using HTTP/2
  - http/1 means these can only be downloaded one after another 
  - http/2 allows us to send multiple requests in parallel 
  - check by going into the dev tools => network => right click and add 'protocol', it should say h2.
  - http/2 is enabled at the server level 

### 3rd Party Static Assets 
- 