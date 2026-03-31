# Rock Paper Scissors (but improved)

Hey, welcome to my Rock Paper Scissors project. I decided to build this to practice some vanilla JS and CSS, but I got a bit carried away and added a bunch of extra features to make it more fun than the standard boring version.

 What it does :-

It's rock paper scissors, obviously, but here is what makes this one better:
1. **Game Modes:** You can play normal endless mode, or do a "Best of 3" / "Best of 5" series. 
2. **Two AI Difficulties:** "Normal" just picks random moves. "Hard" mode actually tries to predict your next move by looking at the last 5 things you played. So if you keep spamming Rock, it'll figure it out and start throwing Paper.
3. **History Tracker:** There's a live table showing the results of your recent rounds so you can spot patterns. 
4. **Lifetime Stats:** I used localStorage so your overall win/loss/draw record stays even if you close the browser window.
5. **UI & Animations:** Added some glassmorphism effects and a confetti burst when you win a series. 

# How to use it

You don't need npm or node or anything complicated. Just open "index.html" in your browser and you're good to go. 

Files included:
1. index.html - the main page layout
2. style.css - all the styling (using the Outfit font)
3. script.js - handles the game logic, the AI brain, and the local storage stuff

Feel free to mess around with the code, especially the hard mode logic if you think you can make the AI even smarter!
