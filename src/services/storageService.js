const STORAGE_KEYS = {
  LAST_EXPRESSION: 'compiler_last_expression',
  OPTIMIZATION_SETTINGS: 'compiler_opt_settings',
  RECENT_EXPRESSIONS: 'compiler_recent_expressions',
  THEME_PREFERENCE: 'compiler_theme_pref'
};

export const storageService = {
  getLastExpression(defaultVal) {
    try {
      return localStorage.getItem(STORAGE_KEYS.LAST_EXPRESSION) || defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },

  saveLastExpression(expr) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_EXPRESSION, expr);
      this.addRecentExpression(expr);
    } catch (e) {}
  },

  getOptimizationSettings(defaultSettings) {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPTIMIZATION_SETTINGS);
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  },

  saveOptimizationSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.OPTIMIZATION_SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  },

  getRecentExpressions() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT_EXPRESSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  addRecentExpression(expr) {
    if (!expr || !expr.trim()) return;
    try {
      let recent = this.getRecentExpressions();
      // Remove duplicate if exists
      recent = recent.filter(item => item !== expr);
      // Unshift to front
      recent.unshift(expr);
      // Keep max 10
      recent = recent.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_EXPRESSIONS, JSON.stringify(recent));
    } catch (e) {}
  },

  clearRecentExpressions() {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_EXPRESSIONS);
    } catch (e) {}
  }
};
