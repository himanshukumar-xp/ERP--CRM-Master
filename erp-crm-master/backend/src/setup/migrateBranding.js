/**
 * One-time branding migration.
 *
 * 1. Copies all collections from the legacy database (default name:
 *    `idurar-erp-crm`) into the new database (taken from `DATABASE` in
 *    backend/.env), unless the target collection already contains data.
 *    The legacy database is left untouched as a backup.
 * 2. Renames internal setting keys from `idurar_*` to `app_*`.
 * 3. Renames the seeded admin display name `IDURAR` to `Admin`.
 *
 * Usage:
 *   cd backend
 *   node src/setup/migrateBranding.js      (or: npm run migrate:branding)
 *
 * Optional environment variables:
 *   OLD_DATABASE_NAME - name of the legacy database (default: idurar-erp-crm)
 */
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

const targetUri = process.env.DATABASE;
if (!targetUri) {
  console.error('✖ DATABASE is not set in backend/.env');
  process.exit(1);
}

const OLD_DB_NAME = process.env.OLD_DATABASE_NAME || 'idurar-erp-crm';
const NEW_DB_NAME = targetUri.split('?')[0].split('/').pop();

if (!NEW_DB_NAME || NEW_DB_NAME.includes(':')) {
  console.error('✖ DATABASE in backend/.env does not include a database name.');
  process.exit(1);
}

const legacyUri = targetUri.replace(/\/[^/?]+(\?|$)/, `/${OLD_DB_NAME}$1`);

async function copyCollections(legacyDb, targetDb) {
  const collections = await legacyDb.listCollections().toArray();
  let copied = 0;
  for (const { name } of collections) {
    const targetCount = await targetDb.collection(name).estimatedDocumentCount();
    if (targetCount > 0) {
      console.log(`  • ${name}: target already has ${targetCount} doc(s), skipped`);
      continue;
    }
    const docs = await legacyDb.collection(name).find({}).toArray();
    if (docs.length > 0) {
      await targetDb.collection(name).insertMany(docs);
      copied += docs.length;
      console.log(`  • ${name}: copied ${docs.length} doc(s)`);
    }
  }
  return copied;
}

async function renameSettingKeys(targetDb) {
  const settings = await targetDb
    .collection('settings')
    .find({ settingKey: /^idurar_/ })
    .toArray();
  for (const doc of settings) {
    const newKey = doc.settingKey.replace(/^idurar_/, '');
    await targetDb.collection('settings').updateOne({ _id: doc._id }, { $set: { settingKey: newKey } });
  }
  return settings.length;
}

async function renameSeededAdmin(targetDb) {
  const result = await targetDb
    .collection('admins')
    .updateMany({ name: 'IDURAR' }, { $set: { name: 'Admin' } });
  return result.modifiedCount;
}

async function main() {
  const client = new MongoClient(targetUri);
  await client.connect();

  const targetDb = client.db(NEW_DB_NAME);
  console.log(`➡ Target database: ${NEW_DB_NAME}`);

  // 1. Copy legacy data (if the legacy database exists and has collections)
  const legacyDb = client.db(OLD_DB_NAME);
  const legacyCollections = await legacyDb.listCollections().toArray();
  if (legacyCollections.length === 0) {
    console.log(`ℹ Legacy database "${OLD_DB_NAME}" is empty or does not exist — nothing to copy.`);
  } else {
    console.log(`➡ Copying from legacy database: ${OLD_DB_NAME}`);
    const copied = await copyCollections(legacyDb, targetDb);
    console.log(
      `👍 Copy done (${copied} document(s) copied). The legacy database was left untouched as a backup.`
    );
  }

  // 2. Rename idurar_* setting keys to app_*
  const renamedKeys = await renameSettingKeys(targetDb);
  console.log(`👍 Renamed ${renamedKeys} setting key(s) (idurar_* → app_*).`);

  // 3. Rename the seeded admin display name
  const renamedAdmins = await renameSeededAdmin(targetDb);
  console.log(`👍 Renamed ${renamedAdmins} seeded admin record(s) (IDURAR → Admin).`);

  await client.close();
  console.log('🥳 Migration completed. Restart the backend to reload settings.');
  process.exit(0);
}

main().catch((error) => {
  console.error('🚫 Migration failed:');
  console.error(error);
  process.exit(1);
});
