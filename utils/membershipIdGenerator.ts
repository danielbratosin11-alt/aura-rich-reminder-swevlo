
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMBER_ID_KEY = '@aura_member_id';
const MEMBER_COUNTER_KEY = '@aura_member_counter';
const MAX_MEMBERS = 5000;

/**
 * Generates a unique membership ID in the format: AURA-LX-NNNN
 * LX = Luxury/Exclusivity code (static)
 * NNNN = Sequential 4-digit number (0001-5000)
 * 
 * This ID is generated once per user and never changes, regardless of language selection.
 */
export async function generateMembershipId(): Promise<string> {
  try {
    // Check if user already has a membership ID
    const existingId = await AsyncStorage.getItem(MEMBER_ID_KEY);
    if (existingId) {
      console.log('Existing membership ID found:', existingId);
      return existingId;
    }

    // Get and increment counter
    const counterStr = await AsyncStorage.getItem(MEMBER_COUNTER_KEY);
    const counter = counterStr ? parseInt(counterStr, 10) : 0;
    const newCounter = Math.min(counter + 1, MAX_MEMBERS);

    // Format counter as 4-digit number
    const formattedCounter = newCounter.toString().padStart(4, '0');

    // Generate membership ID with static luxury code "LX"
    const memberId = `AURA-LX-${formattedCounter}`;

    // Save membership ID and counter
    await AsyncStorage.setItem(MEMBER_ID_KEY, memberId);
    await AsyncStorage.setItem(MEMBER_COUNTER_KEY, newCounter.toString());

    console.log('Generated new membership ID:', memberId);
    return memberId;
  } catch (error) {
    console.error('Error generating membership ID:', error);
    return 'AURA-LX-0000';
  }
}

/**
 * Retrieves the existing membership ID
 */
export async function getMembershipId(): Promise<string | null> {
  try {
    const memberId = await AsyncStorage.getItem(MEMBER_ID_KEY);
    return memberId;
  } catch (error) {
    console.error('Error retrieving membership ID:', error);
    return null;
  }
}
