'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

interface DeleteChallengeResult {
  success: boolean;
  error: string | null;
}

/**
 * Supprime un challenge (admin only)
 * Vérifie que l'utilisateur est admin avant de supprimer
 */
export async function deleteChallengeAdmin(
  challengeId: string
): Promise<DeleteChallengeResult> {
  try {
    const supabase = createAdminClient();
    const supabaseAuth = await createClient();

    const { data: authData, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !authData?.user) {
      return { success: false, error: 'Non authentifié' };
    }

    // Vérifier que l'utilisateur est admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    if (user.role !== 'Administrateur') {
      return { success: false, error: 'Accès refusé : droits administrateur requis' };
    }

    // Supprimer le challenge
    const { error: deleteError } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);

    if (deleteError) {
      console.error('Error deleting challenge:', deleteError);
      return { success: false, error: deleteError.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteChallengeAdmin:', error);
    return { success: false, error: 'Erreur inattendue' };
  }
}
