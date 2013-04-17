# espn_scraper
============

Scrapes ESPN fantasy data


## breakdown.js

For use in Head-to-Head Most Categories league. Download or copy breakdown.js. Follow the instructions in the comments
at the top of the file to fill the appropriate variables with data from your league. You can follow breakdown-hlb.js
as an example. This is all very hacky, so forgive any bad form. The idea is to make this as easy as possible with
as little set-up as possible. 

Then go to your league's scoreboard page and paste the code into the console. If you're in Chrome, you can find it under
Tools > Developer Tools and then go to the 'console' tab in the developer tools. You can also use cmd+option+i to open
the dev tools if you're on OSX. 

Once you paste the code into the console, type 
```
bd()
```
and it will print out your league's breakdowns and highs for the week, foramtted for pasting into ESPN's message board
or League Message. At the bottom, you'll see an updated version of the hist object. Copy that and paste it over the hist
at the top of the code. It's hacky, but it's the easiest way to update your history without having to worry about whether
or not you want it to (i.e., you can run this code throughout the week without having to worry about it overwriting your
history when you don't want it to). 



## auction_reorder.js

If you had an auction draft, you can paste this into the draft recap page (same way as above), and it will reorder your 
draft to be by nomination order. You can then save that html if you want to keep a copy of it. It'll download additional 
files for stylings and scripts in a folder when you do that. You can discard those. 


## projections.js

This is for the ESPN inSider custom auction values printable page. Right now, it's completely tailored to my league's 
6x6 format, and only for hitting. You'd have to reverse engineer it for your own use if you wanted. 
