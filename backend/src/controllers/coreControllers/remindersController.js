const mongoose = require('mongoose');
const { catchErrors } = require('@/handlers/errorHandlers');
const LedgerEntry = require('@/models/appModels/LedgerEntry');
const Client = require('@/models/appModels/Client');
const Supplier = require('@/models/appModels/Supplier');

// Get credit aging summary
const getCreditAgingSummary = catchErrors(async (req, res) => {
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
        email: {
          $cond: {
            if: { $eq: ['$_id.partyType', 'Customer'] },
            then: { $arrayElemAt: ['$customer.email', 0] },
            else: { $arrayElemAt: ['$supplier.email', 0] },
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
      $addFields: {
        agingBucket: {
          $switch: {
            branches: [
              { case: { $lte: ['$daysSinceLastTransaction', 30] }, then: '0-30' },
              { case: { $lte: ['$daysSinceLastTransaction', 60] }, then: '31-60' },
              { case: { $lte: ['$daysSinceLastTransaction', 90] }, then: '61-90' },
            ],
            default: '90+',
          },
        },
      },
    },
    { $sort: { currentBalance: -1 } },
  ];

  const results = await LedgerEntry.aggregate(pipeline);
  
  // Group by aging buckets
  const agingSummary = results.reduce((acc, item) => {
    const bucket = item.agingBucket;
    if (!acc[bucket]) {
      acc[bucket] = { count: 0, totalAmount: 0, items: [] };
    }
    acc[bucket].count += 1;
    acc[bucket].totalAmount += parseFloat(item.currentBalance);
    acc[bucket].items.push(item);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    result: {
      summary: agingSummary,
      details: results,
    },
    message: 'Credit aging summary retrieved successfully',
  });
});

// Send reminder for overdue accounts
const sendOverdueReminders = catchErrors(async (req, res) => {
  const { agingBucket = '90+', sendWhatsApp = false, sendSMS = false } = req.body;
  
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
        email: {
          $cond: {
            if: { $eq: ['$_id.partyType', 'Customer'] },
            then: { $arrayElemAt: ['$customer.email', 0] },
            else: { $arrayElemAt: ['$supplier.email', 0] },
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
      $addFields: {
        agingBucket: {
          $switch: {
            branches: [
              { case: { $lte: ['$daysSinceLastTransaction', 30] }, then: '0-30' },
              { case: { $lte: ['$daysSinceLastTransaction', 60] }, then: '31-60' },
              { case: { $lte: ['$daysSinceLastTransaction', 90] }, then: '61-90' },
            ],
            default: '90+',
          },
        },
      },
    },
    {
      $match: {
        agingBucket: agingBucket,
        phone: { $exists: true, $ne: null, $ne: '' },
      },
    },
  ];

  const overdueAccounts = await LedgerEntry.aggregate(pipeline);
  
  const results = [];
  
  for (const account of overdueAccounts) {
    const reminderResult = {
      partyId: account.partyId,
      partyName: account.partyName,
      phone: account.phone,
      balance: account.currentBalance,
      daysOverdue: Math.floor(account.daysSinceLastTransaction),
      whatsAppSent: false,
      smsSent: false,
      emailSent: false,
    };

    // Send WhatsApp reminder
    if (sendWhatsApp && account.phone) {
      try {
        await sendWhatsAppReminder(account);
        reminderResult.whatsAppSent = true;
      } catch (error) {
        console.error('WhatsApp reminder failed:', error);
      }
    }

    // Send SMS reminder
    if (sendSMS && account.phone) {
      try {
        await sendSMSReminder(account);
        reminderResult.smsSent = true;
      } catch (error) {
        console.error('SMS reminder failed:', error);
      }
    }

    results.push(reminderResult);
  }

  res.status(200).json({
    success: true,
    result: {
      totalSent: results.length,
      agingBucket,
      reminders: results,
    },
    message: `Reminders sent for ${results.length} overdue accounts`,
  });
});

// Helper function to send WhatsApp reminder
const sendWhatsAppReminder = async (account) => {
  // This is a stub function - integrate with your WhatsApp API
  const message = `Dear ${account.partyName},\n\nThis is a friendly reminder that you have an outstanding balance of Rs. ${account.currentBalance} with Bin Sultan Cloth Shop.\n\nPlease settle your account at your earliest convenience.\n\nThank you for your business!\n\nBin Sultan Cloth Shop`;
  
  console.log(`WhatsApp reminder sent to ${account.phone}:`, message);
  
  // TODO: Integrate with WhatsApp Business API
  // Example: await whatsappAPI.sendMessage(account.phone, message);
  
  return true;
};

// Helper function to send SMS reminder
const sendSMSReminder = async (account) => {
  // This is a stub function - integrate with your SMS API
  const message = `Dear ${account.partyName}, you have an outstanding balance of Rs. ${account.currentBalance} with Bin Sultan Cloth Shop. Please settle at your earliest convenience.`;
  
  console.log(`SMS reminder sent to ${account.phone}:`, message);
  
  // TODO: Integrate with SMS API
  // Example: await smsAPI.sendSMS(account.phone, message);
  
  return true;
};

// Get reminder settings
const getReminderSettings = catchErrors(async (req, res) => {
  // This would typically come from settings collection
  const settings = {
    enableWhatsApp: true,
    enableSMS: false,
    enableEmail: false,
    reminderSchedule: 'daily',
    agingThresholds: {
      warning: 30,
      critical: 60,
      urgent: 90,
    },
    messageTemplates: {
      whatsApp: 'Dear {name}, you have an outstanding balance of Rs. {amount} with Bin Sultan Cloth Shop. Please settle at your earliest convenience.',
      sms: 'Dear {name}, outstanding balance: Rs. {amount}. Please settle soon. Bin Sultan Cloth Shop.',
      email: 'Dear {name}, this is a reminder about your outstanding balance of Rs. {amount}. Please contact us to arrange payment.',
    },
  };

  res.status(200).json({
    success: true,
    result: settings,
    message: 'Reminder settings retrieved successfully',
  });
});

module.exports = {
  getCreditAgingSummary,
  sendOverdueReminders,
  getReminderSettings,
  sendWhatsAppReminder,
  sendSMSReminder,
};
