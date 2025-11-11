
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countryCodes } from './translations';

const MEMBER_ID_KEY = '@aura_member_id';
const MEMBER_COUNTER_KEY = '@aura_member_counter';

/**
 * Generates a unique membership ID in the format: AURA-XX-NNNN
 * XX = Country code based on language
 * NNNN = Sequential 4-digit number
 */
export async function generateMembershipId(languageCode: string): Promise<string> {
  try {
    // Check if user already has a membership ID
    const existingId = await AsyncStorage.getItem(MEMBER_ID_KEY);
    if (existingId) {
      console.log('Existing membership ID found:', existingId);
      return existingId;
    }

    // Get country code from language
    const countryCode = countryCodes[languageCode] || 'XX';

    // Get and increment counter
    const counterStr = await AsyncStorage.getItem(MEMBER_COUNTER_KEY);
    const counter = counterStr ? parseInt(counterStr, 10) : 0;
    const newCounter = counter + 1;

    // Format counter as 4-digit number
    const formattedCounter = newCounter.toString().padStart(4, '0');

    // Generate membership ID
    const memberId = `AURA-${countryCode}-${formattedCounter}`;

    // Save membership ID and counter
    await AsyncStorage.setItem(MEMBER_ID_KEY, memberId);
    await AsyncStorage.setItem(MEMBER_COUNTER_KEY, newCounter.toString());

    console.log('Generated new membership ID:', memberId);
    return memberId;
  } catch (error) {
    console.error('Error generating membership ID:', error);
    return 'AURA-XX-0000';
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

/**
 * Updates membership ID when language changes (optional - only if you want to update country code)
 */
export async function updateMembershipIdCountry(languageCode: string): Promise<string> {
  try {
    const existingId = await AsyncStorage.getItem(MEMBER_ID_KEY);
    if (!existingId) {
      return await generateMembershipId(languageCode);
    }

    // Extract the counter from existing ID
    const parts = existingId.split('-');
    if (parts.length === 3) {
      const counter = parts[2];
      const countryCode = countryCodes[languageCode] || 'XX';
      const newId = `AURA-${countryCode}-${counter}`;
      
      await AsyncStorage.setItem(MEMBER_ID_KEY, newId);
      console.log('Updated membership ID country:', newId);
      return newId;
    }

    return existingId;
  } catch (error) {
    console.error('Error updating membership ID:', error);
    return existingId || 'AURA-XX-0000';
  }
}
