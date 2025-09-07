const mongoose = require('mongoose');

/**
 * Convert numeric values to Decimal128 for mongoose models
 * @param {Object} data - The data object to convert
 * @param {Array} decimalFields - Array of field names that should be converted to Decimal128
 * @returns {Object} - The converted data object
 */
const convertToDecimal128 = (data, decimalFields = []) => {
  const converted = { ...data };
  
  decimalFields.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null) {
      // Handle nested objects (like pricing)
      if (typeof converted[field] === 'object' && !Array.isArray(converted[field])) {
        converted[field] = convertNestedToDecimal128(converted[field], getNestedDecimalFields(field));
      } else {
        // Convert to string first, then to Decimal128
        converted[field] = mongoose.Types.Decimal128.fromString(converted[field].toString());
      }
    }
  });
  
  return converted;
};

/**
 * Convert nested object fields to Decimal128
 * @param {Object} obj - The nested object
 * @param {Array} decimalFields - Array of field names that should be converted
 * @returns {Object} - The converted object
 */
const convertNestedToDecimal128 = (obj, decimalFields = []) => {
  const converted = { ...obj };
  
  decimalFields.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null) {
      converted[field] = mongoose.Types.Decimal128.fromString(converted[field].toString());
    }
  });
  
  return converted;
};

/**
 * Get nested decimal fields for specific parent fields
 * @param {String} parentField - The parent field name
 * @returns {Array} - Array of nested field names
 */
const getNestedDecimalFields = (parentField) => {
  const nestedFields = {
    pricing: ['minSalePrice', 'maxSalePrice', 'costPrice'],
    // Add more nested field mappings as needed
  };
  
  return nestedFields[parentField] || [];
};

/**
 * Field mappings for different models
 */
const MODEL_DECIMAL_FIELDS = {
  Product: ['pricing'],
  InventoryRoll: ['initLength', 'remainingLength', 'minCutLength', 'costPerUnit'],
  StockTxn: ['qty', 'previousQty', 'newQty', 'unitCost', 'totalValue'],
  LedgerEntry: ['debit', 'credit', 'balance'],
  BargainLog: ['originalPrice', 'finalPrice', 'discountPct', 'discountAmount'],
  Unit: ['ratioToBase'],
  // Add more models as needed
};

/**
 * Convert data for a specific model
 * @param {String} modelName - The model name
 * @param {Object} data - The data to convert
 * @returns {Object} - The converted data
 */
const convertForModel = (modelName, data) => {
  const decimalFields = MODEL_DECIMAL_FIELDS[modelName] || [];
  return convertToDecimal128(data, decimalFields);
};

module.exports = {
  convertToDecimal128,
  convertNestedToDecimal128,
  convertForModel,
  MODEL_DECIMAL_FIELDS
};
