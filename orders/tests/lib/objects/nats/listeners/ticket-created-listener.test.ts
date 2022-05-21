describe('Tests for the TicketCreatedListener object.', () => {
  describe('Success cases', () => {
    const setup = async () => {
      // 1. create an instance of the listener
      // 2. create a fake TicketCreatedEventData object
      // 3. create a fake message object
      // 4. call the onMessage function with the data and message objects
    };

    beforeEach(setup);

    it('Should create a ticket and save it.', async () => {
      // 5. write assertion to make sure the ticket was created
      // 6. write assertion to make sure msg.ack has been called
    });
    it('Should acknowledge the message upon processing the event.', async () => {});
  });
});
