/**
 * Dependencies: 
 * This script needs jQuery in order to work. JqueryUI with tooltips is heavily recommended. 
 */

/**
 * Autoexecuted closure that initializes Dateranges object with two API functions: ForbiddenRange and EnabledRanges -which are
 * inner members from this Dateranges-.
 * 
 *  See RangesLogic inner closure docs to check the API from them, since ForbiddenRange and EnableRange are RangesLogic objects. 
 *  
 */
var DateRanges = ( function(){
		
		/**
		 * Closure with the logic to check date ranges. check DateRestraints closure below to see usage examples.
		 * 
		 * remember that, while this patter simulates a class, is ACTUALLY a function. It have some logic, function calls and 
		 * need function definitions and calls to have some chronological order. Be careful not messing with inner logic. 
		 * 
		 * API:
		 * debug : log range data to the console. 
		 * contains : returns wether the range contains given Date. Use of this method is about to be needed in every beforeShowDay method.
		 * getClass : get the html class assigned to datepicker cells belonging to this range. 
		 * getTooltip : get the tooltip assigned to datepicker cells belonging to this range. 
		 * toBeforeShowDay : return the range as the native jQueryUI datepicker data type. 
		 * setClass: set the html class assigned to datepicker cells belonging to this range. 
		 * setTooltip : set the tooltip assigned to datepicker cells belonging to this range.
		 * 
		 */
		var RangesLogic = ( function( $sd , $ed ){
			
			/**
			 * DATA VARS DEFINITION: initialize vars with some value to avoid warnings. 
			 */
			//starting and ending date of a range. 
			var startingDate = {};
			var endingDate = {};
			//classes added to the datepicker cell
			var rangeClass = "";
			//tooltip message for matched datepickers cell
			var rangeTooltip = "";
			//boolean to disable or not given cell in datepicker
			var enabled = {};
			
			/**
			 * FUNCITON VARS DEFINITION:
			 */
			//setters: 'private' and automatically used by the system on construct
			var setStartingDate = function(){
				startingDate = $sd;
			};
		
			var setEndingDate = function(){
				if (typeof( $ed ) == "undefined" )
					endingDate = $sd;
				else
					endingDate = $ed;
			};
			
			//init methods: initialize class, tooltip and enable vars to proper values on construct
			var initClass = function(){
				if (typeof( $class ) == "undefined" )
					rangeClass = "";
				else 
					rangeClass = $class;
			};
			
			
			var initTooltip = function(){
				if (typeof($tooltip) == "undefined")
					rangeTooltip = "";
				else
					rangeTooltip = $tooltip;
			};
			
			
			var initEnabled = function(){
				if ( typeof($enabled) == "undefined" )
					enabled = true;
				else 
					enabled = $enabled; 
			};
			
		//Logic: 
			 setStartingDate();
			
			 setEndingDate();
			 
			 initClass();
			 
			 initTooltip();
			 
			 initEnabled();
			 
			 //manual use setters. Client is about to use some of these when creating beforeShowDay methods
			 var setClass = function( $class ){
				 rangeClass = $class;
			 };
			 
			 var setTooltip = function( $tooltip ){
				 rangeTooltip = $tooltip;
			 };
			
			 /**
			  * Since this is returned by the API, there's no need to manually use this function since EnabledRange and ForbiddenRange 
			  * transparently use this to enable/disable days.
			  */
			 var disable = function(){
				 enabled = false;
			 };
			 
			 //getters
			 var getTooltip = function(){
				 return rangeTooltip;
			 };
			 
			 
			 var getClass = function(){
				 return rangeClass;
			 };
			
		
			 /**
			  * checks if the range have the end of a year between its limits. Its a helper method to dealWithYearEnd 
			  */
			var hasYearEnd = function(){
				
				if (startingDate.month > endingDate.month)
					return true;
				
				else if ( startingDate.month === endingDate.month )
					return startingDate.day > endingDate.day;
		
				if (endingDate.month > 12)
					return true;
				
				return false;
			};
		
			/**
			 * Modify the ending date month if the range has a new year between the starting date and the ending date. 
			 * This will be automatically called on construct. 
			 */
			var dealWithYearEnd = function(){
				
				if (!startingDate)
					return;
				
				if (hasYearEnd() )
					endingDate.month += 12;
				
				return false;
		
			};
			
			//this is an inner logic function call and it is mandatory. Be careful messing with this call. 
			dealWithYearEnd();
			
			/**
			 * Helper getters used by private functions.
			 */
			var getStartingDay = function(){
				return startingDate.day;
			};
		
			var getStartingMonth = function(){
				return startingDate.month;
			};
		
		
			var getEndingDay = function(){
				return endingDate.day;
			};
		
			var getEndingMonth = function(){
				return endingDate.month;
			};
			
			
			/**
			 * returns if this range contains given date.
			 * @param date
			 * @returns {Boolean}
			 */
			var contains = function(date){
				
				return containsEndingDate(date) && containsStartingDate(date);
			};//end contains
			
			
			
			//private helper functions to contains. 
		
			var containsEndingDate = function(date){
		
				if (containsEndingMonth(date) )
					return true;
				else if (containsEndingDay(date))
					return true;
		
				return false;
			};
		
		
		
			var containsStartingDate = function(date){

				if (containsStartingMonth(date) )
					return true;
				else if (containsStartingDay(date))
					return true;
		
				return false;
			};
		
		
		
		
		
		
			var containsEndingDay = function(date){
		
				if (endingMonthsEquals(date))
				return getEndingDay(date) >= date.getDate();
		
				return false;
			};
		
		
			var containsStartingDay = function(date){
		
				if (hasYearEnd() ){
					if ( getEndingMonth() == date.getMonth() + 13)
						return getEndingDay(date) >= date.getDate() ; 
				}//end if hasYearEnd.
				
				if (startingMonthsEquals(date))
					return getStartingDay(date) <= date.getDate() ;
		
				return false;
			};
		
		
			var endingMonthsEquals = function(date){
		
				return getEndingMonth(date) === date.getMonth() + 1 ;
			};
		
		
			var startingMonthsEquals = function(date){
		
				return getStartingMonth(date) === date.getMonth() + 1 ;
			};
		
		
		
			var containsEndingMonth = function(date){
		
				return getEndingMonth() > date.getMonth() + 1 ;
			};
		
		
		
			var containsStartingMonth = function(date){
		
				if (hasYearEnd() ){
				
					if (getEndingMonth() > date.getMonth() + 13)
						return true;
				}
				
				return getStartingMonth() < date.getMonth() + 1 ;
			};
		
		
			
			/**
			 * translate range data to native jQueryUI beforeShowDay return data type, wich requires an array. So client is isolated from using that data type,
			 * needs only to set properties as tooltip and class with this API and return this function. See Daterestraints to get some examples.  
			 */
			function toBeforeShowDay( ){
				
					return [ enabled , rangeClass , rangeTooltip  ];
			};
			
			function debug(){
				
				console.log("starting date:  month: " + startingDate.month + "  day: " + startingDate.day );
				console.log("ending date:  month: " + endingDate.month + "  day: " + endingDate.day );
				console.log( "has an end? : " + hasYearEnd() );
				
				return false;
			};
			
			
			/**
			 * PUBLIC API
			 */
			
			//error holding
			if (!jQuery)  
				throw new Error("Dateranges requires jQuery");
			if ( typeof($("").datepicker) !== "function" )
				throw new Error("While jQuery is installed, its datepicker() function can't be found. get a jQuery distribution with datepicker utility");
			if ( typeof($(document).tooltip) !== "function" )
				console.warn("JqueryUI script is not running, or you're using a distribution with no tooltips utilities. While this tooltips works properly " +
						"just with bare jQuery, the jQueryUI tooltip plugin is needed to style them easily and work with custom themes");
			
			
			else 
				//API return for RangesLogic. Since this works as a "nested class", this is a "private" API, wich client
				//can reach only throught ForbiddenRange or EnabledRange, but never directly from RangeLogic, since this closure itself
				//isnt returned by Dateranges
			return {
				debug : debug,
				contains : contains,
				getClass : getClass,
				getTooltip : getTooltip,
				toBeforeShowDay : toBeforeShowDay, 
				setClass : setClass,
				setTooltip : setTooltip, 
				disable : disable, 
			};
			
		});//end ranges logic module
		
		
		/**
		 * Public closure that creates a range of disabled days. 
		 * 
		 */
		var ForbiddenRange = function( $sd , $ed){
			
			if (!$sd )
				throw new Error("You need to define at least a starting day when creating a forbidden range!");
			
			var result = RangesLogic( $sd, $ed );
			
			result.disable();
			
			return result;
		};
		
		
		/**
		 * Public closure that creates a range of enabled days. 
		 */
		var EnabledRange = function( $sd , $ed ){
			
			return RangesLogic( $sd, $ed );
			
		};
		
		/**
		 * PUBLIC API of DateRanges
		 */	
		return {
			EnabledRange : EnabledRange,
			ForbiddenRange : ForbiddenRange, 
		};
		
}) ();//end date ranges module. Note this is an autoexecuted function, so now a Dateranges object is tied to the DOM. 
//use DateRanges.EnabledRange() and DateRangs.ForbiddenRange() to generate day ranges for a datepicker. 



