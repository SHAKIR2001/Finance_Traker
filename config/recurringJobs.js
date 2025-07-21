const cron = require('node-cron');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

// Function to generate recurring transactions
const generateRecurringTransactions = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight to avoid time issues

    const recurringTransactions = await Transaction.find({
      recurring: { $in: ['daily', 'weekly', 'monthly'] },
      endDate: { $gte: today } // Only process active recurring transactions
    });

    for (const transaction of recurringTransactions) {
      let lastTransactionDate = new Date(transaction.date);
      lastTransactionDate.setHours(0, 0, 0, 0); // Normalize date for accurate comparison

      let nextDate = new Date(lastTransactionDate);

      // Calculate the next scheduled date based on frequency
      if (transaction.recurring === 'daily') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (transaction.recurring === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (transaction.recurring === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }

      nextDate.setHours(0, 0, 0, 0); // Normalize again to avoid time component mismatches

      // 🔧 Ensure we don't run transactions if it's not yet the nextDate
      if (nextDate > today) {
        console.log(`🛑 Next transaction for category ${transaction.category} is scheduled for ${nextDate.toISOString()} - Not creating yet.`);
        continue;
      }

      // 🔧 Check if a transaction for this nextDate already exists to avoid duplicates
      const existingTransaction = await Transaction.findOne({
        user: transaction.user,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        date: nextDate // exact date match
      });

      if (!existingTransaction) {
        await Transaction.create({
          user: transaction.user,
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          tags: transaction.tags,
          date: nextDate,
          description: transaction.description,
          recurring: transaction.recurring,
          endDate: transaction.endDate,
        });

        console.log(`✅ Recurring transaction created for ${nextDate.toISOString()}`);
      } else {
        console.log(`⚠️ Transaction already exists for ${nextDate.toISOString()}, skipping duplicate.`);
      }
    }
  } catch (error) {
    console.error('❌ Error generating recurring transactions:', error);
  }
};

// Function to handle automatic savings based on frequency
const processAutoSavings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time

    const goals = await Goal.find({ autoSave: true, status: 'active' });

    for (const goal of goals) {
      if (goal.contributionAmount > 0) {
        const lastSaveDate = goal.lastAutoSave ? new Date(goal.lastAutoSave) : null;
        let nextSaveDate = lastSaveDate ? new Date(lastSaveDate) : new Date(today);

        // Calculate the next save date based on frequency
        if (goal.saveFrequency === 'daily') nextSaveDate.setDate(nextSaveDate.getDate() + 1);
        else if (goal.saveFrequency === 'weekly') nextSaveDate.setDate(nextSaveDate.getDate() + 7);
        else if (goal.saveFrequency === 'monthly') nextSaveDate.setMonth(nextSaveDate.getMonth() + 1);

        nextSaveDate.setHours(0, 0, 0, 0); // Normalize for comparison

        if (lastSaveDate && today < nextSaveDate) {
          console.log(`🛑 Next auto-save for ${goal.name} is scheduled for ${nextSaveDate.toISOString()} - Skipping.`);    
          continue;
        }  

        await Transaction.create({
          user: goal.user,
          type: 'expense',
          amount: goal.contributionAmount,
          category: 'Savings',
          description: `Auto-save for goal: ${goal.name}`,
          date: today,
        });

        goal.currentAmount += goal.contributionAmount;
        goal.lastAutoSave = today;
        await goal.save();

        console.log(`✅ Auto-saved $${goal.contributionAmount} for goal: ${goal.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error processing auto-savings:', error);
  }
};

// Schedule jobs to run once per day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Running scheduled jobs for recurring transactions and auto-savings...');
  await generateRecurringTransactions();
  await processAutoSavings();
});

module.exports = { generateRecurringTransactions, processAutoSavings };
