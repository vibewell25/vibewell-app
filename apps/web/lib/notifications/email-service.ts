import { BookingStatus } from "@vibewell/types";

interface EmailRecipient {
  email: string;
  name: string;
}

interface BookingDetails {
  id: string;
  status: BookingStatus;
  serviceName: string;
  startTime: Date;
  endTime: Date;
  price: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  provider: {
    firstName: string;
    lastName: string;
    displayName?: string;
    email: string;
  };
  notes?: string;
  cancellationReason?: string;
}

/**
 * Email service for sending notifications.
 * In a real application, this would integrate with a proper email service
 * like SendGrid, Mailgun, AWS SES, etc.
 */
export class EmailService {
  /**
   * Send a booking confirmation email to the customer
   */
  static async sendBookingConfirmationEmail(booking: BookingDetails): Promise<boolean> {
    try {
      const recipient: EmailRecipient = {
        email: booking.customer.email,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
      };

      const subject = `Booking Confirmation - ${booking.serviceName}`;
      const providerName = booking.provider.displayName || 
        `${booking.provider.firstName} ${booking.provider.lastName}`;

      const template = `
        <h1>Booking Confirmation</h1>
        <p>Dear ${booking.customer.firstName},</p>
        <p>Your booking with ${providerName} has been confirmed.</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date:</strong> ${booking.startTime.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.startTime.toLocaleTimeString()} - ${booking.endTime.toLocaleTimeString()}</p>
        <p><strong>Price:</strong> $${booking.price.toFixed(2)}</p>
        <p>Thank you for using VibeWell. We hope you enjoy your service!</p>
        <p>You can view your booking details at any time by visiting your <a href="https://vibewell.com/bookings/${booking.id}">booking page</a>.</p>
      `;

      // For now, just log the email details as this is a demo
      console.log('SENDING EMAIL:', {
        to: recipient,
        subject,
        body: template
      });

      // In a real application, we would use a proper email service
      // For example with SendGrid:
      // await sendgrid.send({
      //   to: recipient.email,
      //   from: 'bookings@vibewell.com',
      //   subject,
      //   html: template,
      // });

      return true;
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return false;
    }
  }

  /**
   * Send a booking reminder email to the customer
   */
  static async sendBookingReminderEmail(booking: BookingDetails): Promise<boolean> {
    try {
      const recipient: EmailRecipient = {
        email: booking.customer.email,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
      };

      const subject = `Reminder: Your Upcoming Appointment - ${booking.serviceName}`;
      const providerName = booking.provider.displayName || 
        `${booking.provider.firstName} ${booking.provider.lastName}`;

      const template = `
        <h1>Appointment Reminder</h1>
        <p>Dear ${booking.customer.firstName},</p>
        <p>This is a reminder for your upcoming appointment with ${providerName}.</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date:</strong> ${booking.startTime.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.startTime.toLocaleTimeString()} - ${booking.endTime.toLocaleTimeString()}</p>
        <p>If you need to cancel or reschedule, please do so at least 24 hours in advance to avoid any cancellation fees.</p>
        <p>You can manage your booking at any time by visiting your <a href="https://vibewell.com/bookings/${booking.id}">booking page</a>.</p>
        <p>We look forward to seeing you soon!</p>
      `;

      // For now, just log the email details as this is a demo
      console.log('SENDING EMAIL:', {
        to: recipient,
        subject,
        body: template
      });

      return true;
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      return false;
    }
  }

  /**
   * Send a booking cancellation email to the customer
   */
  static async sendBookingCancellationEmail(booking: BookingDetails): Promise<boolean> {
    try {
      const recipient: EmailRecipient = {
        email: booking.customer.email,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
      };

      const subject = `Booking Cancelled - ${booking.serviceName}`;
      const providerName = booking.provider.displayName || 
        `${booking.provider.firstName} ${booking.provider.lastName}`;

      const template = `
        <h1>Booking Cancellation</h1>
        <p>Dear ${booking.customer.firstName},</p>
        <p>Your booking with ${providerName} has been cancelled.</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date:</strong> ${booking.startTime.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.startTime.toLocaleTimeString()} - ${booking.endTime.toLocaleTimeString()}</p>
        ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
        <p>If you have any questions or would like to make a new booking, please visit our website or contact our support team.</p>
      `;

      // For now, just log the email details as this is a demo
      console.log('SENDING EMAIL:', {
        to: recipient,
        subject,
        body: template
      });

      return true;
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      return false;
    }
  }

  /**
   * Send a new booking notification to the provider
   */
  static async sendNewBookingNotificationToProvider(booking: BookingDetails): Promise<boolean> {
    try {
      const recipient: EmailRecipient = {
        email: booking.provider.email,
        name: booking.provider.displayName || `${booking.provider.firstName} ${booking.provider.lastName}`,
      };

      const subject = `New Booking Request - ${booking.serviceName}`;
      const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;

      const template = `
        <h1>New Booking Request</h1>
        <p>Dear ${booking.provider.firstName},</p>
        <p>You have received a new booking request from ${customerName}.</p>
        <p><strong>Service:</strong> ${booking.serviceName}</p>
        <p><strong>Date:</strong> ${booking.startTime.toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.startTime.toLocaleTimeString()} - ${booking.endTime.toLocaleTimeString()}</p>
        <p><strong>Price:</strong> $${booking.price.toFixed(2)}</p>
        ${booking.notes ? `<p><strong>Special Requests:</strong> ${booking.notes}</p>` : ''}
        <p>Please log in to your provider dashboard to approve or decline this booking.</p>
        <p>You can manage this booking at <a href="https://vibewell.com/provider/bookings/${booking.id}">your provider dashboard</a>.</p>
      `;

      // For now, just log the email details as this is a demo
      console.log('SENDING EMAIL:', {
        to: recipient,
        subject,
        body: template
      });

      return true;
    } catch (error) {
      console.error('Failed to send provider notification email:', error);
      return false;
    }
  }
} 