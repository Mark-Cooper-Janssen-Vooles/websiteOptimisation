# Scalable JS Application Architecture 

Notes on talk from here: https://www.youtube.com/watch?v=vXjVFPosQHw

- Base JS library is the bottom
  - Application Core is on top of that 
    - Sandbox is on top of that 
      - Modules on top of that 

## Module Theory
  - everything is a module 
  - i.e. each card on a website could be a module
    - or even, each header of each card could be its own module 
- Web application modules consist of HTML + CSS + Javascript 
- Any single module should be able to live on its own - i.e. self-contained
- Loose coupling is important: it allows you to make changes to one module without affecting the others 
- Each module has its own sandbox: an interface with which the module can interact to ensure loose coupling

## Modules 
- have limited knowledge of whats going on in the page. They know about the sandbox, but not about other modues 
- a modules job depends on the module - it is domain specific, each modules job is to create a meaningful user experience within its boundaries 
- the web application is created as a result of all parts doing their job 
- modules need a strict set of rules so they don't get into trouble 
- module rules:
  - hands to yourself. 
    - only call your own methods or those on the sand box 
    - don't access DOM elements outside of your box
    - don't access non-native global objects: this creates a strict dependency whereever the module lives 
  - ask, don't take 
    - anything you need, ask the sandbox 
  - don't leave your toys around
    - don't create global objects: pollutes it for everyone else 
  - don't talk to strangers
    - shouldn't be talking to other modules on the page 
- modules must stay within their own sandboxes. 

## Sandbox
- the sandbox ensures a consistent interface to the modules 
- the sandbox also acts like a security guard: it knows what modules are allowed to access, and what they're not
- Sandbox jobs:
  - consistency 
    - interface needs to be dependable 
  - security 
    - determine which parts of the framework a module can access 
  - communication
    - translate module requests into core actions 

## The Application Core  
- The core manages modules 
- Tells a module when it should initialise and when it should shutdown 
- Manages communication between modules 