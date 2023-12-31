# Building Faster Websites: Web Performance 

A quick testing website to use would be something like webpagetest.org - however ideally you will bake something into your CICD pipeline.

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
  - [Image Resizing](#image-resizing)
  - [Image Optimisation](#image-optimisation)
  - [Resource Hints](#resource-hints)
  - [Async / defer Javascript](#async--defer-javascript)
  - [Text Compression](#text-compression)
  - [Text Asset Optimisation](#text-asset-optimisation)
  - [Critical CSS](#critical-css)
  - [Google Fonts Optimisation](#google-fonts-optimisation)
  - [Self hosted fonts](#self-hosted-fonts)
  - [System Fonts](#system-fonts) - better to use system fonts then muck around! 
  - [Lazy Loading](#lazy-loading)
  - [Remove unused CSS](#remove-unused-css)
  - [Remove unused JavaScript](#remove-unused-javascript)
  - [Caching Strategies](#caching-strategies)


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
- devs include static assets for 3rd partys because its quick / convenient. usually loaded from a CDN. 
  - common use cases include certain fonts, or icons, bootstrap css, etc.
  - there are risks 
    - code might change, it could be malicious
    - could go down 
    - css is render blocking, so critical rendering path wont be able to complete 
- with the above in mind, its best to bring as many 3rd party scripts as we can under our control
  - go to the third party links (i.e. https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css) and save and serve the file locally.
  - other oppourtunities include making this css load asynchronously. Websites like webpagetest.org will give recommendations 

### Image Resizing 
- images can be a huge waste of download
- png's are more suited to icons or illustrations, for photos .jpg's are better
  - i.e. png may be 500kb's, jpg might be more like 120kb
- the image's width may be larger than what it is used on the actual website 
  - i.e. an image with a 2000px width may only be in a banner thats max 500px wide, good to resize it 
  - good to have two size variants: one for desktop, one for mobile 
- for desktop images:
  - size images for their eventual size on the page (the images container)
  - the picture element is a good one to use:
  ````html
  <picture>
    <!-- a source element for each individual variant, in this case with the width smaller than 768px -->
    <source srcset='img/img-small.jpg' type='image/jpg' media="(max-width: 768px)">
    <img src='img/img.jpg' alt="picture of a dog playing">
  </picture>
  ````
- sizing images correctly can have a massive impact on overall perfoamnce, improving all the metrics 

### Image Optimisation 
- you can optimise images further using something like imageoptim.com/mac (on mac) to remove things like meta-data, thumb nails, other things that aren't needed
- you can use an optimisation using gulp or some build processor (like webpack)
  - you may need a library that optimises images in these build processor
  - an additional way to optimise images is to use newer file formats that offer better compression, i.e. webP format (developed by google) - will probably need another library to do this
  - some browsers (i.e. safari) might not support webp format - for those we'd need to serve the origional jpgs. can use www.caniuse.com/webp to check
    - will need to write logic to check if browser supports webp or not, and serve the jpgs if it doesn't  
  - webp is a relatively minor optimisation 
- animated gifs can be huge in file size - better to convert these gifs to videos using "FFmpeg" - ffmpeg.org/download.html has information how to do this 
  - converts the gifs into mp4 video
  - saves around 95% in file size! 
  - there is also 'webM', similar to 'webP' which is for videos. you can use ffmpeg to conver the gifs to webM.
    - again webM isn't supported by all - check www.caniuse.com/webm (seems just IE doesn't support now)
````html
<video autoplay loop muted playsinline>
  <!-- essentially because webm is first it tries to play this one, but if not supported it will play mp4 -->
  <source src="/img/dog3.webm" type="video/webm">
  <source src="/img/dog3.mp4" type="video/mp4">
</video>
````

### Resource Hints
- resource hints are a way to tell the browser it needs to makes to other domains, or download other content, before it normally would 
- add them to the head of a html document:
````html
<html>
  <head>
    <link rel="dns-prefetch" href="https://www.3rd-party.com">
    <link rel="preconnect" href="https://www.domain.com">
    <link rel="prefetch" href="https://www.3rd-party.com/3rd-party.js" as="script">
    <link rel="preload" href="https://www.3rd-party.com/3rd-party.js" as="script">
    <link rel="prerender" href="https://example.com/other-page>
  </head>
</html>
````
- there are a number of different types:
  - DNS Prefetch:
    - performs a dns lookup on a domain, one of the steps required. it forms a connection a little bit quicker
  - Preconnect:
    - similar to dns prefetch, but it does DNS prefetch + tcp + tls (if req) handshake
    - readies a full connection early
  - Prefetch:
    - if we know we will defs need a resource later in the loading process, we can tell the browser using the prefetch resource hint that it should download and cache the file in preparation.
    - this can be js, html, css, anything thats cachable 
    - this resource hint isn't definitive - if the browser determines it has something more important to load, it will do that instead 
    - safari may not support it 
  - Preload:
    - similar to prefetch, except its no longer a suggestion - its an order
    - prioritises loading whatever is in preload over the current pages critical resources (better to use prefetch!)
    - the browser must download this file straight away 
    - not supported in all major browsers 
  - Prerender:
    - can only be used with other web pages - downloads the pages html, parses its contents, downloads and executes its discovered resources. i.e. the page is rendered in a hidden tab in anticipating the user visiting it (if this user doesn't visit it, its a waste of resources)
    - potentially only supported on chrome. check: wwww.caniuse.com/?search=prerender

### Async / Defer Javascript 
- a html parser builds the dom, if it finds a script file linking to a js file, parsing is paused until the js is rendered
  - this makes js a blocking resource until its finished
  - modern browsers allow us to tackle this issue: `<script src="script.js" defer></script>`
    - delays js execution until after html is fully parsed - script is no longer render blocking 
    - `<script src="script.js" async></script>` is very similar, except js is executed as soon as its able too (parallel to the html parsing)
      - best suited to JS that doesn't require a complete DOM, or doesnt require other JS to be loaded 

### Text Compression 
- when text assets from html, css, js, are sent to the browser as the website is being loaded, you can compress them using special file formats 
- gzip is the most widely used of this. another is BROTLI (by google, even better than gzip) 
- you can see if things are being compressed in devtools => network => refresh the page => right click tabs and choose "response headers => content-encoding", funnily enough google.com uses gzip a lot
- if using AWS s3 need to pre-compress files using tools like Gzip or Brotli before uploading 
- if using AWS CloudFront as a CDN, you can configure cloudfront to automatically apply compression 
- netlify does this automatically

### Text Asset Optimisation 
- currently, the CSS and JS is split across multiple files - by bundling them into single files (i.e. one style.css, one script.js) will help the browser download them faster - because text compression works better on larger files 
- to put all the CSS in a single file we can use SASS - a css pre-processor
  - you can import other css components into .sass files. things like gulp / webpack can do this. 
  - can get like 80% space savings here using gzip or brotli compared to uncompressed 
- to get all JS in in a single file: 
  - can use something like rollup.js or webpack to bundle the js into one file (best to minify also)
  - some js stats: js was 700kb unbundled, 150kb bundled, 200kb unbundled but gzipped, and 50kb bundled + gzipped 

### Critical CSS 
- CSS defaults to render blocking
- if this wasn't the case, you'd experience 'flash of unstyled content' 
- there is a way to stop css from blocking rendering, and the 'flash of unstyled content'
  - we can determine the bare minimum css required to style the content in the initial viewport (i.e. all the user sees as the page is loading, i.e. not what you can scroll down to see)
  - we then separate this CSS From the rest, and add it to display in-line in the HTML document directly 
  - the remaining non-critical CSS stays where it is in the .css file and is loaded async at a later stage 
  - now the browser can render the viewport content without having to download any additional CSS files
- how do we separate critical from non-critical css and make the latter load asyncronously? 
  - there is a npm package 'critical' that can do this for us - can use this in webpack / gulp etc
- this ends up making the 'percieved' loading of the viewport of the page 0.4s faster
- best to then check how the page is being rendered, can use something like webpagetest.org to view the video test result frame by frame 
  - if you notice something like an image not loading yet, you can use the preload `<link rel="preload" href="/img/logo.svg" as="image"` to load those faster too
- now with the image being preloaded as well, instead of feeling complete at 4.5s, it now feels complete at 2.9s! (whats loaded in the viewport)
- this makes huge improvements to the rendering times! such as:
  - start render, first contentful paint, speed index, largest contentful paint

#### Google fonts Optimisation
- most popular way of including non-standard fonts out of the box
- usually already pretty good, made non-blocking etc
- still room for improvement: i.e. preconnect 
  - we can preconnect to the domain `<link role="preconnect" href="https://fonts.gstatic.com" crossorigin>`

### Self-hosted fonts
- alternatively to using google fonts, we can host the fonts ourselves 
- this opens the door to more optimisations
- can grab the links from the google fonts css url's and download them one after another, and put them in a fonts directory
- self-hosted fonts can perform worse - need to check gulp or webpack config 
  - browsers load custom fonts differently. need to use `font-display: swap` => browser displays text using next-available fallback font until the specified font is available. the time from the fallback font to the specified font is called "the flash of unstyled text" 
- a good idea to use preload on each font: <link rel="preload" href="/fonts/somefont.woff2" as='font' type='font/woff2' crossorigin>
  - because we're pre-loading fonts the browser thinks these are more improtant, so the browser loads them first - actually creates a worse percieved perfomance. so he removes them. he says test or you'll never know!

### system fonts!
- system fonts are fonts already in use in your OS - using these in your website will grant a performance boost since you don't have to download any additional webfonts
  - lots of websites use these now as their default - github, wordpress, medium 
  - add a font-family css rule like this: 
````css
html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial
}
````
  - there are many listed because no one OS has them all. if it doesn't have one, it moves on to the next until there is a next. 

### Lazy Loading
By default, if an image-heavy page is downloaded, so are all of the images - wether the user sees them or not initially. 
The solution is lazy loading:
- allows us to defer the loading of assets until they're in the viewport (visible to the user), we only download what we need 


Lazy loading images:
- as simple as loading the loading attribute and setting it to lazy: `<img src="/img/product-image.png" alt="product image" loading="lazy"`
  - can also be used on iframes: `<iframe src="https://www.google.com/maps/embed/etc" allowFullScreen loading="lazy"></iframe>`
- may be different in safari etc in terms of support: https://caniuse.com/loading-lazy-attr
- lazy loading may increase cumulative layout shift - to avoid this add width and height elements of what the image will load to: 
  - `<img src="/img/product-image.png" alt="product image" loading="lazy" width="200px" height="200px"`

### Remove Unused CSS
- open dev tools => 3 dots => more tools => coverage => click 'start instrumenting and refresh page' 
  - this shows how much CSS has been loaded but not used (the % and in the red bar)
  - we can remove our CSS - each page can have its own CSS file (currently all the pages use the one CSS file)
    - this will be done in webpack of gulp etc 
    - he uses gulp to create a replica of index.css for each page, then uses a new library "purgeCSS" to purge the unused CSS for each file to generate the final outcome CSS files 
- the aim of this is to reduce the unused CSS, it will never be zero i.e. some styles will only be used in mobile view etc.

### Remove unused JavaScript
- instead of having one global.js file - each page has its own file, downloading only what it needs 
  - split existing js file into individual ones so they can be imported where required (react already kind of does this + i think impossible for SPA?)
  - use gulp / webpack / whatever if required 

### Caching Strategies 
this focuses on improving performance of repeat loads by caching asset downloads 
- only re-download if assets have changed 
- caching is server-led, so to change this we'd use apache or whatever (can be done in s3 / cloudfront)
- seems to happen automatically on netlify by default: https://docs.netlify.com/platform/caching/

