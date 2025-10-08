require('dotenv').config();
const mongoose = require('mongoose');

async function fixTeacherIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Drop the problematic index
    try {
      await mongoose.connection.collection('teachers').dropIndex('id_1');
      console.log('✅ Dropped id_1 index successfully');
    } catch (indexError) {
      console.log('Index may not exist or already dropped:', indexError.message);
    }

    // List all indexes to verify
    const indexes = await mongoose.connection.collection('teachers').indexes();
    console.log('Current indexes on teachers collection:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}.`, index);
    });

    console.log('\n✅ Teacher collection index issue should be resolved!');
    console.log('You can now try creating teachers again.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

fixTeacherIndex();