/**
 * Closure that generates collections of discontinued days. Have a similar API as DateRanges, despite the construct params 
 * are obviusly different, beign an array of strings representing dates. There are examples of this in DateRestraints. 
 * 
 * @warning see "isYearlyCollection" documentation to get more information about string formats to pass to this. Incorrect parameters
 * could lead in logical failures with no compilation error nor warning.
 */
var DatesCollection = ( function( $collection ){
	
	/**
	 * Array with string representing dates, having either "d/m" or "d/m/Y" format. 
	 */
	var collection = $collection;
	/**
	 * The class of the datepicker cells for this collection of dates.
	 */
	var daysClass = "";
	/**
	 * The tooltip of the datepicker cells for this collection of dates. 
	 */
	var daysTooltip = "";
	
	/**
	 * wether enable or disable these days in the datepicker. 
	 */
	var enabled = false;
	
	
	var enable = function(){
		
		enabled = true;
	};
	
	var disable = function(){
		
		enabled = false;
	};
	
	
	var setClass = function ($class){
		
		daysClass = $class;
	};
	
	var setTooltip = function($tooltip){
		
		daysTooltip = $tooltip;
	};
	
	
	/**
	 * return the collection of days as the native beforeShowDay jQuery UI data type.
	 */
	var toBeforeShowDay = function(){
		
		
		return[ enabled , daysClass , daysTooltip];
		
	};
	
	
	/**
	 * Detects wether a collection of days uses a year format or not. 
	 * @warning use of complete year format, with four digits, is MANDATORY in order to
	 * have this working.
	 * @warning this reads only the first date of the collection. Having a collection
	 * with both "d/m" AND "d/m/Y" format strings will generate a logical failure of the 
	 * application, probably SILENTLY. So be care about this. of course, use another 
	 * string date formats will cause the same kind of issues. 
	 * @param collection An array with strings like "10/10/2014" o "31/12".
	 */
	var  isYearlyCollection = function(  ){

		if (collection[0].match(/\d{1,2}\/\d{1,2}\/\d{4}/) )
			return true;

		return false;
	};
	
	/**
	 * returns if a collection of days like "dd/mm/yyyy" contains given Date.  
	 * @param date a js Date Object
	 * @param collection an array of strings representing dates with "dd/mm/yyyy" format
	 * 
	 */
	var dayInRangeYear = function (date ){
		
		var month = date.getMonth() + 1;
	    var day = date.getDate(); 
	    var year = date.getFullYear();
	    
	    var theDay = (day) + '/' + (month) + '/' + (year);
	    
	    for (var i = 0; i < collection.length; i++) {
	    	
	        if( ($.inArray( theDay , collection )) !== -1) 
	        	return true;
	    }//end for
	    
	    return false;
	};
	
	/**
	 * returns if a collection of "dd/mm" days contains a single date. 
	 * @param date a js Date Object
	 * @param collection an array of strings representing dates with "dd/mm" format
	 */
	var cyclicalDayInRange = function( date  ){

		
		var month = date.getMonth() + 1;
	    var day = date.getDate();
	    
	    var theDay = (day) + '/' + (month);
	    
	    
	    
	   
	    
	    
	    for (var i = 0; i < collection.length; i++) {
	    	
	        if( $.inArray( theDay , collection ) !== -1) 
	        	return true;
	    }//end for
	    
	    return false;
	};
	
	/**
	 * Returns if a date belongs to a range of values. 
	 * @param date javascript Date object. 
	 * @param range an array of string either with "d/m/Y" o "d/m" format. 
	 * This methods deals with the difference of format automatically
	 */
	var contains = function( date  ){
		
		
		if (isYearlyCollection())
			return dayInRangeYear(date );
		else 
			return cyclicalDayInRange( date );
		
	};
	
	
	
	
	/**
	 * Public API
	 */
	return {
		
		contains : contains ,
		setTooltip : setTooltip,
		setClass : setClass,
		enable : enable, 
		disable : disable,
		toBeforeShowDay : toBeforeShowDay, 
		
	};
	
} ); 


