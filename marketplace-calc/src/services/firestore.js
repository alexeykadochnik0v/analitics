import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection references
const calculationsRef = collection(db, 'calculations');

/**
 * Save a calculation to Firestore
 * @param {Object} calculationData - Calculation data to save
 * @param {string} userId - User ID
 * @param {string} productName - Optional product name
 * @returns {Promise<string>} - Document ID of the saved calculation
 */
export const saveCalculation = async (calculationData, userId, productName = '') => {
  try {
    const docRef = await addDoc(calculationsRef, {
      userId,
      productName,
      ...calculationData,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw error;
  }
};

/**
 * Get all calculations for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of calculation objects
 */
export const getUserCalculations = async (userId) => {
  try {
    const q = query(
      calculationsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const calculations = [];
    
    querySnapshot.forEach((doc) => {
      calculations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return calculations;
  } catch (error) {
    console.error('Error getting user calculations:', error);
    throw error;
  }
};

/**
 * Get a specific calculation by ID
 * @param {string} calculationId - Calculation document ID
 * @returns {Promise<Object|null>} - Calculation object or null if not found
 */
export const getCalculationById = async (calculationId) => {
  try {
    const docRef = doc(db, 'calculations', calculationId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting calculation:', error);
    throw error;
  }
};

/**
 * Delete a calculation by ID
 * @param {string} calculationId - Calculation document ID
 * @returns {Promise<void>}
 */
export const deleteCalculation = async (calculationId) => {
  try {
    const docRef = doc(db, 'calculations', calculationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
};

export default {
  saveCalculation,
  getUserCalculations,
  getCalculationById,
  deleteCalculation
};
