# Website Optimisation

Contents:
- [Impact from CSS on website performance](#css-impact)

---

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

Style Calculations:
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