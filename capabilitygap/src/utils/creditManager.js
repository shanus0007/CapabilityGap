import { supabase } from '../supabase';

/**
 * Log a credit transaction to the DB.
 * @param {string} userId
 * @param {'credit'|'debit'} type
 * @param {number} amount      – always positive
 * @param {string} description
 * @param {number} balanceAfter
 */
export async function logTransaction(userId, type, amount, description, balanceAfter) {
    const { error } = await supabase.from('credit_transactions').insert({
        user_id: userId,
        type,
        amount,
        description,
        balance_after: balanceAfter,
    });
    if (error) console.error('[creditManager] logTransaction error:', error);
}

/**
 * Deduct credits from the authenticated user.
 * Returns { ok: boolean, newBalance: number, error?: string }
 */
export async function deductCredits(session, amount, description) {
    const userId = session?.user?.id;
    const currentCredits = session?.user?.user_metadata?.credits ?? 1000;

    if (currentCredits < amount) {
        return {
            ok: false,
            newBalance: currentCredits,
            error: `Insufficient credits (${amount} required, you have ${currentCredits}).`
        };
    }

    const newBalance = currentCredits - amount;
    const { error } = await supabase.auth.updateUser({ data: { credits: newBalance } });
    if (error) return { ok: false, newBalance: currentCredits, error: error.message };

    await logTransaction(userId, 'debit', amount, description, newBalance);
    return { ok: true, newBalance };
}

/**
 * Add credits to the authenticated user.
 * Returns { ok: boolean, newBalance: number, error?: string }
 */
export async function addCredits(session, amount, description) {
    const userId = session?.user?.id;
    const currentCredits = session?.user?.user_metadata?.credits ?? 1000;

    const newBalance = currentCredits + amount;
    const { error } = await supabase.auth.updateUser({ data: { credits: newBalance } });
    if (error) return { ok: false, newBalance: currentCredits, error: error.message };

    await logTransaction(userId, 'credit', amount, description, newBalance);
    return { ok: true, newBalance };
}
