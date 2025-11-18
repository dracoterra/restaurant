/**
 * Sistema de caché inteligente para el backend
 * Usa NodeCache para caché en memoria con TTL configurable
 */

const NodeCache = require('node-cache');
const logger = require('../logger');

// Configuración de caché por tipo de dato
const cacheConfig = {
  // Caché de larga duración (1 hora) - datos que raramente cambian
  long: {
    stdTTL: 3600, // 1 hora
    checkperiod: 600, // Verificar cada 10 minutos
    useClones: false
  },
  // Caché de duración media (15 minutos) - datos que pueden cambiar ocasionalmente
  medium: {
    stdTTL: 900, // 15 minutos
    checkperiod: 300, // Verificar cada 5 minutos
    useClones: false
  },
  // Caché de corta duración (5 minutos) - datos que cambian frecuentemente
  short: {
    stdTTL: 300, // 5 minutos
    checkperiod: 60, // Verificar cada minuto
    useClones: false
  }
};

// Instancias de caché
const caches = {
  long: new NodeCache(cacheConfig.long),
  medium: new NodeCache(cacheConfig.medium),
  short: new NodeCache(cacheConfig.short)
};

// Event listeners para monitoreo
Object.keys(caches).forEach(type => {
  const cache = caches[type];
  
  cache.on('set', (key, value) => {
    logger.debug(`Cache [${type}] SET: ${key}`);
  });
  
  cache.on('del', (key, value) => {
    logger.debug(`Cache [${type}] DEL: ${key}`);
  });
  
  cache.on('expired', (key, value) => {
    logger.debug(`Cache [${type}] EXPIRED: ${key}`);
  });
  
  cache.on('flush', () => {
    logger.info(`Cache [${type}] FLUSHED`);
  });
});

/**
 * Obtener valor del caché
 * @param {string} key - Clave del caché
 * @param {string} type - Tipo de caché ('long', 'medium', 'short')
 * @returns {any|null} - Valor del caché o null si no existe
 */
function get(key, type = 'medium') {
  if (!caches[type]) {
    logger.warn(`Tipo de caché inválido: ${type}, usando 'medium'`);
    type = 'medium';
  }
  
  const value = caches[type].get(key);
  if (value !== undefined) {
    logger.debug(`Cache HIT [${type}]: ${key}`);
    return value;
  }
  
  logger.debug(`Cache MISS [${type}]: ${key}`);
  return null;
}

/**
 * Guardar valor en caché
 * @param {string} key - Clave del caché
 * @param {any} value - Valor a guardar
 * @param {string} type - Tipo de caché ('long', 'medium', 'short')
 * @param {number} ttl - TTL personalizado en segundos (opcional)
 * @returns {boolean} - true si se guardó correctamente
 */
function set(key, value, type = 'medium', ttl = null) {
  if (!caches[type]) {
    logger.warn(`Tipo de caché inválido: ${type}, usando 'medium'`);
    type = 'medium';
  }
  
  const success = ttl 
    ? caches[type].set(key, value, ttl)
    : caches[type].set(key, value);
  
  if (success) {
    logger.debug(`Cache SET [${type}]: ${key}${ttl ? ` (TTL: ${ttl}s)` : ''}`);
  }
  
  return success;
}

/**
 * Eliminar valor del caché
 * @param {string} key - Clave del caché
 * @param {string} type - Tipo de caché ('long', 'medium', 'short')
 * @returns {number} - Número de claves eliminadas
 */
function del(key, type = 'medium') {
  if (!caches[type]) {
    return 0;
  }
  
  const deleted = caches[type].del(key);
  if (deleted > 0) {
    logger.debug(`Cache DEL [${type}]: ${key}`);
  }
  
  return deleted;
}

/**
 * Eliminar múltiples claves con patrón
 * @param {string} pattern - Patrón de claves (ej: 'settings:*')
 * @param {string} type - Tipo de caché
 * @returns {number} - Número de claves eliminadas
 */
function delPattern(pattern, type = 'medium') {
  if (!caches[type]) {
    return 0;
  }
  
  const keys = caches[type].keys();
  const regex = new RegExp(pattern.replace('*', '.*'));
  let deleted = 0;
  
  keys.forEach(key => {
    if (regex.test(key)) {
      if (caches[type].del(key) > 0) {
        deleted++;
      }
    }
  });
  
  if (deleted > 0) {
    logger.debug(`Cache DEL PATTERN [${type}]: ${pattern} (${deleted} keys)`);
  }
  
  return deleted;
}

/**
 * Limpiar todo el caché de un tipo
 * @param {string} type - Tipo de caché ('long', 'medium', 'short')
 */
function flush(type = null) {
  if (type) {
    if (caches[type]) {
      caches[type].flushAll();
      logger.info(`Cache FLUSH [${type}]`);
    }
  } else {
    Object.keys(caches).forEach(t => {
      caches[t].flushAll();
    });
    logger.info('Cache FLUSH ALL');
  }
}

/**
 * Obtener estadísticas del caché
 * @param {string} type - Tipo de caché (opcional)
 * @returns {object} - Estadísticas del caché
 */
function getStats(type = null) {
  if (type) {
    if (!caches[type]) {
      return null;
    }
    return {
      type,
      keys: caches[type].keys().length,
      hits: caches[type].getStats().hits || 0,
      misses: caches[type].getStats().misses || 0
    };
  }
  
  return Object.keys(caches).reduce((stats, t) => {
    stats[t] = {
      keys: caches[t].keys().length,
      hits: caches[t].getStats().hits || 0,
      misses: caches[t].getStats().misses || 0
    };
    return stats;
  }, {});
}

/**
 * Wrapper para funciones async con caché
 * @param {string} key - Clave del caché
 * @param {Function} fn - Función async a ejecutar si no hay caché
 * @param {string} type - Tipo de caché
 * @param {number} ttl - TTL personalizado
 * @returns {Promise<any>} - Resultado de la función o del caché
 */
async function wrap(key, fn, type = 'medium', ttl = null) {
  // Intentar obtener del caché
  const cached = get(key, type);
  if (cached !== null) {
    return cached;
  }
  
  // Ejecutar función y guardar resultado
  try {
    const result = await fn();
    set(key, result, type, ttl);
    return result;
  } catch (error) {
    logger.error(`Error en cache.wrap para ${key}:`, error);
    throw error;
  }
}

module.exports = {
  get,
  set,
  del,
  delPattern,
  flush,
  getStats,
  wrap,
  // Tipos de caché disponibles
  TYPES: {
    LONG: 'long',
    MEDIUM: 'medium',
    SHORT: 'short'
  }
};

