

(function () {
  // Import Zendesk SDK
  // get() - read
  // set() - write
  // on() - listen
  // request() - Http Request 
    var client = ZAFClient.init();

    // Size from App if in sidebar
    client.invoke('resize', { width: '200px', height: '200px' });

    // Get USER INFO as get
    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          requestUserInfo(client, user_id);
        }
      );


    // GET TICKET INFO as request
    client.request('/api/v2/tickets/recent').then(
      function(tickets) {
        console.log(tickets);
      },
      function(response) {
        console.error(response.responseText);
      }
    );

      // Ticket info as get
    client.get('ticket').then(
      function(data) {
        var user_id = data['ticket'];
        console.log(user_id);
      }
    );

    // Ticket Info Custom Field 
    client.get('ticket.customField:custom_field_19134886927633').then(
      function(data) {
        var ticket_info = data['ticket.customField:custom_field_19134886927633'];
        console.log(ticket_info);
      }
    );

  

  })();

  
///// SHOW TICKET INFO 
function requestTicketInfo(client, id) {

  var settings = {
    url: '/api/v2/tickets/' + id + '.json',
    type:'GET',
    dataType: 'json',
  };

  client.request(settings).then(
    function(data) {
      showInfo(data);
    },
    function(response) {
      showError(response);
    }
  );
}

///// SHOW USER INFO
  function requestUserInfo(client, id) {

    var settings = {
      url: '/api/v2/users/' + id + '.json',
      type:'GET',
      dataType: 'json',
    };
  
    client.request(settings).then(
      function(data) {
        showInfo(data);
        console.log(data);
      },
      function(response) {
        showError(response);
      }
    );
  }
  

// Show Info User
  function showInfo(data) {
    var requester_data = {
      'name': data.user.name,
      'tags': data.user.tags,
      'created_at': formatDate(data.user.created_at), // should be ticket info
      //'finish_at': formatDate(data.user.finish_at) //     should be ticket info
    };
  
    var source = document.getElementById("requester-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
  }

 // Show Error  
  function showError() {
    var error_data = {
      'status': 404,
      'statusText': 'Not found'
    };
  
    var source = document.getElementById("error-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(error_data);
    document.getElementById("content").innerHTML = html;
  }


// Formate Date 
function formatDate(date) {
    var cdate = new Date(date);
    var options = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    date = cdate.toLocaleDateString("en-us", options);
    return date;
  }