/**
 * Helper closure to generate enabled dates collections. 
 */
var EnabledDaysCollection = (function( $collection ){
	
	
	var enabledCollection = DatesCollection( $collection );
	
	return enabledCollection;
	
});



/**
 * Helper closure to generate forbidden dates collections. 
 */
var ForbiddenDaysCollection = ( function( $collection ){
	
	
	var forbiddenCollection = DatesCollection( $collection );
	
	forbiddenCollection.disable();
	
	return forbiddenCollection;
	
});


/**
 * Closure to place restraint methods to call with the beforeShowDate jQuery UI datepicker function. 
 * 
 * You dont have to use this closure to place these methods, they are tied to the DOM and available form every script (while EnabledRange and
 * ForbiddenRange must be invoked throught DateRanges). 
 * But have every restraint method grouped in a single closure is probably better than not. 
 */
var Daterestraints = ( function(){
	
	//valid Date Collections examples: 
	//cyclical:
	var spainDisabledDays = [/*january: */ "1/1", "6/1", 
	                         /*March:*/  "28/3", "29/3", "30/3",
	                         /*April:*/  "17/4" , "18/4", "19/4", "20/4",
	                         /*May: */  "1/5" , "4/5", "11/5" , 
	                         /*August:*/  "15/08",
	                         /*October:*/ "12/10" ,
	                         /*November*/ "1/11" , 
	                         /*December*/ "6/12" , "8/12" , "25/12"];
	//year specific:
	var yearDaysExample = [ "17/3/2014" , "20/3/2014" ];
	
	
	/**
	 * This is just an example of a restraint method that you could pass to a datepicker: 
	 */
	var basicRestraint = function( date ){
		
		//define your ranges:
		christmasRange = DateRanges.ForbiddenRange( {'day' : 24 , 'month' : 12} , {'day' : 6, 'month' : 1} );
		christmasRange.setClass("christmas");
		christmasRange.setTooltip("christmas tooltip");

		summerRange = DateRanges.ForbiddenRange( {'day' : 1 , 'month' : 7} , {'day' : 1 , 'month' : 9}  );
		summerRange.setClass("summer beach hotchicks"); //you can generate several classes.
		summerRange.setTooltip("summer tooltip");
		
		//check if the date is container by the range and return its beforeShowDay representation:
		if ( christmasRange.contains( date )  )
			return christmasRange.toBeforeShowDay() ;
		
		if ( summerRange.contains( date )  )
			return summerRange.toBeforeShowDay();
		
		
		var superDays = ForbiddenDaysCollection([ "1/3" , "22/3"]);
		
		superDays.setClass("super-days");
		superDays.setTooltip("Suuuper days!!! :-D");
			
		
		if (superDays.contains(date) )
			return superDays.toBeforeShowDay();
	
		
		
		//you dont need to pass params to a EnabledRange, just set all dates enabled by default. 
		enabledRange = DateRanges.EnabledRange();
		enabledRange.setTooltip("valid date");

		return enabledRange.toBeforeShowDay();
	};
	
	/**
	 * PUBLIC API
	 */
		return {
			basicRestraint : basicRestraint,
		};
	
} ) () ;//note this is an auto-execute function























