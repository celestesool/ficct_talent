/**
 * Sistema de caché simple para optimizar llamadas a API
 * Evita llamadas duplicadas dentro de un mismo ciclo de renderizado
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Obtiene valor del caché o ejecuta la función
   * @param {string} key - Clave única del caché
   * @param {Function} fetcher - Función que obtiene los datos
   * @param {number} ttl - Tiempo de vida en ms (default 5 min)
   * @returns {Promise} Datos cacheados o nuevos
   */
  async get(key, fetcher, ttl = 5 * 60 * 1000) {
    // Si existe en caché y no expiró, retornar
    if (this.cache.has(key)) {
      const { data, expiresAt } = this.cache.get(key);
      if (Date.now() < expiresAt) {
        console.log(`[Cache HIT] ${key}`);
        return data;
      } else {
        // Expiró, limpiar
        this.cache.delete(key);
        this.timers.delete(key);
      }
    }

    console.log(`[Cache MISS] ${key}`);
    try {
      const data = await fetcher();
      
      // Guardar en caché
      this.cache.set(key, {
        data,
        expiresAt: Date.now() + ttl
      });

      // Limpiar automáticamente después del TTL
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
      }
      
      const timer = setTimeout(() => {
        this.cache.delete(key);
        this.timers.delete(key);
      }, ttl);
      
      this.timers.set(key, timer);

      return data;
    } catch (error) {
      console.error(`[Cache ERROR] ${key}:`, error);
      throw error;
    }
  }

  /**
   * Ejecuta múltiples funciones en paralelo con caché individual
   * @param {Object} jobs - Objeto con claves y funciones
   * @param {number} ttl - Tiempo de vida del caché
   * @returns {Promise<Object>} Objeto con resultados
   */
  async parallel(jobs, ttl = 5 * 60 * 1000) {
    const promises = Object.entries(jobs).map(([key, fetcher]) =>
      this.get(key, fetcher, ttl)
        .catch(error => {
          console.error(`Error en ${key}:`, error);
          return null;
        })
    );

    const results = await Promise.all(promises);
    const output = {};
    
    Object.keys(jobs).forEach((key, index) => {
      output[key] = results[index];
    });

    return output;
  }

  /**
   * Limpia el caché específico
   */
  clear(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Limpia todo el caché
   */
  clearAll() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.timers.clear();
  }
}

export const dashboardCache = new CacheManager();
