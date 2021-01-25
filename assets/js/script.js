// empty tasks objects
var tasks = [];

// displays current day
var currentDate = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text(currentDate);


// fill in tasks 
var fillTasks = function(taskTime, taskText) {
    // selects the timeBlock with the corresponding data attribute
    var timeBlock = $("[data-time=" + taskTime + "]");
    // updates the text area with the stored task
    $(timeBlock).find(".description").text(taskText);
};

// load tasks
var loadTasks = function() {
    // checks the local storage and turns any saved tasks into an object
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // if localStorage is empty, creates a new object to track task arrays
    if (!tasks) {
        tasks = [];
    }

    // loops through each index of array and runs the object properties through the fillTasks function
    $.each(tasks, function() {
        tasks.forEach(function(task) {
            fillTasks(task.time, task.task)
        })
    });
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// check tasks against time
var checkTasks = function() {
    $(".time-block").each(function() {
        // grabs the data attribute of the current time block
        var date = $(this).attr("data-time");

        // takes the data attribute value and converts it into the corresponding hour
        var time = moment(date, "HH");

        // variables to take the current time and turn it in a 24-hour. 
        var currentTime = moment().format("HH");
        var timeFormat = "HH";

        // removes any classes from the timeblocks
        $(this).find(".description").removeClass("past present future");

        // compares current time to the time block and assigns corresponding color
        if (moment(currentTime, timeFormat).isBefore(time)) {
            $(this).find(".description").addClass("future");
        } 
        else if (moment(currentTime, timeFormat).isAfter(time)) {
            $(this).find(".description").addClass("past");
        }
        else {
            $(this).find(".description").addClass("present");
        }
    });
};
    
// time block button clicked
$(".time-block .saveBtn").click(function() {
    // get text of closest textarea with class of description
    var taskText = $(this).siblings(".description").val();

    // get time by data type
    var taskTime = $(this).parent("div").attr("data-time");

    // if taskText and taskTime are true, push values to tasks object
    if (taskText && taskTime) {
        tasks.push({
            time: taskTime,
            task: taskText
        });

        // calls function to save tasks to localStorage
        saveTasks();
    }
});

// clear tasks button was pressed
$("#clear-tasks").on("click", function() {
    for (var key in tasks) {
        tasks[key].length = 0;
        $(".description").empty();
    }
    localStorage.clear();
});


loadTasks();

// calls checkTasks function every 30 mins to update when tasks are due
setInterval(checkTasks(), (1000 * 60) * 30);