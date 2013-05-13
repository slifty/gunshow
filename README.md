Gun Show
==============
An interactive narrative to help viewers empathetically understand the US gun debate.

Floor Object
----------------
The convention is defined in json in the following format:
{
  "title": "", // The name of the convention floor
  "booths": [ ... ] // A list of booth objects
}

Booth Object
----------------
{
  "x": "", // distance from left in pixels
  "y": "", // distance from top in pixels
  "height": "", // height in pixels
  "width": "", // width in pixels
  "background_url": "", // URL for background
  "booth_url": "", // URL to go to when booth is clicked
}




Code Conventions
----------------

Indent using spaces (two spaces per indent)