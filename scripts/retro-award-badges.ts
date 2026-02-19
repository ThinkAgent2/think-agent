import { createClient } from '@supabase/supabase-js';
import { checkAndUpdateLevelAndBadges } from '../src/lib/supabase/queries';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id');

  if (error || !users) {
    console.error('Error fetching users', error);
    process.exit(1);
  }

  let processed = 0;
  for (const user of users) {
    await checkAndUpdateLevelAndBadges(user.id);
    processed++;
    if (processed % 50 === 0) {
      console.log(`Processed ${processed}/${users.length}`);
    }
  }

  console.log(`Done. Processed ${processed} users.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
