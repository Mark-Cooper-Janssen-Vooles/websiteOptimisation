## CSS Impact
The critical rendering path is the sequence of steps the browser goes through to convert HTML, CSS and Javascript into pixels on the screen.
By focusing on CSS we can perform runtime performance 

Optimise CSS by:
- Minimising critical resources 
- Minimise critical bytes 

CSS is render blocking by default - anything blocking the critical rendering path means the user will get a blank screen. 

Why decrease load time?
- "Yahoo increased traffic by 9% for each 400ms of improvement in load time" - wpostats.com
- "Amazon saw that every 100ms increase in load time resulted in a 1% decrease in revenue" 

### Browser Rendering Pipeline 

Javascript => Style => Layout => Paint => Composite

1. a user enters your site, browser sends http request to server
2. browser receieves response, a pure html
3. browser sees there is a .css file attached to the html, then fetches this also
4. browser processes HTML to build DOM
5. browser parces CSS to build CSSOM
6. browser combines DOM and CSSOM to create render tree (style)
7. browser then calculates position / dimension of each element (layout)
  - all rems etc converted to absolute units 
8. browser now prints to the page (paint)
9. browser paints these layers individually (composite)
  - user can now see everything on the page

#### Style Calculations
- HTML parsing algorithm:
  - Conversion
    - browser reads raw bytes from html and transfers then to characters (i.e. html tags `<body></body>`)
  - Tokenizing
    - converts the html into tokens, i.e. `StartTag: head ... EndTag: head`
  - Lexing
    - converts tokens to nodes
  - DOM tree
    - creates the DOM, with a parent child relationship (how a html file is written)

- Parse CSS 
  - Similar to html. 
    - CSS bytes converted into characters => tokens => nodes => CSSom tree 

- Render Tree 
  - Selector matching (what CSS applies to what HTML)
  - Figure out final styles, i.e. inherited styles etc. 
  - Render tree looks like DOM tree, except:
    - does not have HTML / HEAD 
    - elements with `display: none;` will be removed from render tree
    - if theres a pseudo element created by CSS, but it is visible, that will be added to the render tree 

- To see this in real time, using 'profiling':
  - open a chrome window and the dev tools + select 'performance tab'
    - look in options and make sure CPU and network throttling is off 
  - Hit record and load a page, for example: https://markcooperjanssen-vooles.netlify.app/ (i know this one has html and css)
  - Stop recording 
  - There is a summary tab down the bottom which shows information on loading, scripting, rendering, painting, system, idle
    - loading is the network call
    - scripting is the javascript
    - rendering s a combination of the Parse HTML and the Parse Style sheet
  - under the `Main` area, we can see:
    - Parse HTML (represented in blue) - the main thread parses the html to build the DOM tree
      - may have multiple of these
      - note, if you click on this it will show the lines it parses. as it hits a css link in the head, it will pause and then start working on that css
    - Parse Style Sheet 
      - may have multiple of these (i.e. imported .css styles from other libraries etc like script tags)
    - it then goes to 'Recalculate Style' (combines DOM and CSSOM) to build render tree
    - it goes to layout (skip)
  - `Network` area, you can scroll in and out to see when the files were loaded etc. the main thread will correlate with these
    - scroll all the way out to see the whole thing

  - when we go into settings and throttle the CPU we can simulate older mobile devices 
    - when throttling, parse style sheet / recalculate style / layout takes a lot longer: this is critical render path blocking, so the user sees nothing at this point
    - the FP (first paint) is when the user sees the first pixel on the screen

#### Layout 
- Layout is the process that calculates the geometry of the elements, width / height etc 
- Converted into pixels, i.e. 1rem converted into pixels
- Output of layout process is 'box model' 
- Browser begins at the root of the render tree
  - one element can affect other 
  - width of the parent element effects childs with for example 
- You can also find 'layout' when using chrome dev tool profiling 
  - layout creates a box model for each element 

#### Paint 
- Converting actual layout to pixels on the screen
- Browser needs to rasterize it to paint each element 
- to see the 'paint profiler' you need to go to settings in the performance tab, and tick 'enable advanced paint instrumentation'
  - can now click on the green Paint bar in main, then the paint profiler tab 
- We have multiple paints as the browser needs to make multiple layers

#### Update Layer Tree 
- The 'update layer tree' is where the browser figures out how many layers are needed for the page 
- We can manage how many layers we have 

#### Composite Layers 
- The process where the painted layers are put together on the screen
- To see the visual layers, in dev tools click the three dots => more tools => layers. on the left menu you can open it and hover over all the different layers
- Generally let the browser figure it out, but we can alter layers to improve the runtime performance

---

## Optimising Critical Rendering Path

### Frame Rate 
- visual changes like scrolling, animations, etc. The browser will render a new frame. Most screens render 60 frames per second, and we need to match that. 
- For a smooth animation, we only have about 12ms per frame. If it takes longer than this, the frame rate will drop. 
- in devtools => performance, once you have done a recording you can see the 'frames' section which shows how long each frame took to load. 
- on windows, CTRL + SHIFT + P and type 'frames per seconds' to open this box, which will show the frame rate

### The performance of style calculation - Optimisation
- the number of elements is important, as well as less styles 
- achieved by writing less / more efficient CSS 
  - if you see websites with styles constantly overwriting previous styles, this will slow everything
  - its got new CSS fixing old CSS 
  - ideally use modual CSS 
- more specific selector requires more work
````js
<nav id="header">
  <ul class="sidebar">
    <li class="list_item">item 1</li>
  </ul>
</nav>
````
  - the above `li` element is possible to select in many ways.
    - e.g. with the class `.list_item {}` or with a more complex selector like this: `nav#header ul.sidebar li {}`
      - in the second case, the browser finds all li elements, then all the ones with the sidebar class, then the ones with the nav/header id. this takes more work!
    - the first li selector `.list_item {}` is way faster. 
    - in general, the browser does selector matching very quickly though. optimising layout and paint gives us more benefits
  
## Paint Profile 
- to see re-paints, open dev tools => 3 dots => more tools => rendering. this opens a tab in the console area, click on the paint flashing checkbox
  - it flashes green what areas need to be repainted
- open the layers tab and click on something that has repainted - you can see the "paint count" attribute 
  - in this example it renders 65 times

## Performance Analysis 
- initially .sidebar is at `position: absolute`, and .sidebar.is-open is `left: 0px`, he adds `transform: translateX(0)` to the .sidebar class, and changes .sidebar.is-open to `transform: translateX(450px);`, increases the frame rate drastically.
- now its rendering 35 times, but this can be lessened using layers 

### How layers work 
- we can use layers now to render it twice 
  - in general, creating layers is an automated process - leave it to the browser
  - if you're having a paint issue, you may want to promote an element to its own layer 

#### Creating a layer 
- best way is to use the `will-change: transform;` property
  - supported by all new browsers
  - hack for older browsers: `transform: translateZ(0);`
- now the paint count is 2! 
- if he adds the `will-change: transform;` to the body, it makes everything its own layer.
  - this slows the page a lot, because we have thousands of layers - the page becomes very slow
  - theres a trade off between creating layers and reducing paint time 

- Promote layers only when it makes sense 
- Avoid the paint problem
- Let the browser manage layers 
- Layer management and compositing are not free 
- Never promote elements without profiling (using the browser tools)





---


NOTE: when done, add to readme.md in summary form.