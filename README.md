# daily-calendar-cli

## What it does?
Takes two templates for my daily routines — Work days and Leisure days — and generates them for the next or current day for Google Calendars

## Why I made it
This summer, I decided that I would try and follow a daily routine to keep myself on track and have some discipline in my life. I figured
that if I would be following a daily routine, I would be filling in my calendar with the same things nightly. The only things that would change on a 
daily basis are the type of day I was planning, the morning workout I would do, and the work / activities I would allocate to the main period of my day. 

## How did I address the problem?
My problem was that I had the same repetitive task every night that I could automate. I knew that on work days, 11-5 would be my "main" period, or the period
that I got my work done. Everything else in my schedule would be the same except for the morning run. So I decided to save the static events in a file called 
`default.json`, which stores the static events for work days and leisure days. The command line app would ask me what kind of day I would like to plan
and based on that answer, it would pull the static events from the file, and then prompt me whether I wanted to split up my minutes in the main period
or just allocate it all to "work" or "leisure"