//======================================================================================
// PROJECT NAME  : RFCAMPUS CENTRAL LIBRARY                                                               
// MODULE NAME   : CENTRAL LIBRARY                                                             
// PAGE NAME     : Google Calendar                                         
// CREATION DATE : 28-12-2020                                                         
// CREATED BY    : ROSHAN GOMASE                                       
// MODIFIED DATE :                                                                      
// MODIFIED DESC :                                                                      
//======================================================================================


var Googlecal = function () {
    var init = function () {
        $(".loader-area, .loader").css("display", "none");
        $(".loader-area, .loader").fadeOut('slow');


        $('#txtStartDate').datetimepicker({
            format: 'DD/MM/YYYY'
        });
        $('#txtEndDate').datetimepicker({
            format: 'DD/MM/YYYY'
        });

        $('#txtstarttime').datetimepicker({
            format: 'HH:mm:ss'
        });
        $('#txtendtime').datetimepicker({
            format: 'HH:mm:ss'

        });
        //handleClientLoad();

    };

    $('#btnSubmitEvent').click(function () {


        var Emailid = [];
        if($('#tags').val().trim() != '')
        {
            if ($('#tags').val().indexOf(",") != -1) {
                $.each($('#tags').val().split(","), function (i, e) {
                    Emailid.push( { 'email': e });
                });
            }
            else {
                Emailid.push( { 'email': $('#tags').val() });
                //Emailid=" { 'email': '" + $('#tags').val() + "' },";
           
            }
        }
        else{
            toastr.warning('Please Enter Email ID');
            return false;
        }

    
        if ($('#IsActiveMeet').prop('checked')) {
            var RandomString = create_UUID();
        }
      
        var ModifyEvent =false;
        var Inviteothers = false;
        var Seeguestlist = false;

        if ($('#IsModifyEvent').prop('checked')) {
            ModifyEvent = true;
        }
        else
        {
            ModifyEvent =false;
        }
        if ($('#IsInviteothers').prop('checked')) {
            Inviteothers = true;
        }
        else
        {
            Inviteothers = false;
        }
        if ($('#IsModifyEvent').prop('checked')) {
            Seeguestlist = true;
        }
        else
        {
            Seeguestlist =false;
        }

        if($('#txtSummary').val().trim() =='' )
        {
            toastr.warning('Please Enter Summary');
            return false;
        }

     


        if($('#txtStartDate').val().trim() !='' || $('#txtstarttime').val().trim()!='')
        {
            var StartDate = strToDate($('#txtStartDate').val() + ' ' + $('#txtstarttime').val());
            var IsoStartDate = new Date(StartDate);
        }
        else
        {
            toastr.warning('Please Select Start Date And Start Time');
            return false;
        }
        if($('#txtEndDate').val().trim() !='' || $('#txtendtime').val().trim()!='')
        {
            var EndDate = strToDate($('#txtEndDate').val() + ' ' + $('#txtendtime').val());
            var IsoEndDate =new Date(EndDate);
        }
        else
        {
            toastr.warning('Please Select End Date And End Time');
            return false;
        }

        var DayCount;
        if ($('#IsAllDay').prop('checked')) {
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
           

            DayCount = Math.round(Math.abs((IsoStartDate - IsoEndDate) / oneDay));

        }
        else
        {
            DayCount = 1;
        }
        
        var event = {
            //"calendarId": "primary",
            //"conferenceDataVersion": 1,
            'summary': $('#txtSummary').val(),
            'location': $('#txtlocation').val(),
            'description': $('#txtdescription').val(),
            'start': {
                'dateTime': IsoStartDate,
                'timeZone': 'Asia/Kolkata'
            },
            'end': {
                'dateTime': IsoEndDate,
                'timeZone': 'Asia/Kolkata'
            },
            'recurrence': [
              'RRULE:FREQ=DAILY;COUNT='+parseInt(DayCount)
            ],
            'attendees': Emailid //[
            //{ 'email': 'testlibrary464@gmail.com' }
            //{ 'email': 'sbrin@example.com' }
            //]
            ,
            'reminders': {
                'useDefault': false,
                'overrides': [
                  { 'method': 'email', 'minutes': 24 * 60 },
                  { 'method': 'popup', 'minutes': 10 }
                ]
            },
            //'conferenceData': {
            //    'createRequest': {
            //        'conferenceSolutionKey': {
            //            'type': 'hangoutsMeet'
            //        }, 
            //        //"status": {
            //        //    "statusCode": "confirmed"
            //        //},
                    
            //        'requestId': RandomString
            //    }
            //},
            'conferenceData': {
                'createRequest': {
                    'requestId': RandomString,
                    'conferenceSolutionKey': {
                        'type': 'hangoutsMeet'
                    }
                },
            },
            "guestsCanModify": ModifyEvent,
            "guestsCanInviteOthers": Inviteothers,
            "guestsCanSeeOtherGuests": Seeguestlist

           
        };

      
        if($('#hdeventid').val()=="0" ||$('#hdeventid').val()==0 )
        {
        
        

      
      
        var request = gapi.client.calendar.events.insert({

            'calendarId': 'primary',
            "conferenceDataVersion": 1,
            'sendNotifications' : true,
            'resource': event
        });

        //  request.setConferenceDataVersion(1);

        request.execute(function (event) {
            appendPre('Event created: ' + event.htmlLink);
            //alert(JSON.stringify(event));
            if(event.htmlLink == undefined)
            {
                toastr.warning('Event Not Craeted Please Try Again.');
            }
            else
            {
                toastr.success('Event created Successfully.');
            }
            cleardata();
        });
        }
        else
        {
            var event_id = $('#hdeventid').val()
            var request = gapi.client.calendar.events.patch({
                'calendarId': 'primary',
                'sendNotifications' : true,
                'eventId': event_id,
                'resource': event
            });

            request.execute(function (event) {
                if(event.htmlLink == undefined)
                {
                    toastr.warning('Event Not Craeted Please Try Again.');
                }
                else
                {
                    toastr.success('Event created Successfully.');
                }
                cleardata();
            });
        }
    });

    $('#btnClearEvent').click(function(){
        cleardata();
    });


    return {
        Init: init,
    }
}();


function cleardata()
{
    
    $('#hdeventid').val('0');
    $("#tags").tagsinput('removeAll');
    $('#tags').val('');
    $('#txtStartDate').val('');
    $('#txtstarttime').val('');
    $('#txtEndDate').val('');
    $('#txtendtime').val('');
    $('#txtdescription').val('');
    $('#txtSummary').val('');
    $('#txtlocation').val('');
    $("#myModal").modal('hide'); 
    $("#myModal1").modal('hide'); 
    $("#IsModifyEvent").prop('checked', false);
    $("#IsInviteothers").prop('checked', false);
    $("#IsSeeguestlist").prop('checked', false);
    $("#IsAllDay").prop('checked', false);
    $("#IsActiveMeet").prop('checked', true)
}


function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxx4xxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(10);
    });
    return uuid;
}

function strToDate(dtStr) {
    let dateParts = dtStr.split("/");
    let timeParts = dateParts[2].split(" ")[1].split(":");
    dateParts[2] = dateParts[2].split(" ")[0];
    // month is 0-based, that's why we need dataParts[1] - 1
    return dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0], timeParts[0], timeParts[1], timeParts[2]);
}

