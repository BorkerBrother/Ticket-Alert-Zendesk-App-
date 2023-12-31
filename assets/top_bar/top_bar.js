(function () {

    var client = getClient();
    
    checkAndUpdateAllTickets(client);
    checkAllTicketsForExpiry(client);
    updateIconCount();
    
  })();
  

function checkAllTicketsForExpiry(client) {
    setInterval(function() {
      // Hier rufst du die Funktion auf, die alle Tickets überprüft und den Status aktualisiert
      checkAndUpdateAllTickets(client);
    }, 60 * 1000); // 30 Sekunden Intervall (in Millisekunden)
  }
  

  // Funktion zum Überprüfen und Aktualisieren des Ticketstatus für alle Tickets
  function checkAndUpdateAllTickets(client) {
    
    client.request('/api/v2/tickets.json').then(function(response) {
      const tickets = response.tickets;

      // Durchlaufe alle Tickets und überprüfe das Ablaufdatum
      tickets.forEach(function(ticket) {
  
        ticket.custom_fields.forEach(function(customField) {
          if (customField) {
            const customFieldDate = customField.value;
            //console.log(ticket.id , customFieldDate);

            const testDate = new Date(customFieldDate);
            formatDate(testDate);

            //console.log(ticket);
            //console.log(ticket.status);
            if(!(ticket.status == "closed")){

            //console.log(testDate);
              if (isDateExpired(testDate)) {
                // Das Datum ist abgelaufen, ändere den Ticketstatus hier
                changeTicketStatus(client, ticket.id, 'new');
                addTicketToContainerIfNotExists(ticket, testDate);
              }
            }
          } 
          else {
            console.log('Custom field not found for this ticket');
          }
      });
      });
    });
  }



  // Funktion zum Ändern des Ticketstatus
  function changeTicketStatus(client, ticketId, newStatus) {
    var statusField = 'status';
  
    var ticketData = {};
    ticketData[statusField] = newStatus;
  
    client.request({
      url: '/api/v2/tickets/' + ticketId + '.json',
      type: 'PUT',
      dataType: 'json',
      data: {
        ticket: ticketData
      }
    }).then(
      function(response) {
        //console.log('Ticketstatus wurde erfolgreich geändert:', newStatus);
      },
      function(response) {
        //console.error('Fehler beim Ändern des Ticketstatus:', response.responseText);
      }
    );
  }
  