const cron = require('node-cron');
const LedgerEntry = require('@/models/appModels/LedgerEntry');
const mongoose = require('mongoose');

// Import reminder functions
const { sendWhatsAppReminder, sendSMSReminder } = require('@/controllers/coreControllers/remindersController');

// Daily reminder job - runs at 9 AM every day
const dailyReminderJob = cron.schedule('0 9 * * *', async () => {
  console.log('Running daily reminder job...');
  
  try {
    // Get overdue accounts (90+ days)
    const pipeline = [
      {
        $match: {
          partyType: { $in: ['Customer', 'Supplier'] },
          balance: { $ne: 0 },
        },
      },
      {
        $group: {
          _id: {
            partyType: '$partyType',
            partyId: '$partyId',
          },
          currentBalance: { $last: '$balance' },
          lastTransactionDate: { $max: '$date' },
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id.partyId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id.partyId',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      {
        $project: {
          partyType: '$_id.partyType',
          partyId: '$_id.partyId',
          partyName: {
            $cond: {
              if: { $eq: ['$_id.partyType', 'Customer'] },
              then: { $arrayElemAt: ['$customer.name', 0] },
              else: { $arrayElemAt: ['$supplier.name', 0] },
            },
          },
          phone: {
            $cond: {
              if: { $eq: ['$_id.partyType', 'Customer'] },
              then: { $arrayElemAt: ['$customer.phone', 0] },
              else: { $arrayElemAt: ['$supplier.phone', 0] },
            },
          },
          currentBalance: 1,
          lastTransactionDate: 1,
          daysSinceLastTransaction: {
            $divide: [
              { $subtract: [new Date(), '$lastTransactionDate'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $match: {
          daysSinceLastTransaction: { $gte: 90 },
          phone: { $exists: true, $ne: null, $ne: '' },
        },
      },
    ];

    const overdueAccounts = await LedgerEntry.aggregate(pipeline);
    
    console.log(`Found ${overdueAccounts.length} overdue accounts`);
    
    // Send reminders (you can configure this based on settings)
    const reminderSettings = {
      sendWhatsApp: true,
      sendSMS: false,
    };
    
    for (const account of overdueAccounts) {
      try {
        if (reminderSettings.sendWhatsApp) {
          await sendWhatsAppReminder(account);
          console.log(`WhatsApp reminder sent to ${account.partyName}`);
        }
        
        if (reminderSettings.sendSMS) {
          await sendSMSReminder(account);
          console.log(`SMS reminder sent to ${account.partyName}`);
        }
      } catch (error) {
        console.error(`Failed to send reminder to ${account.partyName}:`, error);
      }
    }
    
    console.log('Daily reminder job completed successfully');
  } catch (error) {
    console.error('Daily reminder job failed:', error);
  }
}, {
  scheduled: false, // Don't start automatically
  timezone: 'Asia/Karachi',
});

// Weekly reminder job - runs every Monday at 10 AM
const weeklyReminderJob = cron.schedule('0 10 * * 1', async () => {
  console.log('Running weekly reminder job...');
  
  try {
    // Get accounts that are 30-60 days overdue
    const pipeline = [
      {
        $match: {
          partyType: { $in: ['Customer', 'Supplier'] },
          balance: { $ne: 0 },
        },
      },
      {
        $group: {
          _id: {
            partyType: '$partyType',
            partyId: '$partyId',
          },
          currentBalance: { $last: '$balance' },
          lastTransactionDate: { $max: '$date' },
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: '_id.partyId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id.partyId',
          foreignField: '_id',
          as: 'supplier',
        },
      },
      {
        $project: {
          partyType: '$_id.partyType',
          partyId: '$_id.partyId',
          partyName: {
            $cond: {
              if: { $eq: ['$_id.partyType', 'Customer'] },
              then: { $arrayElemAt: ['$customer.name', 0] },
              else: { $arrayElemAt: ['$supplier.name', 0] },
            },
          },
          phone: {
            $cond: {
              if: { $eq: ['$_id.partyType', 'Customer'] },
              then: { $arrayElemAt: ['$customer.phone', 0] },
              else: { $arrayElemAt: ['$supplier.phone', 0] },
            },
          },
          currentBalance: 1,
          lastTransactionDate: 1,
          daysSinceLastTransaction: {
            $divide: [
              { $subtract: [new Date(), '$lastTransactionDate'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $match: {
          daysSinceLastTransaction: { $gte: 30, $lt: 60 },
          phone: { $exists: true, $ne: null, $ne: '' },
        },
      },
    ];

    const warningAccounts = await LedgerEntry.aggregate(pipeline);
    
    console.log(`Found ${warningAccounts.length} accounts needing warning reminders`);
    
    // Send warning reminders
    for (const account of warningAccounts) {
      try {
        await sendWhatsAppReminder(account);
        console.log(`Warning reminder sent to ${account.partyName}`);
      } catch (error) {
        console.error(`Failed to send warning reminder to ${account.partyName}:`, error);
      }
    }
    
    console.log('Weekly reminder job completed successfully');
  } catch (error) {
    console.error('Weekly reminder job failed:', error);
  }
}, {
  scheduled: false,
  timezone: 'Asia/Karachi',
});

// Function to start all reminder jobs
const startReminderJobs = () => {
  dailyReminderJob.start();
  weeklyReminderJob.start();
  console.log('Reminder jobs started');
};

// Function to stop all reminder jobs
const stopReminderJobs = () => {
  dailyReminderJob.stop();
  weeklyReminderJob.stop();
  console.log('Reminder jobs stopped');
};

module.exports = {
  dailyReminderJob,
  weeklyReminderJob,
  startReminderJobs,
  stopReminderJobs,
};
