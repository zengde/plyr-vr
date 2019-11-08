import Plyr from 'plyr';

const createPluginFactory = (name, PluginSubClass) => {
  PluginSubClass.prototype.name = name;

  return function(...args) {
    const instance = new PluginSubClass(...[this, ...args]);

    this[name] = () => instance;
    return instance;
  };
};

class Plugin {
  /**
   * Creates an instance of this class.
   *
   * Sub-classes should call `super` to ensure plugins are properly initialized.
   *
   * @param {Player} player
   *        A Video.js player instance.
   */
  constructor(player) {
    if (this.constructor === Plugin) {
      throw new Error('Plugin must be sub-classed; not directly instantiated.');
    }

    this.player = player;
  }

  static registerPlugin(name, plugin) {
    if (typeof name !== 'string') {
      throw new Error(`Illegal plugin name, "${name}", must be a string, was ${typeof name}.`);
    }

    if (typeof plugin !== 'function') {
      throw new Error(`Illegal plugin for "${name}", must be a function, was ${typeof plugin}.`);
    }

    Plyr.prototype[name] = createPluginFactory(name, plugin);

    return plugin;
  }
}

Plyr.registerPlugin = Plugin.registerPlugin;

Plyr.prototype.currentWidth = function() {
  return this.media.clientWidth;
};
Plyr.prototype.currentHeight = function() {
  return this.media.clientHeight;
};
Plyr.prototype.el = function() {
  return this.elements.wrapper;
};
Plyr.bind = function(context, fn, uid) {
  // Create the new function that changes the context
  const bound = fn.bind(context);

  return bound;
};

export { Plyr, Plugin };
