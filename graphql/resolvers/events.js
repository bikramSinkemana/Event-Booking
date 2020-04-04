const Event = require('../../models/event');
const User = require('../../models/user');

const { dateToString } = require('../../helpers/date');

const {transformEvent} = require('./merge');

module.exports = {
  events: async (args, req) => {
    try {
      const events = Event.find();

      return events.map((event) => {
        return transformEvent(event)
      })
    } catch (error) {
      throw error
    }
  },
  createEvent: async ({eventInput}, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    };

    try {
      const event = new Event({
        title: eventInput.title,
        description: eventInput.description,
        price: +eventInput.price,
        date: dateToString(eventInput.date),
        creator: req.userId
      });
    
      const result= event.save()
      const createdEvent = transformEvent(result);
    
      const user = User.findById('5e8707fcfccc0f1b81d81b82');
      if (!user) {
        throw new Error("User not found")
      }
    
      user.createdEvents.push(event);
      user.save();
        
      return createdEvent;
    
    } catch (error) {
      throw error;
    }
  }
}