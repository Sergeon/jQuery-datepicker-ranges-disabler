jQuery-datepicker-ranges-disabler
=================================

An human-firendly set of facilities to manage jQuery datepickers dates restrictions and tooltips


[![License](https://poser.pugx.org/leaphly/cart-bundle/license.png)](https://packagist.org/packages/leaphly/cart-bundle)



This is a javascript plugin to help modifying jQueryUI datepickers, passing proper values to its beforeShowDay method to disable/enable days and set its 
html classes and tooltips, in a naive way.

## Author

Mauro Caffaratto

## License

licensed under the [MIT][mit] and [GPL][gpl] licenses


##Dependencies
This script needs jQuery and jQueryUI (with datepicker and tooltips plugin).

## Fast example
```javascript
//Create a function that will be passed to datepicker beforeShowDay :

function myExampleRestraint( date ) { 

	//Create a Daterange. For example, we want to disable summer days between Juny 20th  and September 1st:
	var summerRange = Dateranges.ForbiddenRange( {'day' : 20 , 'month' : 6 } , {'day' : 1 , 'month' : 9 } ); 
	
	//set classes and tooltips for these days: 
	summerRange.setClass("summer-day");
	summerRange.setTooltip("Sorry , bookings are unavailable during summer.");
	
	//check if the summerRange contains date. if so, return its toBeforeShowDay(). [the date param will be automatically given by the datepicker for EVERY day displayed]
	if (summerRange.contains(date) )
		return summerRange.toBeforeShowDay();
	
	//now, generate an EnabledRange to set class and tooltip for the rest of the days: 
	var availableDays = DateRanges.EnabledRange();
	availableDays.setTooltip("Enjoy your stay!!");

	return availableDays.toBeforeShowDay();

}//end myExampleRestraint function

//now, create a datepicker passing myExampleRestraint to beforeShowDay

$("#booking-datepicker").datepicker({beforeShowDay : myExampleRestraint });
//as you see, you can't pass params to your beforeShowDay functions: the datepicker automatically will invoke it for every displayed day and pass
//that day date as the unique parameter. 
```



A facility to generate non-continuum days collection is also provided: 


```javascript
function myExampleRestraint( date ){

//set up an array with the days you want to disable (see details in the docs about valid formats):
var forbiddenDays = [ "24/12" , "31/12" , "1/1" , "6/1"];
var yearSpecificForbiddenDays = ["8/10/2014" , "5/5/2014"];

//pass it to a convenient object:
var forbiddenCollection = ForbiddenDaysCollection( forbiddenDays );

var forbiddenSpecificYearCollection = ForbiddenDaysCollection( yearSpecificForbiddenDays );

//set values:
forbiddenCollection.setClass("disabled");
forbiddenCollection.setTooltip("Sorry, our store doesn\'t open this day :-( "); //will be shown as tooltip for these days in EVERY year 

forbiddenSpecificYearCollection.setTooltip("Sorry, in 2014 our store doesn\'t open this day :-( "); 


//check and return: 
if( forbiddenCollection.contains(date))
	return forbiddenCollection.toBeforeShowDay();
	
if (forbiddenSpecificYearCollection.contains( date ) )
	return forbiddenSpecificYearCollection.toBeforeShowDay(); 

//There is no need to return something in every fuction call. That just let that day as enabled with no extra class nor tooltip.
}
```


##In-depth explanation: 

This script define some closures wich provides facilities to work around the datepicker beforeShowDay functions. The top-level API contains:

DateRanges() : autoexecute function wich in turn returns two closures to deal with continuous ranges of dates:
	DateRanges.ForbiddenRange()
	DateRanges.EnabledRange()
	
	--to work with non-continuous dates collections:
	DatesCollection()
	ForbiddenDaysCollection()
	EnabledDaysCollection()

	--to place your beforeShowDay functions (also contains some examples and documentation):
	DateRestraints()


ForbiddenRange and EnabledRange let to define continuous dates ranges and manually set its classes and tooltips in the datepicker, while 
ForbiddenDaysCollection and EnabledDaysCollection represents non-continuous dates collections, constructed from an array of strings. 

DatesCollection represents a non-continous days collection too, that must be enabled or disabled manually. Its use if discouraged unless you 
need to switch its availabilty dinamically after construction.

Since these functions return objects, the first letter is uppercase. That DOESN'T MEAN THEY ARE CONSTRUCTORS: call them with the new keyword 
shouldn't do harm since 'this' keywork is never used, but you don't need to invoke them as constructors, it is not its intended use and I don't know
if do that could lead to a bug.     



Both ranges and collections have the same API:

contains(date) : return wether a date is contained by the range/collection. Its a javascript Date object and is automatically invoked by the datepicker for
every datepicker date. 

toBeforeShowDay : return an array with the datepicker jQueryUI beforeShowDay native data representation, wich is: 
[0] => a boolean claiming wether to disabled that date or not.
[1] => a string with the class to add to the datepicker cell for that date
[2] => a string with the tooltip to add to the datepicker cell for that date 

just return toBeforeShowDay() function isolates client to deal with this data type. 

setTooltip(), setClass(): set tooltip and class internal vars wich be returned when toBeforeShowDay() is called. 

##Usage: 

define a function to pass to beforeShowDay. Collections and Ranges of dates are intented to be used inside these functions. 
pass it to beforeShowDay when creating a datepicker:
```javascript
$("#datepicker").datepicker({ beforeShowDay : DateRestraints.myFunction }); 
//you can define a restraint function to pass to beforeShowDay in every script. But place them inside the DateRestraints closure 
//is the best practice. 
```

More Documentation and examples can be find in the code itself. Also, every non-obvius function have meaningful comments.


##TroubleShooting:

*Tooltips displays with no styles, or even doesn't display at all: 

···Do not forget to execute: 
```javascript $( document ).tooltip(); ```
 As document load. Also, you need the jueryUI tooltip plugin in your jqueryUI script. 
	
*The datepicker ignore a DateCollection, ForbiddenDaysCollection or EnabledDaysCollection totally:
···To use string formats like "01/05" instead of "1/5" (1st of May) will cause this. 
···To use different formats can cause this issue too: pass [ "1/5" , "10/5/2014" ] to a range will cause the second date to be completely ignored.
	
* So, what if I want to combine that days?
···To combine two different kind of collections, just create two different collections passing different arrays as params, one with the year format and other with the "d/m" format.  
	
* I completely disabled the current month dates, and still the datepicker raises in the current month, with all its dates disabled, while I want it to raise in the first next month with an available date. 
	
···The native beforeShowDay utility is not intented to manage the month the datepicker displays on creation. You must pass a minDate value to the datepicker in construction: 
	
	```javascript
	//lets imagine that today is first of march of 2014, but all march month is disabled by the DateRestraints.march() method: 
	$("#datepicker").datepicker( beforeShowDay : DateRestraints.march , minDate : new Date(2014 , 3, 1) );
	
	//that code will set the 1st of April of 2014 as the minimum selectable date, and cause April 2014 to be the month displayed on creation (assuming we really are
	//in the 1st of March, so that date is not yet passed ). Be careful with the Date() constructor since it understand January as the 0 month, so the 3 is for
	//April (while our ranges and collections construct months human-friendly).   
	```
	
	
* Can I create a one single day range? 
···Yes, by passing just only a parameter instead of two. 	
	
	
*I want to create an everlasting range: 
···This is not supported. You can just return an array with [enable/disable , desiredClass , desiredTooltip] as the very last statement of your restraint method,  so every day that doesn't match any other range will display that behaviour.
	
*My script doesn't recognize your plugin functions.

···Obviusly, this could be caused by incorrect routing to the script. 
	
···Less obvious, maybe you tried to use some utilities before the script is loaded. This could happend if you use to load some of your js scripts at the very end of the <body> tag, while your datepicker creation code is running before. If you didn't wait to the document to load before your datepicker creation call, wrapping your datepicker creation code between $( function() {  //your code here// }); should be the solution, and will make the script to work no matter where in the code it is invoked, since the code wrapped that way will not execute until the document is ready:
	
	```javascript
	$(function (){
		$( document).tooltip();
		$("#myDatepicker").datepicker( beforeShowDay : DatesRestraints.somefunction ); //this will work even if DatesRestraint loads at the very end of <body>
	} );//end jQuery docuement on load 
	``` 
	 
*Can I change the ranges or collection dates dinamically? 

···Since they come with no API to modify its inner values and these values are encapsulated by a closure, you can't (but you can do enable or disable a DateCollection on the fly). By the way, once the dapicker its created, change a range used in its beforeShowDay function would have no effect, even if you could. The best way to change a datepicker dinamically is to destroy it and create a new one. 
	

 





