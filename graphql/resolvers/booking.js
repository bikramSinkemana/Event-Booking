const Event = require('../../models/event');
const Booking = require('../../models/booking');

const {transformBooking} = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    };

    try {
      const bookings = await Booking.find();
      console.log('bookings', bookings)

      return bookings.map((booking) => {
        return transformBooking(booking)
      })
    } catch (error) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    };

    const fetchedEvent = await Event.findOne({
      _id: args.eventId
    })

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    })

    const result = await booking.save();
    return transformBooking(result)
  },
  cancelBooking: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    };

    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event)

      await Booking.deleteOne({
        _id: args.bookingId
      })

      return event;
    } catch (error) {
      throw error
    }
  }
}