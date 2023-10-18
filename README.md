# Website Optimisation

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

Contents:
- [Web Performance](#building-faster-website-web-performance)
- [Impact from CSS on website performance](#css-impact)
- [Scalable JavaScript Application Architecture](#scalable-javascript-application-architecture)


---

## Building Faster Website: Web Performance 
Building faster websites: focusing on looking at performance of delivery of assets.

[Web Performance](./building-faster-websites.md)

---

## CSS Impact
Focusing on rendering performance through the lense of CSS.
The critical rendering path is the sequence of steps the browser goes through to convert HTML, CSS and Javascript into pixels on the screen.
By focusing on CSS we can perform runtime performance 

Optimise CSS by:
- Minimising critical resources 
- Minimise critical bytes 

CSS is render blocking by default - anything blocking the critical rendering path means the user will get a blank screen. 

[CSS Performance Notes](./CSS-website-performance.md)

---

## Scalable JavaScript Application Architecture 
12 year old notes on yahoo's architecture 
(not as important as top two)

[Yahoo scalable architecture](./Scalable-JS-architecture.md)

---