# Mazing

---

Mazing is a browser app, in which a user may generate or create a maze on his own.
Generating a maze may be done using one of the selected algorithms.
With created maze user can use one of the selected pathfinding algorithms.
Selected algorithm will then run creating an animation of sorts, showing how the algorithm works.
When it's done a determined difficulty of the given maze will be shown.

---

This section serves development purposes. I'm using it to track what needs to be done, because why not.

#### TODOS

#### NOTES

- Settings menu will have to be changed.
  > Current settings menu feels clunky to use. At this stage of making this app it will do but down the line, it will have to be remade.
  > This will probably result in rewriting big portion of html and some code of this app. But it should be easier to desing when i know what exact functionalities the app will end up having.
- State managment
  > App has redux like (but not redux library itself) state managment implmeneted. I'm not certain i should have it in the first place. Canvas and Grid sections of code work together completley omitting it, since they work a lot with eachother. For now state management serves more like a talking point between canvas/grid and menu. I'm considering using some sort of facade class instead of it. Will see.
